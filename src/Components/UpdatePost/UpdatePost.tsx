import { Button, TextArea, Input } from "@heroui/react";

import { type ChangeEvent, useContext, useState } from "react";

import axios from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import { BaseUrl } from "../../Const/BaseUrl.ts";

import { tokenContext } from "../../context/tokenContwxtProvider.tsx";

interface UpdatePostProps {
  postId: string;
  oldBody: string;
  onClose: () => void;
}

export default function UpdatePost({ postId, oldBody, onClose }: UpdatePostProps) {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("There is an error");
  }

  const { token } = auth;

  const queryClient = useQueryClient();

  const [body, setBody] = useState(oldBody);

  const [image, setImage] = useState<File | null>(null);

  const updatePost = async () => {
    const formData = new FormData();

    formData.append("body", body);

    if (image) {
      formData.append("image", image);
    }

    return axios.put(`${BaseUrl}/posts/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,

    onSuccess: () => {
      toast.success("Post updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["userPosts"],
      });

      onClose();
    },

    onError: (error) => {
      console.error(error);

      toast.error("Failed to update post");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!body.trim()) {
      toast.error("Post body is required");

      return;
    }

    mutate();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-xl text-white font-bold">Update Post</h2>

          <TextArea placeholder="Write your post..." value={body} onChange={(e: any) => setBody(e.target.value)} />

          <Input
            type="file"
            accept="image/*"
            onChange={(e: any) => {
              const file = e.target.files?.[0];

              if (file) {
                setImage(file);
              }
            }}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" className="text-sky-500" isDisabled={isPending}>
              {isPending ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
