import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { faceImage } = await request.json();

    if (!faceImage) {
      return NextResponse.json(
        { error: 'Face image is required' },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const prompt = `A realistic outdoor portrait of a young Vietnamese woman standing next to tall and lush blooming wild sunflower bushes. The flowers are bright golden yellow, resembling large daisies with elongated petals and deep orange centers, surrounded by serrated green leaves. She wears a soft white-blue ao dai, gracefully holding a wide-brimmed conical hat (non la) in her hand, creating an elegant and harmonious look. Her straight shoulder-length hair frames her gentle face; her skin is bright, smooth, and healthy with a natural subtle closed-mouth smile. She stands gracefully beside a classic white bicycle, with a basket of freshly picked wild sunflowers in the wicker basket. The scene evokes a peaceful, nostalgic, and poetic atmosphere, recreating the natural beauty of wild sunflowers blooming along rustic country roads. Lighting: soft golden sunset light, natural backlighting, cinematic depth, warm gentle tones. Style: photorealistic, full-frame focus, high detail, professional photography, natural face proportions preserved, Vietnamese features, genuine expression, outdoor natural lighting`;

    const output = await replicate.run(
      "lucataco/flux-dev-lora:091495765fa5ef2725a175a57b276ec30dc9d39c22d30410f2ede68a3eab66b3",
      {
        input: {
          prompt: prompt,
          hf_lora: "alvdansen/frosting_lane_flux",
          num_outputs: 1,
          aspect_ratio: "3:4",
          output_format: "webp",
          guidance_scale: 3.5,
          output_quality: 90,
          prompt_strength: 0.8,
          num_inference_steps: 28,
        },
      }
    );

    return NextResponse.json({ output: Array.isArray(output) ? output[0] : output });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}
