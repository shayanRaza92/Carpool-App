# Critical Fix: Update Netlify URL

The error logs show your app is trying to connect to `shayanraza92.pythonanywhere.com` (which doesn't exist or is wrong), but your backend is actually at `ShayanRaza.pythonanywhere.com`.

**You must correct this in Netlify:**

1.  Go to **Netlify Dashboard** > **Site Configuration** > **Environment variables**.
2.  Find `NEXT_PUBLIC_API_URL`.
3.  Edit it.
4.  Change the value to: `https://ShayanRaza.pythonanywhere.com`
    *   (Make sure it's `ShayanRaza` and not `shayanraza92`)
    *   (No trailing slash `/` at the end)
5.  **Save**.
6.  **Redeploy** your site (Deploys -> Trigger deploy -> Clear cache and deploy site).

After this, the app should be able to find your backend.
