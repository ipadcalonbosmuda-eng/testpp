'use client'

import { Header } from '@/components/Header'
import { MintCard } from '@/components/MintCard'
import { StatsCard } from '@/components/StatsCard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-primary-600">xTesT</span> Token
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mint your xTesT tokens using the revolutionary x402 payment standard. 
              Pay with USDC and receive tokens instantly on Base network.
            </p>
          </div>

          {/* Stats and Mint Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StatsCard />
            <MintCard />
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Choose xTesT?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">x402 Payment</h3>
                <p className="text-gray-600">
                  Revolutionary payment standard that enables seamless crypto payments with HTTP 402 responses.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Base Network</h3>
                <p className="text-gray-600">
                  Built on Base mainnet for fast, low-cost transactions with Ethereum security.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Launch</h3>
                <p className="text-gray-600">
                  Transparent minting with per-wallet caps and public supply limits for fair distribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
