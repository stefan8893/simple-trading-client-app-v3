import "server-only";

function requiredEnvironmentVariable(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config = {
  // These getters defer env validation because Next.js may import server modules during builds.
  get auth() {
    return {
      baseURL: requiredEnvironmentVariable(
        "BETTER_AUTH_URL",
        process.env.BETTER_AUTH_URL,
      ),
      secret: requiredEnvironmentVariable(
        "BETTER_AUTH_SECRET",
        process.env.BETTER_AUTH_SECRET,
      ),
    };
  },
  get database() {
    return {
      uri: requiredEnvironmentVariable("MONGODB_URI", process.env.MONGODB_URI),
      name: requiredEnvironmentVariable(
        "MONGODB_DATABASE",
        process.env.MONGODB_DATABASE,
      ),
    };
  },
  get microsoft() {
    return {
      clientId: requiredEnvironmentVariable(
        "MICROSOFT_CLIENT_ID",
        process.env.MICROSOFT_CLIENT_ID,
      ),
      clientSecret: requiredEnvironmentVariable(
        "MICROSOFT_CLIENT_SECRET",
        process.env.MICROSOFT_CLIENT_SECRET,
      ),
      tenantId: requiredEnvironmentVariable(
        "MICROSOFT_TENANT_ID",
        process.env.MICROSOFT_TENANT_ID,
      ),
    };
  },
} as const;
