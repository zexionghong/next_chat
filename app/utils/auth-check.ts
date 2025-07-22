import { safeLocalStorage } from "@/app/utils";

const storage = safeLocalStorage();

export interface ShareCodeAuthData {
  code: string;
  to: string;
  config: {
    data: {
      id: string;
      name: string;
      description: string;
      type: string;
      config: object;
      usage_count: number;
      created_at: string;
      updated_at: string;
      api_key_info: {
        id: number;
        name: string;
        value: string;
        provider_name: string;
        status: string;
      };
      model_info: {
        id: number;
        name: string;
        provider_name: string;
        type: string;
      };
      tool_info: {
        id: string;
        name: string;
        description: string;
        category: string;
        icon: string;
        color: string;
        path: string | null;
      };
    };
    message: string;
    success: boolean;
  };
  timestamp: number;
}

/**
 * Check if the user has valid authentication data in localStorage
 * @returns {boolean} true if valid authentication exists, false otherwise
 */
export function hasValidAuth(): boolean {
  try {
    const shareCodeAuth = storage.getItem("share_code_auth");
    
    if (!shareCodeAuth) {
      console.log("[Auth Check] No share_code_auth found in localStorage");
      return false;
    }

    const authData: ShareCodeAuthData = JSON.parse(shareCodeAuth);
    
    // Check if the data structure is valid
    if (!authData.config?.data?.api_key_info?.value) {
      console.log("[Auth Check] Invalid auth data structure - missing api_key_info.value");
      return false;
    }

    // Check if the API key value exists and is not empty
    const apiKey = authData.config.data.api_key_info.value;
    if (!apiKey || apiKey.trim() === "") {
      console.log("[Auth Check] API key is empty or invalid");
      return false;
    }

    // Check if the auth data is not expired (optional - you can add timestamp validation here)
    const currentTime = Date.now();
    const authTimestamp = authData.timestamp;
    
    // Optional: Add expiration check (e.g., 24 hours)
    // const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // if (currentTime - authTimestamp > EXPIRATION_TIME) {
    //   console.log("[Auth Check] Auth data has expired");
    //   return false;
    // }

    console.log("[Auth Check] Valid authentication found");
    return true;
  } catch (error) {
    console.error("[Auth Check] Error parsing auth data:", error);
    return false;
  }
}

/**
 * Get the API key from localStorage
 * @returns {string | null} API key if found, null otherwise
 */
export function getApiKeyFromAuth(): string | null {
  try {
    const shareCodeAuth = storage.getItem("share_code_auth");
    
    if (!shareCodeAuth) {
      return null;
    }

    const authData: ShareCodeAuthData = JSON.parse(shareCodeAuth);
    return authData.config?.data?.api_key_info?.value || null;
  } catch (error) {
    console.error("[Auth Check] Error getting API key:", error);
    return null;
  }
}

/**
 * Get the redirect URL from environment variables
 * @returns {string} redirect URL
 */
export function getAuthRedirectUrl(): string {
  // In Next.js, environment variables are available on the client side if prefixed with NEXT_PUBLIC_
  // Since this is a client-side check, we need to make sure the URL is available
  // For now, we'll use a default URL, but you should configure this properly
  return process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "https://tools-dev.718ai.cn";
}

/**
 * Redirect to the authentication URL
 */
export function redirectToAuth(): void {
  const redirectUrl = getAuthRedirectUrl();
  console.log("[Auth Check] Redirecting to:", redirectUrl);

  // Use window.location.replace to prevent back navigation
  window.location.replace(redirectUrl);
}

/**
 * Perform authentication check and redirect if necessary
 * @returns {boolean} true if authentication is valid, false if redirecting
 */
export function checkAuthAndRedirect(): boolean {
  console.log("[Auth Check] Starting authentication check...");

  if (!hasValidAuth()) {
    console.log("[Auth Check] Authentication invalid, redirecting...");
    redirectToAuth();
    return false;
  }

  console.log("[Auth Check] Authentication valid, continuing...");
  return true;
}
