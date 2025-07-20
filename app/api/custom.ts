import { type OpenAIListModelResponse } from "@/app/client/platforms/custom";
import { getServerSideConfig } from "@/app/config/server";
import { ModelProvider, CustomAPI } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { requestOpenai } from "./common";

const ALLOWED_PATH = new Set([CustomAPI.ChatPath, CustomAPI.ListModelPath]);

function getModels(remoteModelRes: OpenAIListModelResponse) {
  const config = getServerSideConfig();

  if (config.disableGPT4) {
    remoteModelRes.data = remoteModelRes.data.filter(
      (m) => !m.id.startsWith("gpt-4"),
    );
  }

  return remoteModelRes;
}

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Custom API Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const subpath = params.path.join("/");

  if (!ALLOWED_PATH.has(subpath)) {
    console.log("[Custom API Route] forbidden path ", subpath);
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + subpath,
      },
      {
        status: 403,
      },
    );
  }

  const authResult = auth(req, ModelProvider.CustomAPI);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const response = await requestCustomAPI(req);

    // list models
    if (subpath === CustomAPI.ListModelPath && response.status === 200) {
      const resJson = (await response.json()) as OpenAIListModelResponse;
      const availableModels = getModels(resJson);
      return NextResponse.json(availableModels, {
        status: response.status,
      });
    }

    return response;
  } catch (e) {
    console.error("[Custom API] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

async function requestCustomAPI(req: NextRequest) {
  const controller = new AbortController();
  const authValue = req.headers.get("Authorization") ?? "";
  const bearToken = authValue.trim().replaceAll("Bearer ", "").trim();

  const path = `${req.nextUrl.pathname}${req.nextUrl.search}`.replaceAll(
    "/api/custom/",
    "",
  );

  let baseUrl = process.env.CUSTOM_API_URL || "https://api.openai.com";

  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  console.log("[Proxy] ", path);
  console.log("[Base Url] ", baseUrl);

  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  const fetchUrl = `${baseUrl}/${path}`;
  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Authorization: `Bearer ${bearToken}`,
    },
    method: req.method,
    body: req.body,
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  try {
    const res = await fetch(fetchUrl, fetchOptions);
    
    // to prevent browser prompt for credentials
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    newHeaders.set("X-Accel-Buffering", "no");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export { handle };

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
