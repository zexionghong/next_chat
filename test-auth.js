// Simple test script to verify authentication logic
const testData = {
  "code": "test_code_123",
  "to": "/chat",
  "config": {
    "data": {
      "id": "test-id-123",
      "name": "Test Tool",
      "description": "Test Description",
      "type": "Communication",
      "config": {},
      "usage_count": 0,
      "created_at": new Date().toISOString(),
      "updated_at": new Date().toISOString(),
      "api_key_info": {
        "id": 1,
        "name": "TestKey",
        "value": "ak_test_key_from_share_code_auth",
        "provider_name": "test_provider",
        "status": "active"
      },
      "model_info": {
        "id": 1,
        "name": "test-model",
        "provider_name": "test_provider",
        "type": "chat"
      },
      "tool_info": {
        "id": "test-tool",
        "name": "Test Tool",
        "description": "Test tool description",
        "category": "Communication",
        "icon": "test-icon",
        "color": "#45B7D1",
        "path": null
      }
    },
    "message": "Tool instance retrieved successfully",
    "success": true
  },
  "timestamp": Date.now()
};

console.log("Test data for share_code_auth:");
console.log(JSON.stringify(testData, null, 2));

console.log("\nTo test:");
console.log("1. Open browser console");
console.log("2. Run: localStorage.setItem('share_code_auth', '" + JSON.stringify(testData) + "')");
console.log("3. Refresh the page");
console.log("4. Check if the API key 'ak_test_key_from_share_code_auth' is being used");
