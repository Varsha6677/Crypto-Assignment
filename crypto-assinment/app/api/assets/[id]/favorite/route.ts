import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid asset ID' },
        { status: 400 }
      );
    }

    // Get current asset
    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Toggle favorite
    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: { favorite: !asset.favorite }
    });

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to update favorite status' },
      { status: 500 }
    );
  }
}
