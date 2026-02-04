# Fix Infinite Loading (Database Path)

The website is likely hanging because it can't find the `database.db` file. This is because the code was checking the "current folder", but PythonAnywhere runs from a different place.

I updated the code to find the database **exactly** where it lives.

### Steps:

1.  **Push the fix:**
    ```bash
    git add .
    git commit -m "Fix database absolute path"
    git push
    ```

2.  **Update PythonAnywhere:**
    *   Bash Console:
    ```bash
    cd Carpool-App
    git pull
    ```

3.  **Reload the Web App:**
    *   Go to the **Web** tab.
    *   Click **Reload**.

4.  **Verify:**
    *   Visit [https://ShayanRaza.pythonanywhere.com/](https://ShayanRaza.pythonanywhere.com/) again.
    *   It should load instantly now.
