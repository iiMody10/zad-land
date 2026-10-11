"use client";

import { laravelClientFetch } from "@/lib/laravel-client";

interface UploadResponse {
    url?: string;
    error?: string;
    message?: string;
    errors?: { file?: string[] };
}

export class ImageUploadError extends Error {
    constructor(message: string, public readonly status?: number) {
        super(message);
        this.name = "ImageUploadError";
    }
}

async function optimizeImage(file: File): Promise<File> {
    if (typeof window === "undefined" || !file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml" || file.size <= 800 * 1024) {
        return file;
    }

    try {
        let width = 0;
        let height = 0;
        let source: CanvasImageSource;

        if (typeof createImageBitmap === "function") {
            const bitmap = await createImageBitmap(file);
            width = bitmap.width;
            height = bitmap.height;
            source = bitmap;
        } else {
            const img = new Image();
            const url = URL.createObjectURL(file);
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = url;
            });
            URL.revokeObjectURL(url);
            width = img.width;
            height = img.height;
            source = img;
        }

        const maxDim = 2048;
        if (width > maxDim || height > maxDim) {
            if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
            } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
            }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            if ("close" in source && typeof (source as ImageBitmap).close === "function") (source as ImageBitmap).close();
            return file;
        }

        ctx.drawImage(source, 0, 0, width, height);
        if ("close" in source && typeof (source as ImageBitmap).close === "function") (source as ImageBitmap).close();

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, "image/webp", 0.85);
        });

        if (!blob || blob.size >= file.size) {
            return file;
        }

        const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        return new File([blob], `${baseName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
        });
    } catch {
        return file;
    }
}

/** Uploads through Laravel's shared public-disk endpoint and returns its public URL. */
export async function uploadImageFile(file: File, folder: string): Promise<string> {
    const optimizedFile = await optimizeImage(file);
    const body = new FormData();
    body.append("file", optimizedFile);
    body.append("folder", folder);

    let response: Response;
    try {
        response = await laravelClientFetch("/api/upload", { method: "POST", body });
    } catch {
        throw new ImageUploadError("Could not connect to the image upload service.");
    }

    const responseText = await response.text();
    let data: UploadResponse = {};
    try {
        data = JSON.parse(responseText) as UploadResponse;
    } catch {
        // Keep the HTTP status when the server or proxy returned an HTML error page.
    }

    if (!response.ok || !data.url) {
        let message = data.errors?.file?.[0] || data.error || data.message;
        if (!message) {
            if (response.status === 413) {
                message = "حجم الصورة كبير جداً (413). تجاوز الحد الأقصى المسموح به في السيرفر.";
            } else {
                message = `Image upload failed (${response.status}).`;
            }
        }
        throw new ImageUploadError(message, response.status);
    }

    return data.url;
}
