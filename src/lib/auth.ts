import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import "server-only";

import { SESSION_COOKIE } from "@/lib/constants";
import { requiredEnvironmentVariable } from "@/lib/utils";

function createAuth() {
  const baseURL = requiredEnvironmentVariable("BETTER_AUTH_URL");
  const databaseUri = requiredEnvironmentVariable("MONGODB_URI");
  const clientId = requiredEnvironmentVariable("MICROSOFT_CLIENT_ID");
  const clientSecret = requiredEnvironmentVariable("MICROSOFT_CLIENT_SECRET");
  const tenantId = requiredEnvironmentVariable("MICROSOFT_TENANT_ID");
  const secret = requiredEnvironmentVariable("BETTER_AUTH_SECRET");

  const mongoClient = new MongoClient(databaseUri, {
    appName: "simple-trading-client-app",
  });

  const database = mongoClient.db(process.env.MONGODB_DATABASE);

  return betterAuth({
    appName: "Simple Trading",
    baseURL,
    secret,
    trustedOrigins: [baseURL],
    database: mongodbAdapter(database, {
      client: mongoClient,
      transaction: false,
    }),
    socialProviders: {
      microsoft: {
        clientId,
        clientSecret,
        tenantId,
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
        secure: baseURL.startsWith("https://"),
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
