/**
 * HTTP Client
 */
import { getServerUrl } from "./global.js";

export class HttpClient {
  constructor() {
    this.baseURL = getServerUrl();
  }

  // HTTP request method
  async request(endpoint, options = {}) {

    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };
    
    const config = {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      else {
        return null;
      }
    } catch (error) {
      console.error("HTTP Client Error:", error);
      throw error;
    }
  }

  // HTTP GET method
  get( endpoint, userId= null, options = {}) {
    
    if( userId ) {
      options.headers = { ...options.headers, "user-id": userId };
    }

    return this.request(endpoint, { method: "GET", ...options });
  }

  // HTTP POST method
  post( endpoint, userId= null, body, options = {}) {
    
    if( userId ) {
      options.headers = { ...options.headers, "user-id": userId };  
    }
    
    return this.request(endpoint, { method: "POST", body: JSON.stringify(body), ...options} );
  }

  // HTTP DELETE method
  delete( endpoint, userId= null, options = {}) {

    if( userId ) {
      options.headers = { ...options.headers, "user-id": userId };  
    }

    return this.request(endpoint, { method: "DELETE", ...options });
  }
}
