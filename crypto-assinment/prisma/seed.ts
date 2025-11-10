import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

const INITIAL_CRYPTOS = [
  { name: 'Bitcoin', symbol: 'BTC', coingeckoId: 'bitcoin' },
  { name: 'Ethereum', symbol: 'ETH', coingeckoId: 'ethereum' },
  { name: 'Cardano', symbol: 'ADA', coingeckoId: 'cardano' },
  { name: 'Solana', symbol: 'SOL', coingeckoId: 'solana' },
  { name: 'Polkadot', symbol: 'DOT', coingeckoId: 'polkadot' },
  { name: 'Dogecoin', symbol: 'DOGE', coingeckoId: 'dogecoin' },
  { name: 'Shiba Inu', symbol: 'SHIB', coingeckoId: 'shiba-inu' },
  { name: 'Litecoin', symbol: 'LTC', coingeckoId: 'litecoin' },
  { name: 'Tron', symbol: 'TRX', coingeckoId: 'tron' },
  { name: 'Uniswap', symbol: 'UNI', coingeckoId: 'uniswap' },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Fetch all prices at once using coingeckoId
  const ids = INITIAL_CRYPTOS.map(c => c.coingeckoId).join(',')
  const COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/simple/price'
  
  try {
    const response = await axios.get(`${COINGECKO_API_URL}?ids=${ids}&vs_currencies=usd`)
    const prices = response.data

    for (const crypto of INITIAL_CRYPTOS) {
      const price = prices[crypto.coingeckoId]?.usd || 0

      await prisma.asset.upsert({
        where: { symbol: crypto.symbol },
        update: { price, coingeckoId: crypto.coingeckoId },
        create: {
          name: crypto.name,
          symbol: crypto.symbol,
          coingeckoId: crypto.coingeckoId,
          price,
          favorite: false,
        },
      })

      console.log(`✅ ${crypto.name} (${crypto.symbol}): $${price}`)
    }

    console.log('🎉 Seed completed successfully!')
  } catch (error) {
    console.error('❌ Error fetching prices:', error)
    console.log('⚠️  Seeding with default prices...')

    for (const crypto of INITIAL_CRYPTOS) {
      await prisma.asset.upsert({
        where: { symbol: crypto.symbol },
        update: { coingeckoId: crypto.coingeckoId },
        create: {
          name: crypto.name,
          symbol: crypto.symbol,
          coingeckoId: crypto.coingeckoId,
          price: 0,
          favorite: false,
        },
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
