import {
  StoreKey,
} from "../constant";
import { getHeaders } from "../client/api";
import { getClientConfig } from "../config/client";
import { createPersistStore } from "../utils/store";
import { getApiKeyFromAuth } from "../utils/auth-check";


let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

const DEFAULT_ACCESS_STATE = {
  // server config
  needCode: false,
  hideUserApiKey: true,
  hideBalanceQuery: true,
  disableGPT4: false,
  disableFastLink: false,
  customModels: "",
  defaultModel: "",
  visionModels: "",

  // tts config
  edgeTTSVoiceName: "zh-CN-YunxiNeural",
};

export const useAccessStore = createPersistStore(
  { ...DEFAULT_ACCESS_STATE },

  (set, get) => ({
    enabledAccessControl() {
      if (fetchState === 0) {
        this.fetch();
      }
      return get().needCode;
    },
    getVisionModels() {
      if (fetchState === 0) {
        this.fetch();
      }
      return get().visionModels;
    },
    edgeVoiceName() {
      if (fetchState === 0) {
        this.fetch();
      }
      return get().edgeTTSVoiceName;
    },


    isAuthorized() {
      if (fetchState === 0) {
        this.fetch();
      }
      return true;
    },

    getEffectiveApiKey() {
      // Get API key from localStorage (share_code_auth)
      const authApiKey = getApiKeyFromAuth();
      if (authApiKey) {
        return authApiKey;
      }
      return "";
    },
    fetch() {
      if (fetchState > 0 || getClientConfig()?.buildMode === "export") return;
      fetchState = 1;
      fetch("/api/config", {
        method: "post",
        body: null,
        headers: {
          ...getHeaders(),
        },
      })
        .then((res) => res.json())
        .then((res: DangerConfig) => {
          console.log("[Config] got config from server", res);
          set(() => ({ ...res }));
        })
        .catch(() => {
          console.error("[Config] failed to fetch config");
        })
        .finally(() => {
          fetchState = 2;
        });
    },
  }),
  {
    name: StoreKey.Access,
    version: 3,
    migrate(persistedState, version) {
      return persistedState as any;
    },
  },
);
