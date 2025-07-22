// app/chart/[id]/page.tsx
'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import LiveChart from '@/components/LiveChart'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectCrypto, fetchCryptoList } from '@/store/slices/cryptoSlice'
import { setCrypto } from '@/store/slices/chartSlice'

export default function CryptoChartPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cryptoId = Number(params.id)
  
  const { cryptos, isLoading } = useAppSelector(state => state.crypto)
  const { selectedCrypto } = useAppSelector(state => state.crypto)
  
  console.log({cryptos, isLoading})
  
  // Fetch crypto list if empty
  useEffect(() => {
    if (cryptos.length === 0 && !isLoading) {
      console.log('Fetching crypto list...')
      dispatch(fetchCryptoList({ page: 1, limit: 10 }))
    }
  }, [dispatch, cryptos.length, isLoading])
  
  // Find the crypto by ID
  const crypto = cryptos.find(c => c.id === cryptoId)

  useEffect(() => {
    // If crypto is found and not already selected, select it
    if (crypto && (!selectedCrypto || selectedCrypto.id !== crypto.id)) {
      dispatch(selectCrypto(crypto))
      dispatch(setCrypto({
        id: crypto.id,
        symbol: crypto.symbol,
        price: crypto.price
      }))
    }
  }, [crypto, selectedCrypto, dispatch])
  
  console.log({crypto, selectedCrypto})

  // Show loading while fetching data
  if (isLoading || (cryptos.length === 0 && !crypto)) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading cryptocurrency data...</p>
        </div>
      </div>
    )
  }

  // If crypto not found after loading
  if (!crypto && cryptos.length > 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cryptocurrency not found</h2>
          <p className="text-gray-400 mb-6">The cryptocurrency with ID {cryptoId} doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Full screen container for LiveChart
  return (
    <div className="h-screen w-screen bg-gray-900 p-4">
      <LiveChart isfromChartID={true}/>
    </div>
  )
}