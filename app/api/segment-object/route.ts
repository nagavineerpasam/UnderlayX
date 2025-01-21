import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
      useFileOutput: false,
    });

    // First, segment the object
    const segmentationOutput = await replicate.run(
      "swook/inspyrenet:fca3acc6a853c0af68f66a81cbe5085a9ea40ff82661420dbd7dbd75b48a6ec3",
      {
        input: {
          image_path: base64Image,
        }
      }
    );

    // Use the mask to remove the object
    const removalOutput = await replicate.run(
      "zylim0702/remove-object:0e3a841c913f597c1e4c321560aa69e2bc1f15c65f8c366caafc379240efd8ba",
      {
        input: {
          image: base64Image,  // Use base64Image instead of file
          mask: segmentationOutput,
          prompt: "background continuation, seamless texture",
        }
      }
    );

    return NextResponse.json({
      segmented: segmentationOutput,  // This is just the mask
      inpainted: removalOutput,       // This is the background without the object
    });

  } catch (error) {
    console.error('Object segmentation error:', error);
    return NextResponse.json(
      { error: 'Failed to segment and remove object' },
      { status: 500 }
    );
  }
}
