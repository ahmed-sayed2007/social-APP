import { useContext, useState } from "react";
import { Button, Description, Dropdown, Header, Kbd, Label } from "@heroui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { MdLockReset } from "react-icons/md";

import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import ChangePassword from "../ChangePassword/ChangePassword.tsx";

export default function PasswordDropdown() {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("there is an error");
  }

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <Dropdown>
        <Button isIconOnly aria-label="Settings Menu" variant="secondary">
          <BsThreeDotsVertical />
        </Button>

        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Section>
              <Header>Account</Header>

              <Dropdown.Item
                id="change-password"
                textValue="Change Password"
                onClick={() => {
                  setIsChangePasswordOpen(true);
                }}>
                <div className="flex h-8 items-center justify-center">
                  <MdLockReset size={20} />
                </div>

                <div className="flex flex-col">
                  <Label>Change Password</Label>

                  <Description>Update your account password</Description>
                </div>

                <Kbd className="ms-auto" slot="keyboard" variant="light">
                  <Kbd.Content>
                    <MdLockReset size={18} />
                  </Kbd.Content>
                </Kbd>
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {isChangePasswordOpen && (
        <ChangePassword
          onClose={() => {
            setIsChangePasswordOpen(false);
          }}
        />
      )}
    </>
  );
}
