import { Button, Description, Dropdown, Header, Kbd, Label, Separator } from "@heroui/react";

import axios from "axios";

import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdMovieEdit } from "react-icons/md";

import { BaseUrl } from "../../Const/BaseUrl.ts";

import { useContext, useState } from "react";

import { tokenContext } from "../../context/tokenContwxtProvider.tsx";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import UpdatePost from "../UpdatePost/UpdatePost.tsx";

interface DropdownMenuProps {
  postId: string;
  postBody: string;
}

export default function DropdownMenu({ postId, postBody }: DropdownMenuProps) {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("There is an error");
  }

  const { token } = auth;

  const [isEditOpen, setIsEditOpen] = useState(false);

  function deletePost() {
    return axios.delete(`${BaseUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const query = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deletePost,

    mutationKey: ["deletePost"],

    onSuccess: () => {
      toast.success("Post deleted successfully");

      query.invalidateQueries({
        queryKey: ["posts"],
      });

      query.invalidateQueries({
        queryKey: ["userPosts"],
      });
    },

    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  return (
    <>
      <Dropdown>
        <Button isIconOnly aria-label="Menu" variant="secondary">
          <BsThreeDotsVertical />
        </Button>

        <Dropdown.Popover>
          <Dropdown.Menu
            onAction={(key) => {
              console.log(`Selected: ${key}`);
            }}>
            <Dropdown.Section>
              <Header>Actions</Header>

              {/* EDIT */}
              <Dropdown.Item
                id="edit-file"
                textValue="Edit file"
                onClick={() => {
                  setIsEditOpen(true);
                }}>
                <div className="flex h-8 items-start justify-center pt-px">
                  <MdMovieEdit />
                </div>

                <div className="flex flex-col">
                  <Label>Edit file</Label>

                  <Description>Make changes</Description>
                </div>

                <Kbd className="ms-auto" slot="keyboard" variant="light">
                  <Kbd.Abbr keyValue="command" />

                  <Kbd.Content>
                    <MdMovieEdit />
                  </Kbd.Content>
                </Kbd>
              </Dropdown.Item>
            </Dropdown.Section>

            <Separator />

            {/* DELETE */}
            <Dropdown.Section>
              <Header>Danger zone</Header>

              <Dropdown.Item
                id="delete-file"
                textValue="Delete file"
                variant="danger"
                onClick={() => {
                  mutate();
                }}>
                <div className="flex flex-col">
                  <Label>Delete file</Label>

                  <Description>Move to trash</Description>
                </div>

                <Kbd className="ms-auto" slot="keyboard" variant="light">
                  <Kbd.Abbr keyValue="command" />
                  <Kbd.Abbr keyValue="shift" />

                  <Kbd.Content>
                    <MdDelete />
                  </Kbd.Content>
                </Kbd>
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {/* UPDATE FORM */}
      {isEditOpen && <UpdatePost postId={postId} oldBody={postBody} onClose={() => setIsEditOpen(false)} />}
    </>
  );
}
