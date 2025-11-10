import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

const COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/simple/price';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany();

    if (assets.length === 0) {
      return NextResponse.json({ message: 'No assets to update' });
    }

    // Fetch all prices at once using coingeckoId
    const ids = assets.map(a => a.coingeckoId).join(',');
    const response = await axios.get(`${COINGECKO_API_URL}?ids=${ids}&vs_currencies=usd`);
    const prices = response.data;

    // Update each asset with better error handling
    const updateResults = await Promise.allSettled(
      assets.map(async (asset) => {
        const newPrice = prices[asset.coingeckoId]?.usd;
        if (newPrice && newPrice > 0) {
          return await prisma.asset.update({
            where: { id: asset.id },
            data: { price: newPrice }
          });
        }
        return null;
      })
    );

    // Count successful and failed updates
    const successful = updateResults.filter(r => r.status === 'fulfilled' && r.value !== null).length;
    const failed = assets.length - successful;

    const updatedAssets = await prisma.asset.findMany({
      orderBy: { id: 'asc' }
    });

    return NextResponse.json({
      message: `Prices updated: ${successful} successful, ${failed} failed`,
      assets: updatedAssets,
      stats: { successful, failed, total: assets.length }
    });
  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json(
      { error: 'Failed to update prices' },
      { status: 500 }
    );
  }
}
