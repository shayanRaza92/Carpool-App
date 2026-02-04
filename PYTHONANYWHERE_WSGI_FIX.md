# Fix WSGI Configuration

The error `ImportError: attempted relative import...` happens because PythonAnywhere is confused about your folder structure. It's trying to run `main.py` as a standalone script instead of part of your `backend` package.

**We need to update the WSGI configuration file.**

### Steps:

1.  **Log in to PythonAnywhere** and go to the **Web** tab.
2.  Scroll down to the **Code** section.
3.  Click the link next to **WSGI configuration file**.
    *   It will look like: `/var/www/shayanraza_pythonanywhere_com_wsgi.py`
4.  **Delete everything** in that file and **Paste this exactly**:

```python
import sys
import os

# 1. Add your PROJECT ROOT to the path
path = '/home/ShayanRaza/Carpool-App'
if path not in sys.path:
    sys.path.append(path)

# 2. Add the USER SITE-PACKAGES to the path (Crucial for packages installed with --user)
# This points specifically to where you saw 'a2wsgi' installed
site_packages = '/home/ShayanRaza/.local/lib/python3.13/site-packages'
if site_packages not in sys.path:
    sys.path.append(site_packages)

from a2wsgi import ASGIMiddleware # Import the adapter
from backend.main import app as fastapi_app

# 3. Wrap the ASGI app with the WSGI adapter
application = ASGIMiddleware(fastapi_app)
```

5.  **Save** the file.
6.  Go back to the **Web** tab.
7.  Click the big green **Reload** button.

### Verification
Visit [https://ShayanRaza.pythonanywhere.com/](https://ShayanRaza.pythonanywhere.com/).
You should now see the JSON response without the Server Error.
