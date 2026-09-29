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

/** Uploads through Laravel's shared public-disk endpoint and returns its public URL. */
export async function uploadImageFile(file: File, folder: string): Promise<string> {
    const body = new FormData();
    body.append("file", file);
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
        const message = data.errors?.file?.[0] || data.error || data.message || `Image upload failed (${response.status}).`;
        throw new ImageUploadError(message, response.status);
    }

    return data.url;
}
