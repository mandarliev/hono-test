import { Hono, Context } from "hono";
import {
  authHandler,
  initAuthConfig,
  verifyAuth,
  type AuthConfig,
} from "@hono/auth-js";
import GitHub from "@auth/core/providers/github";
import { handle } from "hono/vercel";

// Basically following this guide
// https://github.com/honojs/middleware/tree/main/packages/auth-js#authjs-middleware-for-hono

import todos from "./todos";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));
app.use("/auth/*", authHandler());

app.get("/protected", verifyAuth(), (c) => {
  const auth = c.get("authUser");

  return c.json(auth);
});

app.route("/todos", todos);

function getAuthConfig(c: Context): AuthConfig {
  return {
    // Instead of c.env, I have to use process.env
    // since it was initially set to work w/ Cloudflare workers
    secret: process.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
  };
}

export const GET = handle(app);
export const POST = handle(app);
