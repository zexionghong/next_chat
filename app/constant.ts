export const OWNER = "ChatGPTNextWeb";
export const REPO = "ChatGPT-Next-Web";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const PLUGINS_REPO_URL = `https://github.com/${OWNER}/NextChat-Awesome-Plugins`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";

export const CUSTOM_API_BASE_URL = "https://api-api.718ai.cn";

export const CACHE_URL_PREFIX = "/api/cache";
export const UPLOAD_URL = `${CACHE_URL_PREFIX}/upload`;

export enum Path {
  Home = "/",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Masks = "/masks",
  Plugins = "/plugins",
  Auth = "/auth",
  Sd = "/sd",
  SdNew = "/sd-new",
  Artifacts = "/artifacts",
  SearchChat = "/search-chat",
  McpMarket = "/mcp-market",
}

export enum ApiPath {
  Cors = "",
  Artifacts = "/api/artifacts",
  CustomAPI = "/api/custom",
}

export enum SlotID {
  AppBody = "app-body",
  CustomModel = "custom-model",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "chat-next-web-store",
  Plugin = "chat-next-web-plugin",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",
  SdList = "sd-list",
  Mcp = "mcp-store",
}

export const DEFAULT_SIDEBAR_WIDTH = 300;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "nk-";

export const LAST_INPUT_KEY = "last-input";
export const UNFINISHED_INPUT = (id: string) => "unfinished-input-" + id;

export const STORAGE_KEY = "chatgpt-next-web";

export const REQUEST_TIMEOUT_MS = 60000;
export const REQUEST_TIMEOUT_MS_FOR_THINKING = REQUEST_TIMEOUT_MS * 5;

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export enum ServiceProvider {
  CustomAPI = "API",
}

export enum ModelProvider {
  CustomAPI = "API",
}

export const CustomAPI = {
  ExampleEndpoint: CUSTOM_API_BASE_URL,
  ChatPath: "v1/chat/completions",
  ListModelPath: "v1/models?llm=1",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
// export const DEFAULT_SYSTEM_TEMPLATE = `
// You are ChatGPT, a large language model trained by {{ServiceProvider}}.
// Knowledge cutoff: {{cutoff}}
// Current model: {{model}}
// Current time: {{time}}
// Latex inline: $x^2$
// Latex block: $$e=mc^2$$
// `;
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by {{ServiceProvider}}.
Knowledge cutoff: {{cutoff}}
Current model: {{model}}
Current time: {{time}}
Latex inline: \\(x^2\\) 
Latex block: $$e=mc^2$$
`;

export const MCP_TOOLS_TEMPLATE = `
[clientId]
{{ clientId }}
[tools]
{{ tools }}
`;

export const MCP_SYSTEM_TEMPLATE = `
You are an AI assistant with access to system tools. Your role is to help users by combining natural language understanding with tool operations when needed.

1. AVAILABLE TOOLS:
{{ MCP_TOOLS }}

2. WHEN TO USE TOOLS:
   - ALWAYS USE TOOLS when they can help answer user questions
   - DO NOT just describe what you could do - TAKE ACTION immediately
   - If you're not sure whether to use a tool, USE IT
   - Common triggers for tool use:
     * Questions about files or directories
     * Requests to check, list, or manipulate system resources
     * Any query that can be answered with available tools

3. HOW TO USE TOOLS:
   A. Tool Call Format:
      - Use markdown code blocks with format: \`\`\`json:mcp:{clientId}\`\`\`
      - Always include:
        * method: "tools/call"（Only this method is supported）
        * params: 
          - name: must match an available primitive name
          - arguments: required parameters for the primitive

   B. Response Format:
      - Tool responses will come as user messages
      - Format: \`\`\`json:mcp-response:{clientId}\`\`\`
      - Wait for response before making another tool call

   C. Important Rules:
      - Only use tools/call method
      - Only ONE tool call per message
      - ALWAYS TAKE ACTION instead of just describing what you could do
      - Include the correct clientId in code block language tag
      - Verify arguments match the primitive's requirements

4. INTERACTION FLOW:
   A. When user makes a request:
      - IMMEDIATELY use appropriate tool if available
      - DO NOT ask if user wants you to use the tool
      - DO NOT just describe what you could do
   B. After receiving tool response:
      - Explain results clearly
      - Take next appropriate action if needed
   C. If tools fail:
      - Explain the error
      - Try alternative approach immediately

5. EXAMPLE INTERACTION:

  good example:

   \`\`\`json:mcp:filesystem
   {
     "method": "tools/call",
     "params": {
       "name": "list_allowed_directories",
       "arguments": {}
     }
   }
   \`\`\`"


  \`\`\`json:mcp-response:filesystem
  {
  "method": "tools/call",
  "params": {
    "name": "write_file",
    "arguments": {
      "path": "/Users/river/dev/nextchat/test/joke.txt",
      "content": "为什么数学书总是感到忧伤？因为它有太多的问题。"
    }
  }
  }
\`\`\`

   follwing is the wrong! mcp json example:

   \`\`\`json:mcp:filesystem
   {
      "method": "write_file",
      "params": {
        "path": "NextChat_Information.txt",
        "content": "1"
    }
   }
   \`\`\`

   This is wrong because the method is not tools/call.
   
   \`\`\`{
  "method": "search_repositories",
  "params": {
    "query": "2oeee"
  }
}
   \`\`\`

   This is wrong because the method is not tools/call.!!!!!!!!!!!

   the right format is:
   \`\`\`json:mcp:filesystem
   {
     "method": "tools/call",
     "params": {
       "name": "search_repositories",
       "arguments": {
         "query": "2oeee"
       }
     }
   }
   \`\`\`
   
   please follow the format strictly ONLY use tools/call method!!!!!!!!!!!
   
`;

export const SUMMARIZE_MODEL = "gpt-4o-mini";

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4-turbo": "2023-12",
  "gpt-4-turbo-2024-04-09": "2023-12",
  "gpt-4-turbo-preview": "2023-12",
  "gpt-4.1": "2024-06",
  "gpt-4.1-2025-04-14": "2024-06",
  "gpt-4.1-mini": "2024-06",
  "gpt-4.1-mini-2025-04-14": "2024-06",
  "gpt-4.1-nano": "2024-06",
  "gpt-4.1-nano-2025-04-14": "2024-06",
  "gpt-4.5-preview": "2023-10",
  "gpt-4.5-preview-2025-02-27": "2023-10",
  "gpt-4o": "2023-10",
  "gpt-4o-2024-05-13": "2023-10",
  "gpt-4o-2024-08-06": "2023-10",
  "gpt-4o-2024-11-20": "2023-10",
  "chatgpt-4o-latest": "2023-10",
  "gpt-4o-mini": "2023-10",
  "gpt-4o-mini-2024-07-18": "2023-10",
  "gpt-4-vision-preview": "2023-04",
  "o1-mini-2024-09-12": "2023-10",
  "o1-mini": "2023-10",
  "o1-preview-2024-09-12": "2023-10",
  "o1-preview": "2023-10",
  "o1-2024-12-17": "2023-10",
  o1: "2023-10",
  "o3-mini-2025-01-31": "2023-10",
  "o3-mini": "2023-10",
  // After improvements,
  // it's now easier to add "KnowledgeCutOffDate" instead of stupid hardcoding it, as was done previously.
};

export const DEFAULT_TTS_ENGINE = "OpenAI-TTS";
export const DEFAULT_TTS_ENGINES = ["OpenAI-TTS", "Edge-TTS"];
export const DEFAULT_TTS_MODEL = "tts-1";
export const DEFAULT_TTS_VOICE = "alloy";
export const DEFAULT_TTS_MODELS = ["tts-1", "tts-1-hd"];
export const DEFAULT_TTS_VOICES = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
];

export const VISION_MODEL_REGEXES = [
  /vision/,
  /gpt-4o/,
  /gpt-4\.1/,
  /claude-3/,
  /gemini-1\.5/,
  /gemini-exp/,
  /gemini-2\.0/,
  /learnlm/,
  /qwen-vl/,
  /qwen2-vl/,
  /gpt-4-turbo(?!.*preview)/, // Matches "gpt-4-turbo" but not "gpt-4-turbo-preview"
  /^dall-e-3$/, // Matches exactly "dall-e-3"
  /glm-4v/,
  /vl/i,
  /o3/,
  /o4-mini/,
];

export const EXCLUDE_VISION_MODEL_REGEXES = [/claude-3-5-haiku-20241022/];

// All model arrays removed - models will be fetched from API

// No default models - all models will be fetched from API
export const DEFAULT_MODELS = [] as const;

export const CHAT_PAGE_SIZE = 15;
export const MAX_RENDER_MSG_COUNT = 45;

// some famous webdav endpoints
export const internalAllowedWebDavEndpoints = [
  "https://dav.jianguoyun.com/dav/",
  "https://dav.dropdav.com/",
  "https://dav.box.com/dav",
  "https://nanao.teracloud.jp/dav/",
  "https://bora.teracloud.jp/dav/",
  "https://webdav.4shared.com/",
  "https://dav.idrivesync.com",
  "https://webdav.yandex.com",
  "https://app.koofr.net/dav/Koofr",
];

export const DEFAULT_GA_ID = "G-89WN60ZK2E";

export const SAAS_CHAT_URL = "https://nextchat.club";
export const SAAS_CHAT_UTM_URL = "https://nextchat.club?utm=github";
