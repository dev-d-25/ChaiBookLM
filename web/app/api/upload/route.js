import { NextResponse } from "next/server"; 
import { imagekit } from "@lib/imagekit";
export const runtime = "nodejs";

export async function POST(req) {
  console.log("📂 [Upload API] File upload started...");

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
    });

    return NextResponse.json({
      url: uploadResponse.url,
      name: uploadResponse.name,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
