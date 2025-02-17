export async function fetchAPIJSON(
    url: string,
    options: RequestInit = {}
  ){
    // Log request
    console.log(`[FETCH API JSON] ${url} - METHOD: ${options.method ?? ''} `);
    const response = await fetch(url, options);

    // Handle Response Error
    if (!response.ok) {
        // give it to route error handler wrapper
        throw response
    } 

    // Extract Response Data
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }else{
    // Cotent-type not declared, or its not JSON thus return as text
        return await response.text()
    }
}
  
  