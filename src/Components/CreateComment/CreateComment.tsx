import { Input } from "@heroui/react";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaRegImage } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { BaseUrl } from "../../Const/BaseUrl.ts";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CommentForm {
  content: string;
}

export default function CreateComment({ id }: { id: string }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const auth = useContext(tokenContext);
  if (!auth) throw new Error("auth is null");
  const { token } = auth;

  const [imgFile, setImgFile] = useState<File | null>(null);
  const { handleSubmit, reset, register } = useForm<CommentForm>({ defaultValues: { content: "" } });
  const queryClient = useQueryClient();

  const createComment = (fd: FormData) =>
    axios.post(`${BaseUrl}/posts/${id}/comments`, fd, { headers: { Authorization: `Bearer ${token}` } });

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      reset();
      setImgFile(null);
      if (fileRef.current) fileRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["postComment", id] });
    },
  });

  const sendData: SubmitHandler<CommentForm> = (data) => {
    if (!imgFile && !data.content.trim()) return;
    const fd = new FormData();
    if (data.content.trim()) fd.append("content", data.content);
    if (imgFile) fd.append("image", imgFile);
    mutate(fd);
  };

  const getFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImgFile(file);
  };

  return (
    <form onSubmit={handleSubmit(sendData)} className="flex items-center gap-2 mt-3">
      <input
        {...register("content")}
        type="text"
        placeholder="Write a comment…"
        className="flex-1 input-field text-sm py-2"
      />
      <Input onChange={getFileImage} type="file" accept="image/*" hidden ref={fileRef} />
      <button
        type="button"
        aria-label="Attach image"
        onClick={() => fileRef.current?.click()}
        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-500 transition-colors">
        <FaRegImage size={16} />
      </button>
      <button
        type="submit"
        disabled={isPending}
        className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50">
        <FiSend size={16} />
      </button>
    </form>
  );
}
