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

export default function Favorites() {
  const [favorites, setFavorites] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      if (!response.ok) throw new Error('Failed to fetch favorites')
      const data = await response.json()
      
      // Double-check: only show assets where favorite is true
      const trueFavorites = data.filter((asset: Asset) => asset.favorite === true)
      setFavorites(trueFavorites)
      setError(null)
    } catch (err) {
      setError('Failed to load favorites. Please try again.')
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
      
      const updatedAsset = await response.json()
      
      // If the asset is no longer a favorite, remove it from the list
      if (!updatedAsset.favorite) {
        setFavorites(favorites.filter(asset => asset.id !== id))
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      alert('Failed to update favorite status')
    }
  }

  useEffect(() => {
    // Wait 3 seconds before fetching favorites from database
    const timeoutId = setTimeout(() => {
      fetchFavorites()
    }, 3000)

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId)
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
          ⭐ Favorite Assets
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Your handpicked cryptocurrency favorites
        </p>
      </div>

      {/* Error message with modern styling */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Empty state with improved design */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh] bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <div className="text-6xl sm:text-7xl mb-6 animate-pulse">⭐</div>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            No favorites yet!
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Go to the dashboard and click the star icon on any asset to add it to your favorites.
          </p>
          <a
            href="/"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <span>📊</span>
            <span>Go to Dashboard</span>
          </a>
        </div>
      ) : (
        /* Responsive grid layout: 1 col mobile, 2 tablet, 3 desktop, 4 large screens */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {favorites.map((asset) => (
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
