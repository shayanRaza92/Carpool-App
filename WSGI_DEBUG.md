# WSGI Debug Wrapper

Since the diagnostic worked but the website doesn't, we need to **force the site to show us the error**.

I wrote a special "Debug Wrapper". If something crashes, it will print the error Log strictly to your browser screen (instead of hiding it in a file).

### Steps:

1.  Go to the **Web** tab on PythonAnywhere.
2.  Click the **WSGI configuration file** link.
3.  **Delete everything** and paste this code:

```python
import sys
import os
import traceback

# 1. Setup Logic
path = '/home/ShayanRaza/Carpool-App'
if path not in sys.path:
    sys.path.append(path)

site_packages = '/home/ShayanRaza/.local/lib/python3.13/site-packages'
if site_packages not in sys.path:
    sys.path.append(site_packages)

def application(environ, start_response):
    try:
        # 2. Try to Import and Start App
        from a2wsgi import ASGIMiddleware
        from backend.main import app as fastapi_app
        
        # Initialize the adapter
        wsgi_app = ASGIMiddleware(fastapi_app)
        
        # Run the app
        return wsgi_app(environ, start_response)
        
    except Exception:
        # 3. IF ANYTHING CRASHES: Print the error to the browser
        status = '500 Internal Server Error'
        output = traceback.format_exc().encode('utf-8')
        response_headers = [('Content-type', 'text/plain; charset=utf-8'),
                            ('Content-Length', str(len(output)))]
        start_response(status, response_headers)
        return [output]
```

4.  **Save**.
5.  **Reload** the Web App.
6.  **Visit your URL:** [https://ShayanRaza.pythonanywhere.com/](https://ShayanRaza.pythonanywhere.com/)

### What do you see?
*   **If you see a long error message (Traceback):** Please Copy-Paste it here!
*   **If it still hangs (Loading...):** Then we know the crash is happening *silently* inside the event loop (very rare).
