# Initialize Database Manually

Your app is running because we disabled the "Automatic Database Creation" (which was causing the hang).

Now we need to create the tables **manually** one time, so you can actually log in and book rides.

### Steps:

1.  **Push the new script:**
    ```bash
    git add .
    git commit -m "Add manual DB init script"
    git push
    ```

2.  **Run it on PythonAnywhere:**
    *   Open your **Bash Console**.
    *   Run these commands:
    ```bash
    cd Carpool-App
    git pull
    python3.13 backend/init_db.py
    ```

    *   *You should see:* `✅ Database tables created successfully!`

3.  **Final Verification:**
    *   Open your Netlify App (Frontend).
    *   Try to **Sign Up** or **Log In**.
    *   It should work perfectly now!
