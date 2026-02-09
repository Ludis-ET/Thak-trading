# Deployment Setup Instructions

To approve the deployment to your cPanel server, you need to configure "Secrets" in your GitHub repository.

## 1. Gather FTP Credentials from cPanel
1.  Log in to your **cPanel**.
2.  Search for **FTP Accounts**.
3.  You can use your main cPanel account or create a new FTP account.
    *   **Server/Host**: Usually your domain name (e.g., `ftp.yourdomain.com`) or the server IP address.
    *   **Username**: Your cPanel username or the specific FTP user (e.g., `user@yourdomain.com`).
    *   **Password**: The password for that user.
    *   **Path/Directory**: Ensure you know where this user lands. For the main account, it's usually `/home/user`. The public files go in `public_html`.

## 2. Add Secrets to GitHub
1.  Go to your GitHub repository.
2.  Click on **Settings** (top right tab).
3.  On the left sidebar, verify **Secrets and variables**, then click **Actions**.
4.  Click the **New repository secret** button.
5.  Add the following three secrets:

| Name | Value Example | Description |
| :--- | :--- | :--- |
| `FTP_SERVER` | `ftp.example.com` | Your cPanel domain or server IP. |
| `FTP_USERNAME` | `user@example.com` | Your FTP Username. |
| `FTP_PASSWORD` | `your_secure_password` | Your FTP Password. |

## 3. Verify Deployment
1.  Push your code to the `main` or `master` branch.
2.  Go to the **Actions** tab in GitHub.
3.  You should see a workflow running. Click on it to see the details.
4.  If it succeeds, check your website!

## ⚠️ Important Note on "public_html"
The workflow is configured to upload to `./public_html/`.
*   If your FTP user is mapped *directly* to `public_html`, you should edit `.github/workflows/deploy.yml` and change `server-dir: ./public_html/` to `server-dir: ./`.
*   If you are using the main cPanel account, `./public_html/` is usually correct.

## ⚠️ IMPORTANT: Configure Contact Form
Since you are deploying a static site to cPanel, the contact form uses a PHP script (`contact.php`) instead of Next.js API routes.
**You must configure your email settings on the server:**

1.  Open `public/contact.php` (or edit it on the server after deployment).
2.  Locate these lines near the top:
    ```php
    $recaptcha_secret = getenv('RECAPTCHA_SECRET_KEY') ?: 'YOUR_RECAPTCHA_SECRET_KEY';
    $email_user = getenv('EMAIL_USER') ?: 'info@yourdomain.com';
    ```
3.  **Option A (Recommended)**: Set these Environment Variables in your cPanel PHP settings (if supported) or in an `.htaccess` file:
    ```apache
    SetEnv RECAPTCHA_SECRET_KEY "your_actual_secret_key"
    SetEnv EMAIL_USER "your_email@domain.com"
    ```
4.  **Option B (Easier)**: Edit `contact.php` directly and replace the placeholders with your actual keys/email.
    *   Replace `'YOUR_RECAPTCHA_SECRET_KEY'` with your actual Google ReCAPTCHA secret key.
    *   Replace `'info@yourdomain.com'` with your email address.
