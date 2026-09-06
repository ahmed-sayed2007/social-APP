import { useContext, useState } from "react";
import axios from "axios";

import { Button, Input, TextArea } from "@heroui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { BaseUrl } from "../../Const/BaseUrl.ts";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";

interface UpdateCommentProps {
  postId: string;
  commentId: string;
  oldContent: string;
  onClose: () => void;
}

export default function UpdateComment({ postId, commentId, oldContent, onClose }: UpdateCommentProps) {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("there is an error");
  }

  const { token } = auth;

  const queryClient = useQueryClient();

  const [content, setContent] = useState(oldContent);
  const [image, setImage] = useState<File | null>(null);

  function updateComment() {
    const formData = new FormData();

    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    return axios.put(`${BaseUrl}/posts/${postId}/comments/${commentId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateComment,

    mutationKey: ["updateComment", commentId],

    onSuccess: () => {
      toast.success("Comment updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["userPosts"],
      });

      onClose();
    },

    onError: () => {
      toast.error("Failed to update comment");
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-5 text-xl font-bold">Edit Comment</h2>

        <TextArea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          minRows={4}
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
            isLoading={isPending}
            onClick={() => {
              if (!content.trim()) {
                toast.error("Comment cannot be empty");
                return;
              }

              mutate();
            }}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
