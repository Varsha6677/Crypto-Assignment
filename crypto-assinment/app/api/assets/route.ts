import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

const COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/simple/price';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, symbol, coingeckoId } = await req.json();

    if (!name || !symbol || !coingeckoId) {
      return NextResponse.json(
        { error: 'Name, symbol, and CoinGecko ID are required' },
        { status: 400 }
      );
    }

    // Check if asset already exists by symbol or coingeckoId
    const existingBySymbol = await prisma.asset.findUnique({
      where: { symbol: symbol.toUpperCase() }
    });

    const existingByCoingeckoId = await prisma.asset.findUnique({
      where: { coingeckoId: coingeckoId.toLowerCase() }
    });

    if (existingBySymbol || existingByCoingeckoId) {
      return NextResponse.json(
        { error: 'Asset with this symbol or CoinGecko ID already exists' },
        { status: 409 }
      );
    }

    // Fetch price from CoinGecko using coingeckoId
    const response = await axios.get(
      `${COINGECKO_API_URL}?ids=${coingeckoId.toLowerCase()}&vs_currencies=usd`
    );

    const price = response.data[coingeckoId.toLowerCase()]?.usd;

    if (!price) {
      return NextResponse.json(
        { error: 'Could not fetch price for this CoinGecko ID. Please verify the ID is correct.' },
        { status: 404 }
      );
    }

    const newAsset = await prisma.asset.create({
      data: { 
        name, 
        symbol: symbol.toUpperCase(), 
        coingeckoId: coingeckoId.toLowerCase(),
        price 
      },
    });

    return NextResponse.json(newAsset, { status: 201 });
  } catch (error: any) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create asset' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      );
    }

    const assetId = parseInt(id);
    if (isNaN(assetId)) {
      return NextResponse.json(
        { error: 'Invalid asset ID' },
        { status: 400 }
      );
    }

    // Check if asset exists
    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Delete the asset
    await prisma.asset.delete({
      where: { id: assetId }
    });

    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
