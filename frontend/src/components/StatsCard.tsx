'use client'

import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { TrendingUp, Coins, Users } from 'lucide-react'

interface Stats {
  token: {
    name: string
    symbol: string
    address: string
    decimals: number
  }
  supply: {
    total: string
    publicMinted: string
    remaining: string
    maxSupply: string
    publicCap: string
  }
  pricing: {
    priceUsdc: number
    unitXtest: number
    pricePerToken: number
  }
  limits: {
    perWalletCap: string
  }
}

export function StatsCard() {
  const { address } = useAccount()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Token Statistics</h2>
        <p className="text-gray-500">Failed to load statistics</p>
      </div>
    )
  }

  const remainingPercentage = (parseFloat(stats.supply.remaining) / parseFloat(stats.supply.publicCap)) * 100

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Token Statistics</h2>
      
      {/* Supply Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Remaining Supply</span>
          <span className="text-sm text-gray-500">
            {parseFloat(stats.supply.remaining).toLocaleString()} / {parseFloat(stats.supply.publicCap).toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${remainingPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {remainingPercentage.toFixed(1)}% remaining
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Price</p>
          <p className="font-semibold text-gray-900">
            ${stats.pricing.priceUsdc} USDC
          </p>
          <p className="text-xs text-gray-500">
            per {stats.pricing.unitXtest.toLocaleString()} tokens
          </p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Coins className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Minted</p>
          <p className="font-semibold text-gray-900">
            {parseFloat(stats.supply.publicMinted).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">tokens</p>
        </div>
      </div>

      {/* Wallet Cap Info */}
      {address && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Users className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              Per-wallet cap: {parseFloat(stats.limits.perWalletCap).toLocaleString()} tokens
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
