const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
    async post(endpoint: string, data: any) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(localStorage.getItem('access_token')
                        ? { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                        : {})
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const text = await res.text();
            let responseData;
            try {
                responseData = JSON.parse(text);
            } catch (e) {
                // Not JSON, use text as detail
                responseData = { detail: text };
            }

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                    throw new Error("Session expired. Please login again.");
                }

                // For 400 errors (Business Logic), just throw message, don't log console error
                if (res.status === 400) {
                    // alert(responseData?.detail || "Action failed"); // Optional: Alert here if global handling desired
                    throw new Error(responseData?.detail || "Action failed");
                }

                console.error(`API Error (${res.status}) raw text:`, text);
                console.error(`API Error (${res.status}) parsed:`, responseData);
                throw new Error(responseData?.detail || `Request failed with status ${res.status}`);
            }
            return responseData;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                throw new Error("Request timed out. Please check your connection.");
            }
            throw err;
        }
    },

    async get(endpoint: string) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(localStorage.getItem('access_token') ? { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } : {})
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const text = await res.text();
            let responseData;
            try {
                responseData = JSON.parse(text);
            } catch (e) {
                responseData = { detail: text };
            }

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                    throw new Error("Session expired. Please login again.");
                }
                throw new Error(responseData?.detail || 'An error occurred');
            }
            return responseData;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                throw new Error("Request timed out. Please check your connection.");
            }
            throw err;
        }
    }
};
