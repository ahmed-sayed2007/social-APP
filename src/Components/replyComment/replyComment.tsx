import { useContext, useState } from "react";
import axios from "axios";

import { Button, Input, TextArea } from "@heroui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { BaseUrl } from "../../Const/BaseUrl.ts";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";

interface ReplyCommentProps {
  postId: string;
  commentId: string;
  onClose: () => void;
}

export default function ReplyComment({ postId, commentId, onClose }: ReplyCommentProps) {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("there is an error");
  }

  const { token } = auth;

  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  function replyComment() {
    const formData = new FormData();

    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    return axios.post(`${BaseUrl}/posts/${postId}/comments/${commentId}/replies`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { mutate } = useMutation({
    mutationFn: replyComment,

    mutationKey: ["replyComment", commentId],

    onSuccess: () => {
      toast.success("Reply added successfully");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["userPosts"],
      });

      onClose();
    },

    onError: () => {
      toast.error("Failed to add reply");
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-5 text-xl font-bold">Reply to Comment</h2>

        <TextArea
          placeholder="Write your reply..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />

        <Input
          className="mt-4"
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files?.[0] ?? null);
          }}
        />

        <div className="mt-5 flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>

          <Button
            className="text-sky-500"
            onClick={() => {
              if (!content.trim()) {
                toast.error("Reply cannot be empty");
                return;
              }

              mutate();
            }}>
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
