'use client'

import { useEffect, useState } from 'react'
import AssetCard from '@/components/AssetCard'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Asset {
  id: number
  name: string
  symbol: string
  price: number
  favorite: boolean
}

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets')
      if (!response.ok) throw new Error('Failed to fetch assets')
      const data = await response.json()
      setAssets(data)
      setError(null)
    } catch (err) {
      setError('Failed to load assets. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = async (id: number) => {
    try {
      const response = await fetch(`/api/assets/${id}/favorite`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to toggle favorite')
      
      // Update local state
      setAssets(assets.map(asset => 
        asset.id === id ? { ...asset, favorite: !asset.favorite } : asset
      ))
    } catch (err) {
      console.error('Error toggling favorite:', err)
      alert('Failed to update favorite status')
    }
  }

  const handleRefreshPrices = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/update-prices')
      if (!response.ok) throw new Error('Failed to refresh prices')
      const data = await response.json()
      setAssets(data.assets)
      alert('Prices updated successfully!')
    } catch (err) {
      console.error('Error refreshing prices:', err)
      alert('Failed to refresh prices')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="w-full">
      {/* Responsive header with flex-wrap for mobile */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sm:mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Crypto Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Track your cryptocurrency portfolio in real-time
          </p>
        </div>
        <button
          onClick={handleRefreshPrices}
          disabled={refreshing}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {refreshing ? (
            <>
              <span className="animate-spin text-lg">↻</span>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <span className="text-lg">↻</span>
              <span>Refresh Prices</span>
            </>
          )}
        </button>
      </div>

      {/* Error message with modern styling */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Empty state or asset grid */}
      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center min-h-[50vh] bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <div className="text-6xl sm:text-7xl mb-4">💰</div>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No assets found
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            Add some cryptocurrencies to get started!
          </p>
          <a
            href="/add"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ➕ Add Your First Asset
          </a>
        </div>
      ) : (
        /* Responsive grid layout: 1 col mobile, 2 tablet, 3 desktop, 4 large screens */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
