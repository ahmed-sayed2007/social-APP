import { useContext, useState } from "react";
import axios from "axios";

import { Button, Description, Dropdown, Header, Kbd, Label, Separator } from "@heroui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdMovieEdit, MdReply } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { BaseUrl } from "../../Const/BaseUrl.ts";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";

import UpdateComment from "../UpdateComment/UpdateComment.tsx";
import ReplyComment from "../replyComment/replyComment.tsx";

interface CommentDropdownProps {
  postId: string;
  commentId: string;
  commentContent: string;
}

export default function CommentDropdown({ postId, commentId, commentContent }: CommentDropdownProps) {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("there is an error");
  }

  const { token } = auth;

  const queryClient = useQueryClient();

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  // =========================
  // Delete Comment
  // =========================

  function deleteComment() {
    return axios.delete(`${BaseUrl}/posts/${postId}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const deleteMutation = useMutation({
    mutationFn: deleteComment,

    mutationKey: ["deleteComment", commentId],

    onSuccess: () => {
      toast.success("Comment deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["userPosts"],
      });
    },

    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  return (
    <>
      <Dropdown>
        <Button isIconOnly aria-label="Comment Menu" variant="secondary">
          <BsThreeDotsVertical />
        </Button>

        <Dropdown.Popover>
          <Dropdown.Menu>
            {/* ================= EDIT ================= */}

            <Dropdown.Section>
              <Header>Actions</Header>

              <Dropdown.Item
                id="edit-comment"
                textValue="Edit comment"
                onClick={() => {
                  setIsUpdateOpen(true);
                }}>
                <div className="flex h-8 items-start justify-center pt-px">
                  <MdMovieEdit />
                </div>

                <div className="flex flex-col">
                  <Label>Edit comment</Label>
                  <Description>Make changes to your comment</Description>
                </div>

                <Kbd className="ms-auto" slot="keyboard" variant="light">
                  <Kbd.Content>
                    <MdMovieEdit />
                  </Kbd.Content>
                </Kbd>
              </Dropdown.Item>

              {/* ================= REPLY ================= */}

              <Dropdown.Item
                id="reply-comment"
                textValue="Reply"
                onClick={() => {
                  setIsReplyOpen(true);
                }}>
                <div className="flex h-8 items-start justify-center pt-px">
                  <MdReply />
                </div>

                <div className="flex flex-col">
                  <Label>Reply</Label>
                  <Description>Reply to this comment</Description>
                </div>

                <Kbd className="ms-auto" slot="keyboard" variant="light">
                  <Kbd.Content>
                    <MdReply />
                  </Kbd.Content>
                </Kbd>
              </Dropdown.Item>
            </Dropdown.Section>

            <Separator />

            {/* ================= DELETE ================= */}

            <Dropdown.Section>
              <Header>Danger zone</Header>

              <Dropdown.Item
                id="delete-comment"
                textValue="Delete comment"
                variant="danger"
                onClick={() => {
                  deleteMutation.mutate();
                }}>
                <div className="flex h-8 items-start justify-center pt-px">
                  <MdDelete />
                </div>

                <div className="flex flex-col">
                  <Label>Delete comment</Label>
                  <Description>Permanently delete this comment</Description>
                </div>

                <Kbd className="ms-auto" slot="keyboard" variant="light">
                  <Kbd.Content>
                    <MdDelete />
                  </Kbd.Content>
                </Kbd>
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {/* ================= UPDATE FORM ================= */}

      {isUpdateOpen && (
        <UpdateComment
          postId={postId}
          commentId={commentId}
          oldContent={commentContent}
          onClose={() => {
            setIsUpdateOpen(false);
          }}
        />
      )}

      {/* ================= REPLY FORM ================= */}

      {isReplyOpen && (
        <ReplyComment
          postId={postId}
          commentId={commentId}
          onClose={() => {
            setIsReplyOpen(false);
          }}
        />
      )}
    </>
  );
}
