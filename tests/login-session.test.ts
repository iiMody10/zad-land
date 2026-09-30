import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { adminLoginDestination, laravelClientFetch, laravelLogin, SessionVerificationError } from "../lib/laravel-client";

const originalFetch = globalThis.fetch;
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
});

function browserCookies() {
    Object.defineProperty(globalThis, "document", { configurable: true, value: { cookie: "XSRF-TOKEN=test-token" } });
}

for (const account of ["admin", "customer"] as const) {
    test(`${account}: first login waits for earlier responses and verifies the new session before releasing background requests`, async () => {
        browserCookies();
        const key = account === "admin" ? "user" : "customer";
        const calls: string[] = [];
        let finishOldRequest!: (response: Response) => void;
        let finishVerification!: (response: Response) => void;
        let verificationStarted!: () => void;
        const verifying = new Promise<void>((resolve) => { verificationStarted = resolve; });
        let sessionCookie = "signed-out";
        globalThis.fetch = async (input, init) => {
            const path = String(input);
            calls.push(path);
            assert.equal(init?.credentials, "same-origin");
            if (path === "/old-wishlist") {
                const response = await new Promise<Response>((resolve) => { finishOldRequest = resolve; });
                sessionCookie = "old-session";
                return response;
            }
            if (path === "/sanctum/csrf-cookie") return new Response(null, { status: 204 });
            if (path.endsWith("/login")) {
                sessionCookie = "new-session";
                assert.equal(new Headers(init?.headers).get("X-XSRF-TOKEN"), "test-token");
                return Response.json({ [key]: { id: "first-login-user" } });
            }
            if (path.endsWith("/me")) {
                assert.equal(sessionCookie, "new-session");
                assert.equal(init?.cache, "no-store");
                verificationStarted();
                return new Promise<Response>((resolve) => { finishVerification = resolve; });
            }
            assert.equal(sessionCookie, "new-session");
            return Response.json({ ok: true });
        };

        const oldRequest = laravelClientFetch("/old-wishlist");
        const login = laravelLogin(account, { password: "test-password" });
        const newRequest = laravelClientFetch("/new-wishlist");
        await Promise.resolve();
        assert.deepEqual(calls, ["/old-wishlist"]);
        finishOldRequest(Response.json({ error: "Unauthorized" }, { status: 401 }));
        await verifying;
        assert.equal(calls.includes("/new-wishlist"), false);
        finishVerification(Response.json({ [key]: { id: "first-login-user" } }));
        assert.equal((await login).status, 200);
        await Promise.all([oldRequest, newRequest]);
        assert.deepEqual(calls, ["/old-wishlist", "/sanctum/csrf-cookie", `/api/${account}/auth/login`, `/api/${account}/auth/me`, "/new-wishlist"]);
    });
}

test("an unsuccessful login preserves the API error and does not retry credentials", async () => {
    browserCookies();
    const calls: string[] = [];
    globalThis.fetch = async (input) => {
        const path = String(input);
        calls.push(path);
        return path === "/sanctum/csrf-cookie"
            ? new Response(null, { status: 204 })
            : Response.json({ error: "Invalid credentials" }, { status: 401 });
    };
    const response = await laravelLogin("customer", { password: "wrong-password" });
    assert.equal(response.status, 401);
    assert.equal((await response.json()).error, "Invalid credentials");
    assert.deepEqual(calls, ["/sanctum/csrf-cookie", "/api/customer/auth/login"]);
});

test("a missing or different session is rejected before navigation and releases waiting requests", async () => {
    browserCookies();
    for (const session of [{ customer: null }, { customer: { id: "someone-else" } }]) {
        globalThis.fetch = async (input) => {
            const path = String(input);
            if (path === "/sanctum/csrf-cookie") return new Response(null, { status: 204 });
            if (path.endsWith("/login")) return Response.json({ customer: { id: "expected-user" } });
            return Response.json(session);
        };
        const login = laravelLogin("customer", {});
        const backgroundRequest = laravelClientFetch("/background");
        await assert.rejects(login, SessionVerificationError);
        assert.equal((await backgroundRequest).status, 200);
    }
});

test("failed CSRF initialization stops login and allows a subsequent request", async () => {
    browserCookies();
    const calls: string[] = [];
    globalThis.fetch = async (input) => {
        calls.push(String(input));
        return new Response(null, { status: 503 });
    };
    await assert.rejects(laravelLogin("admin", {}), SessionVerificationError);
    assert.deepEqual(calls, ["/sanctum/csrf-cookie"]);
    assert.equal((await laravelClientFetch("/background")).status, 503);
});

test("admin callbacks keep the requested admin page and reject external or login destinations", () => {
    assert.equal(adminLoginDestination("/admin/products?page=2"), "/admin/products?page=2");
    for (const callback of [null, "/admin/login", "https://other.example/admin/products", "//other.example/admin/products", "/admin/../account", "/admin/\\other.example", "http://[", "/account"]) {
        assert.equal(adminLoginDestination(callback), "/admin/dashboard");
    }
});
