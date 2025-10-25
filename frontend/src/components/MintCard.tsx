'use client'

import { useAccount } from 'wagmi'
import { useState } from 'react'
import { Mint, Loader2, CheckCircle, ExternalLink } from 'lucide-react'

interface MintResponse {
  ok: boolean
  txHash?: string
  minted?: string
  error?: string
}

interface X402Response {
  x402Version: number
  accepts: Array<{
    scheme: string
    network: string
    maxAmountRequired: string
    resource: string
    description: string
    mimeType: string
    payTo: string
    maxTimeoutSeconds: number
    asset: string
    outputSchema: any
  }>
}

export function MintCard() {
  const { address, isConnected } = useAccount()
  const [unitCount, setUnitCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MintResponse | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)

  const handleMint = async () => {
    if (!address) return

    setLoading(true)
    setResult(null)
    setPaymentUrl(null)

    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyer: address,
          unitCount,
        }),
      })

      if (response.status === 402) {
        // Handle x402 payment required
        const x402Data: X402Response = await response.json()
        const paymentInfo = x402Data.accepts[0]
        
        // In a real implementation, you would redirect to the payment facilitator
        // For demo purposes, we'll simulate the payment flow
        setPaymentUrl(`https://commerce.coinbase.com/checkout/mock_${Date.now()}`)
        
        // Simulate payment completion after 5 seconds
        setTimeout(() => {
          handleMint() // Retry minting after payment
        }, 5000)
        
      } else if (response.ok) {
        const mintResult: MintResponse = await response.json()
        setResult(mintResult)
      } else {
        const errorData = await response.json()
        setResult({ ok: false, error: errorData.error || 'Minting failed' })
      }
    } catch (error) {
      console.error('Mint error:', error)
      setResult({ ok: false, error: 'Network error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const maxUnits = 10 // Reasonable limit for UI

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Mint xTesT Tokens</h2>

      {!isConnected ? (
        <div className="text-center py-8">
          <Mint className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Connect your wallet to start minting</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unit Count Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Units
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUnitCount(Math.max(1, unitCount - 1))}
                disabled={unitCount <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                type="number"
                value={unitCount}
                onChange={(e) => setUnitCount(Math.max(1, Math.min(maxUnits, parseInt(e.target.value) || 1)))}
                className="w-20 text-center border border-gray-300 rounded-md px-2 py-1"
                min="1"
                max={maxUnits}
              />
              <button
                onClick={() => setUnitCount(Math.min(maxUnits, unitCount + 1))}
                disabled={unitCount >= maxUnits}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              1 unit = 1,000 tokens
            </p>
          </div>

          {/* Cost Calculation */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Tokens:</span>
              <span className="font-semibold text-gray-900">
                {(unitCount * 1000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cost:</span>
              <span className="font-semibold text-primary-600">
                ${(unitCount * 5).toFixed(2)} USDC
              </span>
            </div>
          </div>

          {/* Payment Status */}
          {paymentUrl && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
                <span className="text-blue-800">
                  Processing payment... Please complete payment to continue.
                </span>
              </div>
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                Open Payment <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-lg ${
              result.ok ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center">
                {result.ok ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <div className="w-5 h-5 bg-red-600 rounded-full mr-2"></div>
                )}
                <span className={result.ok ? 'text-green-800' : 'text-red-800'}>
                  {result.ok ? 'Minting successful!' : result.error}
                </span>
              </div>
              {result.ok && result.txHash && (
                <div className="mt-2">
                  <p className="text-sm text-green-700">
                    Minted: {result.minted} tokens
                  </p>
                  <a
                    href={`https://basescan.org/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                  >
                    View Transaction <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Mint Button */}
          <button
            onClick={handleMint}
            disabled={loading || !!paymentUrl}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Mint className="w-5 h-5 mr-2" />
                Mint {unitCount} Unit{unitCount > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
