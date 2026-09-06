import { useContext, useRef, useState } from "react";
import axios, { AxiosError } from "axios";

import { Spinner } from "@heroui/react";
import { Pencil } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { BaseUrl } from "../../Const/BaseUrl.ts";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";

interface UpdateProfilePhotoProps {
  currentPhotoUrl?: string;
  onSuccess?: (newPhotoUrl?: string) => void;
}

interface ErrorResponse {
  message?: string;
}

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function UpdateProfilePhoto({ onSuccess }: UpdateProfilePhotoProps) {
  const auth = useContext(tokenContext);

  if (!auth) {
    throw new Error("there is an error");
  }

  const { token } = auth;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentPhotoUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function uploadPhoto() {
    if (!selectedFile) {
      return Promise.reject(new Error("No file selected"));
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    return axios.put(`${BaseUrl}/users/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<unknown, AxiosError<ErrorResponse>>({
    mutationFn: uploadPhoto,

    mutationKey: ["updateProfilePhoto"],

    onSuccess: (data) => {
      toast.success("Profile photo updated successfully");
      const responseData = data as { data?: { photo?: string } };
      onSuccess?.(responseData?.data?.photo);
      queryClient.invalidateQueries({
        queryKey: ["userData"],
      });
    },

    onError: (error) => {
      const message = error.response?.data?.message ?? "Failed to update profile photo";
      toast.error(message);

      // revert preview back to the last confirmed photo on failure
      // setPreviewUrl(currentPhotoUrl);
      setSelectedFile(null);
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please select a valid image file (PNG, JPG, or WEBP)");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setSelectedFile(file);
    // setPreviewUrl(URL.createObjectURL(file));

    mutate();
  }

  function handleEditClick() {
    if (isPending) return;
    fileInputRef.current?.click();
  }

  return (
    <div className="relative inline-block h-24 w-24">
      {/* <div className="h-24 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        {previewUrl ? (
          <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">No photo</div>
        )}
      </div> */}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        aria-label="Edit profile photo"
        onClick={handleEditClick}
        disabled={isPending}
        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-white shadow-md transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-900">
        {isPending ? <Spinner size="sm" className="text-white" /> : <Pencil size={14} />}
      </button>
    </div>
  );
}
