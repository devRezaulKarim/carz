/* eslint-disable @next/next/no-img-element */
import { endpoints } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { UpdateClassifiedType } from "@/schemas/classified.schema";
import { ImagePlusIcon, Loader2, X } from "lucide-react";
import {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidV4 } from "uuid";

interface MultiImageUploaderProps
  extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

type ClassifiedImage = UpdateClassifiedType["images"];
type ImageUploadProgress = {
  uuid: string;
  file: File;
  preview: string;
  progress: number;
  uploadedUrl?: string;
};

export const MultiImageUploader = ({ className }: MultiImageUploaderProps) => {
  const form = useFormContext<UpdateClassifiedType>();
  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "images",
    keyName: "uuid",
  });
  const [uploadQueue, setUploadQueue] = useState<ImageUploadProgress[]>([]);
  const [items, setItems] = useState<ClassifiedImage>(fields);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // Update form fields when items change
  useEffect(() => {
    replace(items);
  }, [items, replace]);

  // Handle file upload to ImgBB
  const uploadToImgBB = useCallback(async (file: File, uuid: string) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post<{ url: string }>(
        endpoints.images.singleUpload,
        {
          body: formData,
        },
      );
      const { url } = response;

      if (url) {
        setItems((prev) => [...prev, { src: url, alt: "", uuid: uuidV4() }]);
        setUploadQueue((prev) => prev.filter((item) => item.uuid !== uuid));
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }, []);

  // Handle dropped files
  const handleFiles = useCallback(
    (files: FileList) => {
      const newUploads = Array.from(files)
        .filter(
          (file) =>
            file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024,
        ) // 2MB limit
        .map((file) => ({
          uuid: uuidV4(),
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
        }));

      setUploadQueue((prev) => [...prev, ...newUploads]);

      newUploads.forEach((upload) => uploadToImgBB(upload.file, upload.uuid));
    },
    [uploadToImgBB],
  );

  // Drag and drop handlers
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dropZoneRef.current?.classList.remove("border-blue-500");
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add("border-blue-500");
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove("border-blue-500");
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex aspect-[4/1] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 hover:border-gray-400",
        )}
      >
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          multiple
        />

        {uploadQueue.length > 0 ? (
          <div className="grid w-full grid-cols-4 gap-4">
            {uploadQueue.map((upload) => (
              <div key={upload.uuid} className="relative">
                <img
                  src={upload.preview}
                  alt="Preview"
                  className="aspect-[3/2] w-full rounded-md object-cover"
                />
                {upload.progress < 100 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <ImagePlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              Click or drag images to upload (max 2MB each)
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Images */}
      {items.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Images</h3>
          <div className="mt-2 grid grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div key={item.uuid} className="group relative">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-24 w-full rounded-md object-cover"
                />
                <button
                  onClick={() =>
                    setItems((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
