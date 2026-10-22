import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import "server-only";

import { config } from "@/lib/config";
import { SESSION_COOKIE } from "@/lib/constants";

function createAuth() {
  const mongoClient = new MongoClient(config.database.uri, {
    appName: "simple-trading-client-app",
  });

  const database = mongoClient.db(config.database.name);

  return betterAuth({
    appName: "Simple Trading",
    baseURL: config.auth.baseURL,
    secret: config.auth.secret,
    trustedOrigins: [config.auth.baseURL],
    database: mongodbAdapter(database, {
      client: mongoClient,
      transaction: false,
    }),
    socialProviders: {
      microsoft: {
        clientId: config.microsoft.clientId,
        clientSecret: config.microsoft.clientSecret,
        tenantId: config.microsoft.tenantId,
        prompt: "select_account",
        scopes: ["openid", "profile", "email", "offline_access"],
        disableProfilePhoto: true,
        mapProfileToUser: (profile) => ({
          name: profile.name || profile.preferred_username || profile.oid,
          email:
            profile.email ||
            profile.preferred_username ||
            `${profile.oid}@users.invalid`,
          emailVerified: profile.email_verified === true,
        }),
      },
    },
    account: {
      storeAccountCookie: false,
    },
    advanced: {
      cookies: {
        session_token: {
          name: SESSION_COOKIE,
        },
      },
      defaultCookieAttributes: {
        secure: config.auth.baseURL.startsWith("https://"),
      },
      useSecureCookies: false,
    },
  });
}

let authInstance: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  if (!authInstance) {
    authInstance = createAuth();
  }

  return authInstance;
}
