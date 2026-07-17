import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react"

interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

export type UploadWidgetValue = {
  url: string;
  publicId?: string;
} | null;

interface UploadWidgetProps {
  value: UploadWidgetValue;
  onChange: (url: UploadWidgetValue) => void;
}

function UploadWidget({ value, onChange }: UploadWidgetProps) {
  const [preview, setPreview] = useState<UploadWidgetValue>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      widgetRef.current = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          maxFiles: 1,
          clientAllowedFormats: ["png", "jpeg", "webp"],
          maxFileSize: 5000000,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const responseData = result.info;
            setPreview(responseData);
            onChangeRef.current(responseData);
          }
        }
      );
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  const handleUploadClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.error("Cloudinary widget is not initialized. Make sure the script is loaded.");
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChangeRef.current(null);
  };

  return (
    <div>
      {preview?.url ? (
        <div className="relative upload-preview w-full h-48 rounded-lg overflow-hidden border border-neutral-200">
          <img
            src={preview.url}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div onClick={handleUploadClick} className="upload-dropzone">
          <ImagePlus className="w-10 h-10 mb-3 text-neutral-400 animate-pulse" />
          <p className="mb-2 text-sm text-neutral-500 font-semibold">Upload Image</p>
          <p className="text-xs text-neutral-400">PNG, JPG or WEBP (max. 5MB)</p>
        </div>
      )}

    </div>
  )
}

export default UploadWidget