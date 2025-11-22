---
description: Deploy the application to Netlify
---

1.  **Build the project**:
    ```bash
    npm run build
    ```

2.  **Deploy to Netlify**:
    You can deploy manually by dragging the `dist` folder to [Netlify Drop](https://app.netlify.com/drop).

    OR, if you have the Netlify CLI installed:
    ```bash
    # Install Netlify CLI globally if not already installed
    npm install -g netlify-cli

    # Login (if not logged in)
    netlify login

    # Deploy
    netlify deploy --prod --dir=dist
    ```
