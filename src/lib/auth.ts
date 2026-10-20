import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import "server-only";

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createAuth() {
  const baseURL = requiredEnvironmentVariable("BETTER_AUTH_URL");
  const databaseUri = requiredEnvironmentVariable("MONGODB_URI");
  const clientId = requiredEnvironmentVariable("MICROSOFT_CLIENT_ID");
  const clientSecret = requiredEnvironmentVariable("MICROSOFT_CLIENT_SECRET");
  const secret = requiredEnvironmentVariable("BETTER_AUTH_SECRET");

  const mongoClient = new MongoClient(databaseUri, {
    appName: "simple-trading-auth",
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
        tenantId: process.env.MICROSOFT_TENANT_ID,
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
          name: "session-token",
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
