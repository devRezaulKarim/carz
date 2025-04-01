/* eslint-disable @next/next/no-img-element */
import { MAX_IMAGES } from "@/config/constants";
import { endpoints } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { generateThumbhashFromFile } from "@/lib/thumbhash-client";
import { cn } from "@/lib/utils";
import { UpdateClassifiedType } from "@/schemas/classified.schema";
import { ImagePlusIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import {
  DragEvent,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { createPngDataUri } from "unlazy/thumbhash";
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
  const [draggingOver, setDraggingOver] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update form fields when items change
  useEffect(() => {
    replace(items);
  }, [items, replace]);

  // Handle file upload to ImgBB
  const uploadToImgBB = useCallback(async (file: File, uuid: string) => {
    setError(null);
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
        const thumbhash = await generateThumbhashFromFile(file);
        const base64 = createPngDataUri(thumbhash);
        setItems((prev) => [
          ...prev,
          { src: url, alt: file.name, uuid: uuidV4(), base64 },
        ]);
        setUploadQueue((prev) => prev.filter((item) => item.uuid !== uuid));
      }
    } catch (error) {
      setError("Failed to upload image. Please try again.");
      console.error("Upload failed:", error);
    }
  }, []);

  // Handle dropped files
  const handleFiles = useCallback(
    (files: File[]) => {
      setError(null);
      if (items.length >= 20) {
        setError(`You can't upload more than ${MAX_IMAGES} images.`);
      }
      const newUploads = Array.from(files)
        .filter(
          (file) =>
            file.type.startsWith("image/") &&
            file.size <= 2 * 1024 * 1024 &&
            items.length < 20,
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
    [uploadToImgBB, items.length],
  );

  // Drag and drop handlers
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggingOver(false);
      const files = Array.from(e.dataTransfer.files);
      const currentlyUploaded = items.length + uploadQueue.length;
      const remainingSlots = MAX_IMAGES - currentlyUploaded;
      const newUploadableFiles = files.slice(0, remainingSlots);
      handleFiles(newUploadableFiles);
    },
    [handleFiles, items.length, uploadQueue.length],
  );

  const stopEvent = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e: DragEvent<HTMLInputElement>) => {
    stopEvent(e);
  };
  const handleDragLeave = (e: DragEvent<HTMLInputElement>) => {
    stopEvent(e);
    setDraggingOver(false);
  };
  const handleDragOver = (e: DragEvent<HTMLInputElement>) => {
    stopEvent(e);
    setDraggingOver(true);
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentlyUploaded = items.length + uploadQueue.length;
      const remainingSlots = MAX_IMAGES - currentlyUploaded;
      const newUploadableFiles = files.slice(0, remainingSlots);
      handleFiles(newUploadableFiles);
    }
  };
  useEffect(() => {
    console.log(error);
  }, [error]);
  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDrop={onDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        onKeyDown={() => null}
        className={cn(
          "relative flex aspect-[4/1] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 hover:border-gray-400",
          draggingOver && "border-blue-500 opacity-50",
          error && "border-2 border-dotted border-red-500 hover:border-red-400",
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
              <span className="text-blue-500">Click</span> or drag images to
              upload
            </p>
            <p className="mt-1 text-sm text-gray-600">
              JPG, PNG, WEBP up to 2MB each
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* Uploaded Images */}
      {items.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-300">Uploaded Images</h3>
          <div className="mt-2 grid grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div key={item.uuid} className="group relative">
                <Image
                  width={150}
                  height={100}
                  blurDataURL={item.base64}
                  placeholder={item.base64 ? "blur" : "empty"}
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
