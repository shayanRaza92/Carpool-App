# Fix Hanging App (Clear Locks)

The "499" errors and infinite loading usually mean your database file is "locked" by a stuck process from before.

**We need to kill the stuck processes and reset the database.**

### Steps:

1.  **Kill Stuck Processes:**
    *   Go to the PythonAnywhere **Dashboard** (Click the logo top left).
    *   Click the **Consoles** tab.
    *   Under "Running processes", click **Fetch process list**.
    *   If you see any processes, kill them. (Or looking for a "Kill all" button if available, otherwise just ensure your Web App is the only thing trying to run).
    *   *Easier method:* Go to the **Web** tab and click **Reload**. This *should* kill old workers, but sometimes they get stuck.

2.  **Delete the Database (Force Fresh Start):**
    *   Open a **Bash Console**.
    *   Run these commands:
    ```bash
    cd Carpool-App
    rm database.db
    ```
    *(Don't worry, the app will recreate it automatically on startup).*

3.  **Reload Again:**
    *   Go to the **Web** tab.
    *   Click **Reload**.

4.  **Verify:**
    *   Try [https://ShayanRaza.pythonanywhere.com/](https://ShayanRaza.pythonanywhere.com/) again.
    *   It should be fast now.
