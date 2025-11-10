'use client'

import { useState } from 'react'

interface Asset {
  id: number
  name: string
  symbol: string
  price: number
  favorite: boolean
}

interface AssetCardProps {
  asset: Asset
  onFavoriteToggle: (id: number) => void
}

export default function AssetCard({ asset, onFavoriteToggle }: AssetCardProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleFavoriteClick = async () => {
    setIsToggling(true)
    await onFavoriteToggle(asset.id)
    setIsToggling(false)
  }

  return (
    /* Modern responsive card with smooth animations and hover effects */
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-1">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative flex flex-col h-full">
        {/* Header with name and favorite button */}
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {asset.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wide">
              {asset.symbol}
            </p>
          </div>
          <button
            onClick={handleFavoriteClick}
            disabled={isToggling}
            className={`ml-2 text-2xl sm:text-3xl transition-all duration-200 hover:scale-125 active:scale-95 ${
              isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${asset.favorite ? 'animate-pulse' : ''}`}
            aria-label={asset.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {asset.favorite ? '⭐' : '☆'}
          </button>
        </div>
        
        {/* Price display with responsive sizing */}
        <div className="mt-auto">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ${asset.price.toLocaleString('en-US', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
            USD
          </p>
        </div>
      </div>
    </div>
  )
}
