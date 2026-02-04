# Fix PythonAnywhere Deployment

The "Unhandled Exception" usually means your code on PythonAnywhere is in a bad state (e.g., merge conflicts or corrupted files) because of the recent updates.

**We need to force your PythonAnywhere code to match GitHub exactly.**

### Steps:

1.  **Log in to PythonAnywhere.**
2.  Open a **Bash Console**.
3.  Run these commands exactly (replace `Carpool-App` with your actual folder name if different):

    ```bash
    cd Carpool-App
    git fetch origin
    git reset --hard origin/main
    ```

    *This matches your live code 100% to GitHub, discarding any weird local issues.*

4.  **Reload the Web App:**
    *   Go to the **Web** tab.
    *   Click the big green **Reload** button.

5.  **Verify:**
    *   Visit your backend URL: [https://ShayanRaza.pythonanywhere.com/](https://ShayanRaza.pythonanywhere.com/)
    *   You should see the JSON response with `version: "1.1 (CORS Fix)"`.
