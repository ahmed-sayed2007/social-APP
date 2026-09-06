import { useContext } from "react";
import { userContext } from "../../context/UserContext.tsx";
import type { userType } from "../../Interface/InterfaceUser.ts";
import imgCover from "../../assets/images.jpg";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import axios from "axios";
import { BaseUrl } from "../../Const/BaseUrl.ts";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/loader/Loader.tsx";
import PostCard from "../../Components/PostCard/PostCard.tsx";
import type { postInterface } from "../../Interface/InterfacePost.ts";
import CreatePost from "../../Components/CreatePost/CreatePost.tsx";
import { Helmet } from "react-helmet";
import PasswordDropdown from "../../Components/PasswordDropdown/PasswordDropdown.tsx";
import UpdateProfilePhoto from "../../Components/UpdateProfilePhoto/UpdateProfilePhoto.tsx";

export default function Profile() {
  const auth = useContext(userContext) as userType;
  const user = auth;
  const text = useContext(tokenContext);
  if (!text) throw new Error("TokenContext must be used inside TokenContextProvider");
  const { token } = text;

  function getUserPosts() {
    return axios.get(`${BaseUrl}/users/${user?.id}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const {
    data: postsUser,
    isLoading,
    isError,
  } = useQuery({
    queryFn: getUserPosts,
    queryKey: ["userPosts"],
    select: (res) => res.data.data.posts,
  });

  if (isLoading) return <Loader fullscreen />;
  if (isError) {
    return (
      <div className="feed-container text-center py-20">
        <p className="text-red-500 font-medium">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{user?.name} · LinkedPost</title>
      </Helmet>

      {/* Profile header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto">
          <div className="h-44 sm:h-52 overflow-hidden">
            <img src={user?.cover || imgCover} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-end gap-4 -mt-12">
              <img
                src={user?.photo}
                alt={user?.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              <div>
                <UpdateProfilePhoto />
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
                <p className="text-sm text-slate-500">@{user?.username}</p>
              </div>
            </div>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-bold text-slate-800">{user?.followersCount ?? 0}</span>
                <span className="text-slate-500 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">{user?.followingCount ?? 0}</span>
                <span className="text-slate-500 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">{postsUser?.length ?? 0}</span>
                <span className="text-slate-500 ml-1">Posts</span>
              </div>
              <div className="ml-auto">
                <PasswordDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts feed */}
      <div className="feed-container">
        <CreatePost />
        {postsUser?.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-slate-400 text-sm">No posts yet. Share your first thought!</p>
          </div>
        ) : (
          postsUser?.map((post: postInterface) => <PostCard key={post._id} {...post} />)
        )}
      </div>
    </>
  );
}
