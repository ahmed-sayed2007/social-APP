import { Button, Description, Dropdown, Header, Kbd, Label, Separator } from "@heroui/react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { MdMovieEdit } from "react-icons/md";
import { BaseUrl } from "../../Const/BaseUrl.ts";
import { useContext } from "react";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
export default function DropdownMenu({ postId }: { postId: string }) {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("there is an error");
  }

  const { token } = auth;

  function deletePost() {
    return axios.delete(`${BaseUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const query = useQueryClient();
  const { mutate, data } = useMutation({
    mutationFn: deletePost,
    mutationKey: ["deletePost"],
    onSuccess: () => {
      toast.success("post delete succussfull");
      console.log(data);
      query.invalidateQueries({
        queryKey: ["posts"],
      });
      query.invalidateQueries({
        queryKey: ["userPosts"],
      });
    },
  });
  return (
    <>
      <Dropdown>
        <Button isIconOnly aria-label="Menu" variant="secondary">
          <BsThreeDotsVertical />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
            <Dropdown.Section>
              <Header>Actions</Header>
              <Dropdown.Item id="edit-file" textValue="Edit file">
                <div className="flex h-8 items-start justify-center pt-px"></div>
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
            <Dropdown.Section>
              <Header>Danger zone</Header>
              <Dropdown.Item id="delete-file" textValue="Delete file" variant="danger">
                <Button
                  className="bg-transparent"
                  onClick={() => {
                    mutate();
                  }}>
                  <div className="flex h-8 items-start justify-center pt-px"></div>
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
                </Button>
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </>
  );
}
