"use client";

import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/showToast";
import { CldUploadWidget } from "next-cloudinary";
import { FaPlus } from "react-icons/fa";

const UploadMedia = ({ isMultiple }) => {
  const handleOnError = (error) => {
    showToast("error", error.statusText);
  };
  const handleOnQueueEnd = async (results) => {
    console.log("results", results);
  };
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-signature"
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onError={handleOnError}
      onQueuesEnd={handleOnQueueEnd}
      config={{
        cloud: {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
        },
      }}
      options={{
        multiple: isMultiple,
        sources: ["local", "url", "unsplash", "google_drive"],
      }}
    >
      {({ open }) => {
        return (
          <Button onClick={() => open()}>
            <FaPlus />
            Upload Media
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};

export default UploadMedia;
