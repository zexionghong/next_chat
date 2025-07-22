import { useState, useEffect } from "react";
import { safeLocalStorage } from "@/app/utils";
import { 
  hasValidAuth, 
  getApiKeyFromAuth, 
  getAuthRedirectUrl,
  ShareCodeAuthData 
} from "../utils/auth-check";

const storage = safeLocalStorage();

export function AuthTest() {
  const [authStatus, setAuthStatus] = useState<string>("Checking...");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [testData, setTestData] = useState<string>("");

  useEffect(() => {
    checkAuth();
    setRedirectUrl(getAuthRedirectUrl());
  }, []);

  const checkAuth = () => {
    const isValid = hasValidAuth();
    const key = getApiKeyFromAuth();
    
    setAuthStatus(isValid ? "Valid" : "Invalid");
    setApiKey(key);
  };

  const createTestData = () => {
    const testAuthData: ShareCodeAuthData = {
      code: "test_code_123",
      to: "/chat",
      config: {
        data: {
          id: "test-id-123",
          name: "Test Tool",
          description: "Test Description",
          type: "Communication",
          config: {},
          usage_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          api_key_info: {
            id: 1,
            name: "TestKey",
            value: "ak_test_key_123456789",
            provider_name: "test_provider",
            status: "active"
          },
          model_info: {
            id: 1,
            name: "test-model",
            provider_name: "test_provider",
            type: "chat"
          },
          tool_info: {
            id: "test-tool",
            name: "Test Tool",
            description: "Test tool description",
            category: "Communication",
            icon: "test-icon",
            color: "#45B7D1",
            path: null
          }
        },
        message: "Tool instance retrieved successfully",
        success: true
      },
      timestamp: Date.now()
    };

    setTestData(JSON.stringify(testAuthData, null, 2));
  };

  const saveTestData = () => {
    if (testData) {
      storage.setItem("share_code_auth", testData);
      checkAuth();
    }
  };

  const clearTestData = () => {
    storage.removeItem("share_code_auth");
    checkAuth();
    setTestData("");
  };

  const getCurrentData = () => {
    const current = storage.getItem("share_code_auth");
    setTestData(current || "");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Authentication Test Panel</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <h3>Current Status:</h3>
        <p><strong>Auth Status:</strong> {authStatus}</p>
        <p><strong>API Key:</strong> {apiKey || "None"}</p>
        <p><strong>Redirect URL:</strong> {redirectUrl}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Actions:</h3>
        <button onClick={checkAuth} style={{ margin: "5px" }}>
          Refresh Status
        </button>
        <button onClick={createTestData} style={{ margin: "5px" }}>
          Generate Test Data
        </button>
        <button onClick={saveTestData} style={{ margin: "5px" }}>
          Save Test Data
        </button>
        <button onClick={clearTestData} style={{ margin: "5px" }}>
          Clear Data
        </button>
        <button onClick={getCurrentData} style={{ margin: "5px" }}>
          Load Current Data
        </button>
      </div>

      <div>
        <h3>Test Data (JSON):</h3>
        <textarea
          value={testData}
          onChange={(e) => setTestData(e.target.value)}
          style={{ 
            width: "100%", 
            height: "300px", 
            fontFamily: "monospace",
            fontSize: "12px"
          }}
          placeholder="Test data will appear here..."
        />
      </div>

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <h4>Instructions:</h4>
        <ol>
          <li>Click &quot;Generate Test Data&quot; to create sample authentication data</li>
          <li>Click &quot;Save Test Data&quot; to store it in localStorage</li>
          <li>Click &quot;Refresh Status&quot; to check if authentication is valid</li>
          <li>Click &quot;Clear Data&quot; to remove authentication data (should trigger redirect)</li>
        </ol>
      </div>
    </div>
  );
}
