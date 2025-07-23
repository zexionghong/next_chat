import { useAccessStore } from "../store";
import { getApiKeyFromAuth } from "../utils/auth-check";

export function ApiKeyTest() {
  const testApiKey = () => {
    console.log("=== API Key Test ===");
    
    // Test direct function call
    const directApiKey = getApiKeyFromAuth();
    console.log("Direct API key from localStorage:", directApiKey);
    
    // Test through access store
    const accessStore = useAccessStore.getState();
    const storeApiKey = accessStore.getEffectiveApiKey();
    console.log("API key through access store:", storeApiKey);
    
    // Check localStorage content
    const shareCodeAuth = localStorage.getItem("share_code_auth");
    console.log("Raw localStorage content:", shareCodeAuth);
    
    if (shareCodeAuth) {
      try {
        const parsed = JSON.parse(shareCodeAuth);
        console.log("Parsed auth data:", parsed);
        console.log("API key path:", parsed?.config?.data?.api_key_info?.value);
      } catch (e) {
        console.error("Failed to parse auth data:", e);
      }
    }
  };

  return (
    <div style={{padding: "20px", border: "1px solid #ccc", margin: "10px"}}>
      <h3>API Key Test</h3>
      <button onClick={testApiKey}>Test API Key Retrieval</button>
      <p>Check console for results</p>
    </div>
  );
}