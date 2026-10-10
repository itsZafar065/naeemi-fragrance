"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, Trash2, Link2, Loader2, Check, AlertCircle, RefreshCw } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  compact?: boolean;
}

// Client-side helper to compress & resize large camera photos before sending to API
async function optimizeImageBeforeUpload(file: File): Promise<File> {
  // If file is already small (< 600KB) and web-friendly, send as is
  if (file.size <= 600 * 1024 && file.type === "image/webp") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return resolve(file); // fallback
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format with 0.85 quality
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: "image/webp",
              });
              resolve(optimizedFile);
            } else {
              resolve(file); // Keep original if compression wasn't smaller
            }
          },
          "image/webp",
          0.85
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export default function ImageUploader({
  value,
  onChange,
  label = "Product Image",
  required = false,
  compact = false,
}: ImageUploaderProps) {
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please select a valid image (JPEG, PNG, or WEBP).");
      return;
    }

    setErrorMessage("");
    setUploading(true);

    try {
      // Optimize image on client side
      const optimizedFile = await optimizeImageBeforeUpload(file);

      const formData = new FormData();
      formData.append("file", optimizedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const hasValue = Boolean(value && value.trim() !== "");
  const isGradient = hasValue && value.startsWith("linear-gradient");

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </label>

          {/* Mode Toggle Button */}
          {!compact && (
            <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all ${
                  uploadMode === "file"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 ${
                  uploadMode === "url"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Link2 className="w-3 h-3" />
                Paste Link
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Compact Mode Layout */}
      {compact ? (
        <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-stone-200">
          {/* Mini preview */}
          <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 shrink-0 flex items-center justify-center">
            {hasValue ? (
              isGradient ? (
                <div className="w-full h-full" style={{ background: value }} />
              ) : (
                <Image
                  src={value}
                  alt="Variant preview"
                  fill
                  unoptimized={value.startsWith("data:")}
                  className="object-cover"
                />
              )
            ) : (
              <ImageIcon className="w-4 h-4 text-stone-400" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
            {uploadMode === "file" ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 hover:text-amber-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-amber-400 px-2.5 py-1.5 rounded-lg transition-all"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5 text-amber-700" />
                )}
                <span>{hasValue ? "Change Photo" : "Upload Photo"}</span>
              </button>
            ) : (
              <input
                type="text"
                placeholder="Image URL..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 min-w-[120px] px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono focus:outline-none"
              />
            )}

            {hasValue && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setUploadMode(uploadMode === "file" ? "url" : "file")}
              className="text-[10px] text-amber-700 hover:text-amber-800 underline font-semibold ml-auto"
            >
              {uploadMode === "file" ? "Paste Link" : "Upload File"}
            </button>
          </div>
        </div>
      ) : uploadMode === "file" ? (
        <div>
          {hasValue ? (
            /* Current Image Preview Card */
            <div className="border border-stone-200 bg-stone-50/70 rounded-2xl p-3 flex items-center gap-4 transition-all">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-300 bg-white shadow-xs shrink-0 flex items-center justify-center">
                {isGradient ? (
                  <div className="w-full h-full" style={{ background: value }} />
                ) : (
                  <Image
                    src={value}
                    alt="Product preview"
                    fill
                    unoptimized={value.startsWith("data:")}
                    className="object-contain p-1"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Check className="w-3 h-3" />
                    Image Ready
                  </span>
                  {successNotice && (
                    <span className="text-[11px] font-medium text-amber-700 animate-pulse">
                      Just uploaded!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 truncate font-mono">
                  {value}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-amber-800 bg-white border border-stone-200 hover:border-amber-400 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                  >
                    {uploading ? (
                      <Loader2 className="w-3 h-3 animate-spin text-amber-700" />
                    ) : (
                      <RefreshCw className="w-3 h-3 text-stone-600" />
                    )}
                    Change Image
                  </button>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => onChange("")}
                    className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Drag & Drop Dropzone */
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-amber-600 bg-amber-50/60 scale-[1.01]"
                  : "border-stone-300 hover:border-amber-500 bg-stone-50/50 hover:bg-white"
              } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-11 h-11 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800 shadow-2xs">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-amber-700" />
                  ) : (
                    <UploadCloud className="w-5 h-5 text-amber-800" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-stone-800">
                    {uploading
                      ? "Uploading image..."
                      : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Select any photo from your computer (PNG, JPG, WEBP)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Manual URL / Path Input */
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              required={required}
              placeholder="e.g. /oud.jpeg or https://images.unsplash.com/..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-600 transition-colors"
            />
            <Link2 className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[11px] text-stone-500">
            You can enter an external web URL or a public image path.
          </p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
