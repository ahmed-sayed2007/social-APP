import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import axios from "axios";
import { BaseUrl } from "../../Const/BaseUrl.ts";
import PostCard from "../PostCard/PostCard.tsx";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader/Loader.tsx";
import { useContext } from "react";
import type { postInterface } from "../../Interface/InterfacePost.ts";

export default function AllPosts() {
  const auth = useContext(tokenContext);
  if (!auth) throw new Error("Token context is not available");
  const { token } = auth;

  async function getAllPosts() {
    return axios.get(`${BaseUrl}/posts?sort=-createdAt`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data: postsData, isError, isLoading } = useQuery({
    queryFn: getAllPosts,
    queryKey: ["posts"],
    select: (res) => res.data.data.posts,
  });

  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 text-sm font-medium">Failed to load posts. Please refresh.</p>
      </div>
    );
  }

  if (!postsData?.length) {
    return (
      <div className="card p-10 text-center">
        <p className="text-slate-400 text-sm">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <>
      {postsData.map((post: postInterface) => (
        <PostCard key={post._id} {...post} />
      ))}
    </>
  );
}
