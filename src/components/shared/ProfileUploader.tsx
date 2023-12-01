import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void;
  imageUrl: string;
};
const ProfileUploader = ({ fieldChange, imageUrl }: ProfileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(imageUrl);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".svg", ".jpeg", ".jpg"] },
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="flex items-center gap-4 cursor-pointer">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:body-bold">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;
