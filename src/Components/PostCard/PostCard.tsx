import { Link } from "react-router-dom";
import type { postInterface } from "../../Interface/InterfacePost.ts";
import { useContext } from "react";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import axios from "axios";
import { BaseUrl } from "../../Const/BaseUrl.ts";
import { useQuery } from "@tanstack/react-query";
import CreateComment from "../CreateComment/CreateComment.tsx";
import Dropdown from "../DropDown/Dropdown.tsx";
import type { userType } from "../../Interface/InterfaceUser.ts";
import { userContext } from "../../context/UserContext.tsx";
import Like from "../LIke/Like.tsx";
import { FiMessageCircle } from "react-icons/fi";
import CommentDropdown from "../CommentDropdown/CommentDropdown.tsx";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostCard({
  image,
  topComment,
  commentsCount,
  likesCount,
  body,
  id: postId,
  createdAt,
  isDetails,
  likes,
  user: { photo, name, _id },
}: postInterface) {
  const auth = useContext(tokenContext);
  if (!auth) throw new Error("Token context is not available");
  const { token } = auth;
  const user = useContext(userContext) as userType;

  function getCommentsForPost() {
    return axios.get(`${BaseUrl}/posts/${postId}/comments?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data: comments } = useQuery({
    queryKey: ["postComment", postId],
    queryFn: getCommentsForPost,
    enabled: !!token && !!postId && !!isDetails,
    select: (res) => res?.data.data.comments,
  });

  return (
    <article className={`card card-hover mb-4 overflow-hidden ${isDetails ? "max-w-2xl mx-auto" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
          <div>
            <p className="font-semibold text-slate-800 text-sm">{name}</p>
            <p className="text-xs text-slate-400">{formatDate(createdAt)}</p>
          </div>
        </div>
        {user?._id === _id && <Dropdown postId={postId} postBody={body ?? ""} />}
      </div>

      {/* Body */}
      {body && (
        <div className="px-5 pb-3">
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{body}</p>
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="px-5 pb-3">
          <img src={image} alt="Post" className="w-full rounded-xl object-cover max-h-80" />
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-between px-5 py-2 text-xs text-slate-400 border-t border-slate-100">
        <span>{likesCount ?? 0} likes</span>
        <span>{commentsCount ?? 0} comments</span>
      </div>

      {/* Actions */}
      <div className="flex items-center border-t border-slate-100 divide-x divide-slate-100">
        <div className="flex-1 flex justify-center py-1">
          <Like liked={likes} likesCount={Number(likesCount ?? 0)} postId={postId} />
        </div>
        <div className="flex-1 flex justify-center py-2.5">
          {!isDetails ? (
            <Link
              to={`/postDetails/${postId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors">
              <FiMessageCircle size={16} />
              <span className="text-sky-500 cursor-pointer">View post details</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-slate-400">
              <FiMessageCircle size={16} />
              Comments
            </span>
          )}
        </div>
      </div>

      {/* Comment input */}
      <div className="px-5 pb-4 border-t border-slate-100">
        <CreateComment id={postId} />
      </div>

      {/* Comments section */}
      <div className="px-5 pb-5">
        {isDetails && comments && comments.length > 0 ? (
          <div className="space-y-3 mt-2">
            {comments.map(
              (comment: { _id: string; commentCreator?: { photo: string; name: string }; content: string }) => (
                <div key={comment._id} className="flex gap-2.5">
                  <img
                    src={comment.commentCreator?.photo}
                    alt={comment.commentCreator?.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="bg-slate-50 rounded-xl px-3 py-2 flex-1">
                    <p className="text-xs font-semibold text-slate-700">{comment.commentCreator?.name}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{comment.content}</p>{" "}
                    {comment._id == postId ? (
                      <CommentDropdown postId={postId} commentId={comment._id} commentContent={comment.content} />
                    ) : null}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : topComment ? (
          <div className="flex gap-2.5 mt-2">
            <img
              src={topComment.commentCreator?.photo}
              alt={topComment.commentCreator?.name}
              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
            />
            <div className="bg-slate-50 fle rounded-xl px-3 py-2 flex-1">
              <p className="text-xs font-semibold text-slate-700">{topComment.commentCreator?.name}</p>
              <div className="flex justify-between">
                <p className="text-sm text-slate-600 mt-0.5">{topComment.content}</p>
                {topComment?.commentCreator?._id === user._id ? (
                  <CommentDropdown postId={postId} commentId={topComment._id} commentContent={topComment.content} />
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-2">No comments yet — be the first!</p>
        )}
      </div>
    </article>
  );
}
