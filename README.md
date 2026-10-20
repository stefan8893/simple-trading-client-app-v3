# Simple Trading Client App

### Third time's the charm

Once again I started over creating a client app for the Simple Trading backend.  
This time, I hope to reach a MVP.

## Authentication

Authentication uses Better Auth with Microsoft Entra ID (OpenID Connect) and the MongoDB API. Better Auth stores users, sessions, and OAuth accounts in the `simple-trading` database; Microsoft access and ID tokens are persisted in the server-side `account` collection, not in browser-readable cookies. After sign-in, the browser keeps Better Auth's HttpOnly session cookie; OAuth tokens are not put in the session cookie.

1. Copy `.env.example` to `.env.local`, generate a unique secret (for example, `openssl rand -base64 32`) for `BETTER_AUTH_SECRET`, and configure `MONGODB_URI` plus the Microsoft client credentials.
2. In Microsoft Entra ID, register a web redirect URI of `http://localhost:8000/api/auth/callback/microsoft` for local development. Add the deployed origin with `/api/auth/callback/microsoft` as a redirect URI for production.
3. Set the same environment variables in the Azure Web App's application settings. Set `BETTER_AUTH_URL` to the exact public origin (scheme and hostname, no trailing slash) and use the Cosmos DB MongoDB connection string for `MONGODB_URI`.
4. Set `MICROSOFT_TENANT_ID` to the tenant GUID to restrict sign-in to one tenant, or keep `common` to allow Microsoft accounts across tenants.

`src/proxy.ts` only checks whether a Better Auth session cookie is present to optimize redirects; it does not validate the session. The protected app layout verifies the session against the database on the server. The `.swa` health-check path remains excluded from the proxy matcher. Cosmos DB's MongoDB API does not support every MongoDB behavior; the Better Auth adapter is configured without transactions for compatibility.

## Deployment

Tagged SemVer releases are built as a Docker image and pushed to GitHub Container Registry (GHCR), then deployed to an Azure Web App for Containers. Configure the GitHub `Production` environment with these secrets:

- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID` for an Azure identity federated with this repository's GitHub Actions environment.

Set the `AZURE_WEBAPP_NAME` variable to the Azure Web App name. Configure that Web App to pull the published GHCR package (including registry credentials if the package is private) and set `WEBSITES_PORT` to `3000`. Add the authentication and database variables listed above to the Web App's application settings; they are read at runtime and are not baked into the image.
