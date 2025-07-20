import md5 from "spark-md5";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// 创建存储目录
const ARTIFACTS_DIR = path.join(process.cwd(), "artifacts");

async function ensureArtifactsDir() {
  try {
    await fs.access(ARTIFACTS_DIR);
  } catch {
    await fs.mkdir(ARTIFACTS_DIR, { recursive: true });
  }
}

async function handle(req: NextRequest) {
  await ensureArtifactsDir();

  if (req.method === "POST") {
    const clonedBody = await req.text();
    const hashedCode = md5.hash(clonedBody).trim();
    const filePath = path.join(ARTIFACTS_DIR, `${hashedCode}.html`);

    try {
      await fs.writeFile(filePath, clonedBody, "utf-8");
      console.log("save data", { id: hashedCode, success: true });

      return NextResponse.json(
        { code: 0, id: hashedCode, result: { success: true } },
        { status: 200 },
      );
    } catch (error) {
      console.error("Save data error:", error);
      return NextResponse.json(
        { error: true, msg: "Save data error" },
        { status: 400 },
      );
    }
  }
  if (req.method === "GET") {
    const id = req?.nextUrl?.searchParams?.get("id");
    if (!id) {
      return NextResponse.json(
        { error: true, msg: "Missing id parameter" },
        { status: 400 },
      );
    }

    const filePath = path.join(ARTIFACTS_DIR, `${id}.html`);

    try {
      const content = await fs.readFile(filePath, "utf-8");
      return new Response(content, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      });
    } catch (error) {
      console.error("Read data error:", error);
      return NextResponse.json(
        { error: true, msg: "File not found" },
        { status: 404 },
      );
    }
  }
  return NextResponse.json(
    { error: true, msg: "Invalid request" },
    { status: 400 },
  );
}

export const POST = handle;
export const GET = handle;
