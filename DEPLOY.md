# Production Deployment Manual

If the automation script fails, follow these steps to deploy "Smart Farm" manually.

## Prerequisites
1.  **Node.js** installed.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com/signup).
3.  **Git** installed.

## Step-by-Step Guide

### 1. Login to Vercel
Open your terminal and run:
```bash
npx vercel login
```
Follow the instructions to log in via your browser.

### 2. Deploy
Run the following command to deploy (this will also set up the project):
```bash
npx vercel --prod
```
-   **Set up and deploy?** [Y]
-   **Which scope?** [Select your account]
-   **Link to existing project?** [N]
-   **Project Name:** `smart-farm`
-   **In which directory?** [./]
-   **Want to modify settings?** [N] (Auto-detects Next.js)

### 3. Environment Variables
Once deployed, the build might fail or the AI won't work because keys are missing.
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Select your `smart-farm` project.
3.  Go to **Settings** > **Environment Variables**.
4.  Add the key-value pairs from your local `.env.local` file:
    -   `OPENAI_API_KEY`
    -   `FIREBASE_PROJECT_ID`
    -   `FIREBASE_CLIENT_EMAIL`
    -   `FIREBASE_PRIVATE_KEY` (Copy the entire content carefully)

### 4. Redeploy
After adding variables, go to **Deployments** tab and click **Redeploy** on the latest build, or run `npx vercel --prod` again in your terminal.

## Troubleshooting
-   **Firebase Key Error:** Ensure the private key in Vercel includes the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines.
