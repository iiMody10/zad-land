"use client";

let csrfRequest: Promise<void> | null = null;

async function ensureCsrfCookie() {
    if (!csrfRequest) {
        csrfRequest = fetch("/sanctum/csrf-cookie", {
            credentials: "same-origin",
            headers: { Accept: "application/json" },
        }).then(() => undefined).finally(() => {
            csrfRequest = null;
        });
    }
    await csrfRequest;
}

function xsrfToken() {
    const value = document.cookie.split("; ").find((cookie) => cookie.startsWith("XSRF-TOKEN="))?.slice("XSRF-TOKEN=".length);
    return value ? decodeURIComponent(value) : null;
}

export async function laravelClientFetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const method = (init.method || "GET").toUpperCase();
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");

    if (!new Set(["GET", "HEAD", "OPTIONS"]).has(method)) {
        await ensureCsrfCookie();
        const token = xsrfToken();
        if (token) headers.set("X-XSRF-TOKEN", token);
    }

    return fetch(input, { ...init, headers, credentials: "same-origin" });
}
