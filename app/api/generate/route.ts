import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("HF ERROR:", errorText);

      return NextResponse.json(
        {
          error: `HF API Error (${response.status})`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const imageBlob = await response.blob();

    return new Response(imageBlob, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Generation failed",
      },
      { status: 500 }
    );
  }
}
