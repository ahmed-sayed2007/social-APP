import { useContext, useState } from "react";
import axios, { AxiosError } from "axios";

import { Button, Input } from "@heroui/react";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { BaseUrl } from "../../Const/BaseUrl.ts";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";

interface ChangePasswordProps {
  onClose: () => void;
}

interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

interface ErrorResponse {
  message?: string;
}

export default function ChangePassword({ onClose }: ChangePasswordProps) {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("there is an error");
  }

  const { token } = auth;

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function changePassword() {
    return axios.patch(
      `${BaseUrl}/users/change-password`,
      {
        password,
        newPassword,
      } satisfies ChangePasswordPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { mutate } = useMutation<unknown, AxiosError<ErrorResponse>>({
    mutationFn: changePassword,

    mutationKey: ["changePassword"],

    onSuccess: () => {
      toast.success("Password changed successfully");

      setPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onClose();
    },

    onError: (error) => {
      const message = error.response?.data?.message ?? "Failed to change password";
      toast.error(message);
    },
  });

  function validatePassword(password: string): string[] {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[#?!@$%^&*-]/.test(password)) {
      errors.push("Password must contain at least one special character (#?!@$%^&*-)");
    }

    return errors;
  }

  function handleSubmit() {
    if (!password.trim()) {
      toast.error("Please enter your current password");
      return;
    }

    const errors = validatePassword(newPassword);

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    if (newPassword === password) {
      toast.error("New password must be different from current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    mutate();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-6 text-xl font-bold">Change Password</h2>

        <div className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Enter your current password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />

          <Input
            type="password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>

          <Button className="text-sky-500" onClick={handleSubmit}>
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
