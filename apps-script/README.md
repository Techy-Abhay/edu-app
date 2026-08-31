# Google Apps Script Backend

`Code.gs` is the entire backend: a Web App that reads and writes the Google Sheet holding the question bank, sessions and responses.

See [../docs/sheets-schema.md](../docs/sheets-schema.md) for the required sheet tabs and columns before deploying.

## Deploy

1. Open your Google Sheet → **Extensions** → **Apps Script**.
2. Delete the default `myFunction()` stub and paste the full contents of `Code.gs`.
3. Save (Ctrl+S).
4. **Deploy** → **New deployment** → gear icon → **Web app**.
5. Configure:
   - **Execute as**: Me
   - **Who has access**: **Anyone**
6. **Deploy**, then **Authorize access** and grant permissions. Google shows an "unverified app" warning for your own scripts — continue via **Advanced** → **Go to \<project\> (unsafe)**.
7. Copy the **Web app URL**. It ends in `/exec`.

"Who has access" must be **Anyone**, not "Anyone with Google account". The browser calls this endpoint anonymously, and any other setting returns a sign-in redirect that surfaces as a CORS error.

## Connect the frontend

For local development, put the URL in `src/config.ts`:

```typescript
export const API_BASE_URL = 'https://script.google.com/macros/s/<deployment-id>/exec';
```

For the deployed site, store the same URL as the `API_BASE_URL` GitHub Actions secret. The deploy workflow generates `src/config.ts` from it.

## Updating the script

Editing `Code.gs` is not enough — the Web App serves the last *deployed* version. After changing the code, use **Deploy** → **Manage deployments** → pencil icon → **Version: New version** → **Deploy**. This keeps the same URL.

Creating a *new deployment* instead issues a different URL and requires updating the config and the GitHub secret.

## Verify

Open this in a browser, substituting your URL:

```
<YOUR_WEB_APP_URL>?action=getSubjects
```

A JSON list of subjects means the backend is working. Anything else — see [../docs/troubleshooting.md](../docs/troubleshooting.md).
