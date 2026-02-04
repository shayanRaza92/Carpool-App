# Update Tasks

## 1. Backend Update Required (PythonAnywhere)
Your deployed backend at `shayanraza92.pythonanywhere.com` is running an old version of the code that blocks your Netlify app. You MUST update it.

### Option A: Using Git (Recommended)
1.  **Push** the changes I just made to GitHub:
    ```bash
    git add .
    git commit -m "Update CORS for Netlify"
    git push
    ```
2.  **Log in to PythonAnywhere**.
3.  Open a **Bash console**.
4.  Navigate to your project folder (e.g., `cd Carpool-App`).
5.  Pull the changes:
    ```bash
    git pull
    ```
6.  **Reload your Web App**:
    *   Go to the **Web** tab.
    *   Click the big green **Reload** button.

### Option B: Manual Upload
If you don't use git on PythonAnywhere:
1.  Go to the **Files** tab on PythonAnywhere.
2.  Navigate to `backend/main.py`.
3.  Upload the new `backend/main.py` file from your computer.
4.  Go to the **Web** tab and **Reload**.

## 2. Frontend Check
After updating the backend, try your Netlify app again. The CORS error should be gone.
