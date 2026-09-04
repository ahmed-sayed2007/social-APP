import axios from "axios";
import { useContext, useState } from "react";
import { BaseUrl } from "../../Const/BaseUrl.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { userContext } from "../../context/UserContext.tsx";
import type { userType } from "../../Interface/InterfaceUser.ts";

interface LikeProps {
  likesCount: number;
  postId: string;
  liked: string[];
}

export default function Like({ likesCount, postId, liked: initialLiked }: LikeProps) {
  const auth = useContext(tokenContext);
  const user = useContext(userContext) as userType;
  if (!auth) throw new Error("Token context is not available");
  const { token } = auth;

  const [liked, setLiked] = useState<string[]>(initialLiked);
  const [count, setCount] = useState<number>(likesCount);
  const queryClient = useQueryClient();

  const likePost = () =>
    axios.put(`${BaseUrl}/posts/${postId}/like`, "", { headers: { Authorization: `Bearer ${token}` } });

  const isLiked = liked.some((idLiked) => user?._id === idLiked);

  const { mutate, isPending } = useMutation({
    mutationFn: likePost,
    onSuccess: (response) => {
      const result = response.data.data;
      if (result.liked) {
        setLiked((prev) => (prev.includes(user._id) ? prev : [...prev, user._id]));
      } else {
        setLiked((prev) => prev.filter((id) => id !== user._id));
      }
      setCount(result.likesCount);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        isLiked
          ? "text-red-500 hover:bg-red-50"
          : "text-slate-500 hover:bg-slate-100 hover:text-red-500"
      }`}>
      {isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
      <span>{count}</span>
    </button>
  );
}
