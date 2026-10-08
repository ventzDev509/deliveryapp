# Render deployment settings

The frontend and backend are separate Render services. Set these environment variables before redeploying:

- **Frontend static site:** `VITE_API_URL=https://backenddelivery-t22i.onrender.com`
- **Backend web service:** `FRONTEND_URL=https://deliveryapp-6dlf.onrender.com`

Use the backend service's public HTTPS URL for `VITE_API_URL`, with no trailing slash. The frontend already defaults to this backend URL in production; setting the Render environment variable explicitly is still recommended. Vite embeds this value at build time, so redeploy the frontend after changing it. The backend reads `FRONTEND_URL` when it starts, so redeploy/restart the backend after changing that value.

For local development, the frontend continues to use `http://localhost:3000` when `VITE_API_URL` is not set.
