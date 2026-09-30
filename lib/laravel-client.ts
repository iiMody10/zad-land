"use client";

let csrfRequest: Promise<void> | null = null;
let loginInProgress: Promise<void> | null = null;
const pendingRequests = new Set<Promise<Response>>();

export class SessionVerificationError extends Error {
    constructor() {
        super("Could not establish the login session. Please try again.");
        this.name = "SessionVerificationError";
    }
}

async function ensureCsrfCookie() {
    if (!csrfRequest) {
        csrfRequest = fetch("/sanctum/csrf-cookie", {
            credentials: "same-origin",
            cache: "no-store",
            headers: { Accept: "application/json" },
        }).then((response) => {
            if (!response.ok) throw new SessionVerificationError();
        }).finally(() => {
            csrfRequest = null;
        });
    }
    await csrfRequest;
}

function xsrfToken() {
    const value = document.cookie.split("; ").find((cookie) => cookie.startsWith("XSRF-TOKEN="))?.slice("XSRF-TOKEN=".length);
    return value ? decodeURIComponent(value) : null;
}

async function performRequest(input: RequestInfo | URL, init: RequestInit = {}) {
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

export async function laravelClientFetch(input: RequestInfo | URL, init: RequestInit = {}) {
    while (loginInProgress) await loginInProgress;

    const request = performRequest(input, init);
    pendingRequests.add(request);
    try {
        return await request;
    } finally {
        pendingRequests.delete(request);
    }
}

export async function laravelLogin(account: "admin" | "customer", credentials: Record<string, unknown>) {
    while (loginInProgress) await loginInProgress;

    let finishLogin!: () => void;
    loginInProgress = new Promise<void>((resolve) => { finishLogin = resolve; });
    try {
        // Finish earlier API responses before rotating the session cookie, and
        // hold background requests until the new session has been verified.
        await Promise.allSettled([...pendingRequests]);
        const path = `/api/${account}/auth`;
        const response = await performRequest(`${path}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
            cache: "no-store",
        });
        if (!response.ok) return response;

        const key = account === "admin" ? "user" : "customer";
        const signedIn = await response.clone().json();
        const sessionResponse = await performRequest(`${path}/me`, { cache: "no-store" });
        const session = await sessionResponse.json().catch(() => null);
        if (!sessionResponse.ok || !signedIn?.[key]?.id || session?.[key]?.id !== signedIn[key].id) {
            throw new SessionVerificationError();
        }
        return response;
    } finally {
        loginInProgress = null;
        finishLogin();
    }
}

export function adminLoginDestination(callback: string | null) {
    if (callback && !/[\\\u0000-\u001f]/u.test(callback)) {
        const base = "https://zad-land.invalid";
        try {
            const destination = new URL(callback, base);
            if (destination.origin === base && destination.pathname.startsWith("/admin/") && !destination.pathname.startsWith("/admin/login")) {
                return `${destination.pathname}${destination.search}${destination.hash}`;
            }
        } catch {
            // Ignore malformed callback URLs and use the dashboard.
        }
    }
    return "/admin/dashboard";
}
