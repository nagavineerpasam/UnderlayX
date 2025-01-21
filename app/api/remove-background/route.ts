import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
      useFileOutput: false,
    });

    // lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1
    const output = await replicate.run(
      "851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc",
      {
        input: {
          image: file
        }
      }
    );

    return NextResponse.json({ url: output });

  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove background' },
      { status: 500 }
    );
  }
}
