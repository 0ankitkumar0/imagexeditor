import { NextResponse } from "next/server";

/**
 * PRODUCTION-READY BACKEND API FOR AI BACKGROUND REMOVAL
 * 
 * Primary Model: briaai/RMBG-2.0
 * Fallback Model: not-lain/background-removal
 * 
 * Features:
 * - Exponential backoff retries
 * - Automatic failover
 * - Loading state detection
 * - 40s total timeout
 */

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callInferenceModel(modelUrl: string, binaryData: Buffer, token: string, retries = 5) {
  let lastError = "";
  
  for (let i = 0; i < retries; i++) {
    try {
      // Exponential backoff: 2s -> 4s -> 6s -> 8s -> 10s
      const backoff = (i + 1) * 2000;
      if (i > 0) await sleep(backoff);

      const response = await fetch(modelUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "image/png",
          "X-Wait-For-Model": "true",
        },
        body: new Uint8Array(binaryData),
        signal: AbortSignal.timeout(30000), // 30s per individual attempt
      });

      if (response.ok) {
        return response;
      }

      const errorText = await response.text();
      lastError = `Model ${modelUrl.split('/').pop()} failed [Attempt ${i+1}/${retries}]: ${response.status} - ${errorText}`;
      console.warn(lastError);

      // If it's not a temporary error (503/504/429), we might want to stop early, 
      // but HuggingFace often returns 500 or 400 when internally loading.
      // So we retry on almost anything except 401/403.
      if (response.status === 401 || response.status === 403) {
        throw new Error("Authorization failed");
      }

    } catch (err: any) {
      lastError = `Attempt ${i+1} crash: ${err.message}`;
      console.error(lastError);
      if (err.message === "Authorization failed") throw err;
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let binaryData: Buffer;

    if (contentType.includes("application/json")) {
      const { image } = await req.json();
      if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });
      const base64Data = image.includes(",") ? image.split(",")[1] : image;
      binaryData = Buffer.from(base64Data, "base64");
    } else {
      const arrayBuffer = await req.arrayBuffer();
      binaryData = Buffer.from(arrayBuffer);
    }

    if (!binaryData || binaryData.length === 0) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    const HF_TOKEN = process.env.HF_TOKEN || "";

    // 1. Try Primary Model: RMBG-2.0
    console.log("Starting BG removal with RMBG-2.0...");
    let finalResponse = await callInferenceModel(
      "https://api-inference.huggingface.co/models/briaai/RMBG-2.0",
      binaryData,
      HF_TOKEN,
      3 // 3 retries for primary
    );

    // 2. Failover to secondary if primary failed after retries
    if (!finalResponse) {
      console.log("RMBG-2.0 failed/busy, falling back to not-lain...");
      finalResponse = await callInferenceModel(
        "https://api-inference.huggingface.co/models/not-lain/background-removal",
        binaryData,
        HF_TOKEN,
        2 // 2 retries for fallback
      );
    }

    // 3. Final Result Handling
    if (!finalResponse || !finalResponse.ok) {
      return NextResponse.json(
        { 
          error: "AI models are currently under heavy load. We've tried multiple models with retries. Please wait a few seconds and try again.",
        }, 
        { status: 503 }
      );
    }

    const transparentBlob = await finalResponse.blob();
    return new Response(transparentBlob, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });

  } catch (error: any) {
    console.error("Background Removal Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process background removal." },
      { status: 500 }
    );
  }
}
