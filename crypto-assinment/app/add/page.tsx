'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddAsset() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    coingeckoId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add asset')
      }

      alert(`Successfully added ${data.name} at $${data.price}!`)
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="w-full">
      {/* Centered responsive form container */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
          ➕ Add New Asset
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
          Add a cryptocurrency to your portfolio. The price will be fetched automatically from CoinGecko.
        </p>

        {/* Info card with responsive design */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 sm:p-6 mb-6">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>How to find the correct symbol:</span>
          </h3>
          <ol className="list-decimal list-inside text-sm sm:text-base text-indigo-800 dark:text-indigo-200 space-y-2">
            <li>Visit <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-600 dark:hover:text-indigo-300">coingecko.com</a></li>
            <li>Search for your cryptocurrency</li>
            <li>Use the ID from the URL (e.g., "bitcoin", "ethereum", "cardano")</li>
          </ol>
        </div>

        {/* Modern form with responsive layout */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Responsive grid for form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Asset Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Bitcoin"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="symbol" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Symbol (Ticker)
              </label>
              <input
                type="text"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                required
                placeholder="e.g., BTC"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white uppercase transition-all"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                The ticker symbol (e.g., BTC, ETH, ADA)
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="coingeckoId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                CoinGecko ID
              </label>
              <input
                type="text"
                id="coingeckoId"
                name="coingeckoId"
                value={formData.coingeckoId}
                onChange={handleChange}
                required
                placeholder="e.g., bitcoin"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white lowercase transition-all"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Must be lowercase and match the CoinGecko ID exactly
              </p>
            </div>
          </div>

          {/* Responsive button layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? 'Adding...' : 'Add Asset'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Popular cryptocurrencies reference card */}
        <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🔥</span>
            <span>Popular Cryptocurrencies:</span>
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm sm:text-base">
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <strong className="text-gray-900 dark:text-white">Bitcoin (BTC):</strong>
              <code className="text-indigo-600 dark:text-indigo-400">bitcoin</code>
            </div>
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <strong className="text-gray-900 dark:text-white">Ethereum (ETH):</strong>
              <code className="text-indigo-600 dark:text-indigo-400">ethereum</code>
            </div>
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <strong className="text-gray-900 dark:text-white">Cardano (ADA):</strong>
              <code className="text-indigo-600 dark:text-indigo-400">cardano</code>
            </div>
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <strong className="text-gray-900 dark:text-white">Solana (SOL):</strong>
              <code className="text-indigo-600 dark:text-indigo-400">solana</code>
            </div>
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <strong className="text-gray-900 dark:text-white">Ripple (XRP):</strong>
              <code className="text-indigo-600 dark:text-indigo-400">ripple</code>
            </div>
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <strong className="text-gray-900 dark:text-white">Polygon (MATIC):</strong>
              <code className="text-indigo-600 dark:text-indigo-400">matic-network</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
