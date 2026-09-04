import { useContext, useRef, useState } from "react";
import { userContext } from "../../context/UserContext.tsx";
import type { userType } from "../../Interface/InterfaceUser.ts";
import { Input } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseUrl } from "../../Const/BaseUrl.ts";
import { useForm, type SubmitHandler } from "react-hook-form";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import { FaRegImage } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import axios from "axios";

interface postForm {
  body: string;
}

export default function CreatePost() {
  const auth = useContext(userContext) as userType;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const tokenc = useContext(tokenContext);
  if (!tokenc) throw new Error("auth is null");
  const { token } = tokenc;

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const { handleSubmit, reset, register } = useForm<postForm>({ defaultValues: { body: "" } });
  const queryClient = useQueryClient();

  const createPost = (fd: FormData) =>
    axios.post(`${BaseUrl}/posts`, fd, { headers: { Authorization: `Bearer ${token}` } });

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      reset();
      setImgFile(null);
      setImgPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const sendData: SubmitHandler<postForm> = (data) => {
    if (!imgFile && !data.body.trim()) return;
    const fd = new FormData();
    if (data.body.trim()) fd.append("body", data.body);
    if (imgFile) fd.append("image", imgFile);
    mutate(fd);
  };

  const getFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const user = auth;

  return (
    <div className="card p-5 mb-5">
      <div className="flex items-center gap-3 mb-4">
        <img src={user?.photo} alt={user?.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-50" />
        <div>
          <p className="font-semibold text-slate-800 text-sm">{user?.name}</p>
          <p className="text-xs text-slate-400">Share something with your network</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(sendData)}>
        <textarea
          {...register("body")}
          rows={3}
          placeholder="What's on your mind?"
          className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50"
        />

        {imgPreview && (
          <div className="relative mt-3 rounded-xl overflow-hidden">
            <img src={imgPreview} alt="Preview" className="w-full max-h-48 object-cover" />
            <button
              type="button"
              onClick={() => { setImgFile(null); setImgPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
              className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg hover:bg-black/70">
              Remove
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Input onChange={getFileImage} type="file" accept="image/*" hidden ref={fileRef} />
            <button
              type="button"
              aria-label="Attach image"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
              <FaRegImage className="text-blue-500" size={18} />
              <span className="hidden sm:inline">Photo</span>
            </button>
          </div>
          <button type="submit" disabled={isPending} className="btn-primary py-2 px-5 text-sm">
            {isPending ? "Posting…" : <><FiSend size={16} /> Post</>}
          </button>
        </div>
      </form>
    </div>
  );
}
