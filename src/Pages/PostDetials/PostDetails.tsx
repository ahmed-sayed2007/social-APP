import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import axios from "axios";
import { BaseUrl } from "../../Const/BaseUrl.ts";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/loader/Loader.tsx";
import PostCard from "../../Components/PostCard/PostCard.tsx";
import { Helmet } from "react-helmet";
import { FiArrowLeft } from "react-icons/fi";

export default function PostDetails() {
  const { postId } = useParams();
  const auth = useContext(tokenContext);
  if (!auth) throw new Error("Token context is not available");
  const { token } = auth;

  function getPostDetails() {
    return axios.get(`${BaseUrl}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: getPostDetails,
    enabled: !!postId,
    select: (res) => res.data.data.post,
  });

  if (isLoading) return <Loader fullscreen />;
  if (isError) {
    return (
      <div className="feed-container text-center py-20">
        <p className="text-red-500 font-medium mb-4">Post not found or an error occurred.</p>
        <Link to="/Home" className="text-blue-600 text-sm font-medium hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Post · LinkedPost</title>
      </Helmet>
      <div className="feed-container">
        <Link
          to="/Home"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <FiArrowLeft size={16} />
          Back to feed
        </Link>
        <PostCard key={data._id} isDetails={true} {...data} />
      </div>
    </>
  );
}
