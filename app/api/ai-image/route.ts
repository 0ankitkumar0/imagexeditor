import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

/**
 * PRODUCTION-READY BACKEND API FOR AI IMAGE GENERATION
 * 
 * Tech Stack: Next.js App Router
 * Model: black-forest-labs/FLUX.1-schnell
 * Provider: nscale (via HuggingFace Inference API)
 */

// Initialize HuggingFace Inference Client with API Token
const client = new InferenceClient(process.env.HF_TOKEN);

// Style enhancement presets for T-shirt graphic design
const STYLE_PRESETS: Record<string, string> = {
  anime: "vibrant anime style, high contrast, clean lines, cel shaded",
  streetwear: "modern streetwear aesthetic, bold typography elements, urban culture vibe, high fashion",
  vintage: "retro 90s vintage style, distressed texture, faded colors, nostalgic graphic",
  minimal: "clean minimalist design, simple shapes, vector art style, elegant, spacious",
  cyberpunk: "futuristic cyberpunk aesthetic, neon colors, high-tech details, dark atmosphere",
};

/**
 * POST /api/ai-image
 * 
 * Body: 
 * - For generation: { prompt: string, style?: string }
 * - For bg removal: { image: string (dataURL), action: "remove-bg" }
 */
export async function POST(req: Request) {
  try {
    // 1. Parse and Validate Request Body
    const body = await req.json();
    const { prompt, style, image, action } = body;

    // --- NEW: DIRECT BACKGROUND REMOVAL PATH ---
    if (action === "remove-bg" && image) {
      console.log("Direct background removal requested...");
      
      try {
        const base64Data = image.split(',')[1];
        if (!base64Data) throw new Error("Invalid image data format");
        const binaryData = Buffer.from(base64Data, 'base64');
        
        // Primary Attempt
        let bgResponse = await fetch(
          "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
            body: binaryData,
            signal: AbortSignal.timeout(30000), // 30s timeout
          }
        );

        // If primary is busy/loading, try once more or fallback
        if (!bgResponse.ok) {
          console.warn("Primary BG removal busy, attempting fallback...");
          bgResponse = await fetch(
            "https://api-inference.huggingface.co/models/finegrain/image-background-removal",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
              body: binaryData,
              signal: AbortSignal.timeout(30000),
            }
          );
        }

        if (!bgResponse.ok) {
          const errorText = await bgResponse.text();
          throw new Error(`AI models are busy: ${bgResponse.status}`);
        }

        const resultBlob = await bgResponse.blob();
        return new Response(resultBlob, {
          headers: { "Content-Type": "image/png" },
        });
      } catch (err: any) {
        console.error("BG Removal Internal Error:", err);
        return NextResponse.json({ 
          error: "Background removal timed out or models are under heavy load. Please try again in a moment.",
          details: err.message 
        }, { status: 500 });
      }
    }

    // Validation for generation (only if not remove-bg)
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A valid prompt is required for image generation." },
        { status: 400 }
      );
    }

    // 2. Build Enhanced Prompt for Ecommerce
    // High-contrast "Sticker" prompt is the best way to get clean edges for background removal.
    const styleEnhancement = style && STYLE_PRESETS[style] ? STYLE_PRESETS[style] : "professional vector art";
    
    // We emphasize "PURE WHITE" background with no textures to help the segmentation model.
    const enhancedPrompt = `${prompt}, ${styleEnhancement}, centered sticker graphic, die-cut, bold clean edges, solid flat PURE WHITE background, absolutely no shadows, no gradients, no texture on background, 4k resolution, professional digital illustration`;

    // 3. Step 1: Generate Image using FLUX.1-schnell
    const generatedImageBlob = await client.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: enhancedPrompt,
      parameters: {
        width: 1024,
        height: 1024,
      },
      provider: "nscale" as any, 
    });

    // 4. Step 2: Remove Background
    // We'll try the briaai/RMBG-2.0 model as primary
    let finalImageBlob: Blob = generatedImageBlob;
    let bgRemoved = false;
    
    const bgModels = [
      "https://api-inference.huggingface.co/models/briaai/RMBG-2.0",
      "https://api-inference.huggingface.co/models/briaai/RMBG-1.4"
    ];

    for (const modelUrl of bgModels) {
      try {
        const bgResponse = await fetch(modelUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "X-Wait-For-Model": "true",
          },
          body: generatedImageBlob,
          signal: AbortSignal.timeout(20000),
        });

        if (bgResponse.ok) {
          const resultBlob = await bgResponse.blob();
          if (resultBlob.size > 100) {
            finalImageBlob = resultBlob;
            bgRemoved = true;
            break;
          }
        }
      } catch (bgError) {
        console.warn(`BG removal model ${modelUrl} failed:`, bgError);
      }
    }

    // 5. Return PNG Image Response
    return new Response(finalImageBlob, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, must-revalidate",
        "X-BG-Removed": bgRemoved ? "true" : "false", // For debugging in browser
      },
    });

  } catch (error: any) {
    console.error("AI Generation API Error:", error);

    // Error Handling: Model Loading
    if (error.message?.includes("loading")) {
      return NextResponse.json(
        { error: "Model is currently warming up. Please try again in 10-15 seconds." },
        { status: 503 }
      );
    }

    // Error Handling: Invalid Token / Authorization
    if (error.message?.includes("Authorization") || error.status === 401) {
      return NextResponse.json(
        { error: "Invalid HuggingFace Token. Please check your .env configuration." },
        { status: 401 }
      );
    }

    // Error Handling: Timeout
    if (error.name === "AbortError" || error.status === 504) {
      return NextResponse.json(
        { error: "Image generation timed out. The model is currently under heavy load." },
        { status: 504 }
      );
    }

    // Generic Error Handling
    return NextResponse.json(
      { 
        error: "Failed to generate image.",
        details: error.message || "Unknown error occurred during inference."
      },
      { status: error.status || 500 }
    );
  }
}
