# Test Minimal WSGI App

Since the app is "hanging", we need to see if the problem is **FastAPI** or **PythonAnywhere**.

We will temporarily switch to a super simple "Hello World" app.

### Steps:

1.  Go to the **Web** tab on PythonAnywhere.
2.  Click the **WSGI configuration file** link.
3.  **Delete everything** and paste ONLY this:

```python
def application(environ, start_response):
    status = '200 OK'
    output = b'Hello World! The server is working!'
    response_headers = [('Content-type', 'text/plain'),
                        ('Content-Length', str(len(output)))]
    start_response(status, response_headers)
    return [output]
```

4.  **Save**.
5.  **Reload** the Web App.
6.  **Visit your URL:** [https://ShayanRaza.pythonanywhere.com/](https://ShayanRaza.pythonanywhere.com/)

### Result?
*   **If you see "Hello World!...":** The server is fine. The problem is inside your FastAPI code (likely the database lock again or an infinite loop).
*   **If it still hangs:** The problem is your PythonAnywhere account/server needs a reboot (we will check error logs again).
