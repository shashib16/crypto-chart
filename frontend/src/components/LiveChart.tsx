'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import * as d3 from 'd3'
import { Activity, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react'
import { 
  setTimeframe, 
  setCrypto,
  updatePrice, 
  initializeData 
} from '@/store/slices/chartSlice'
import type { RootState, AppDispatch } from '@/store/store'

type TimeFrame = '1M' | '5M' | '15M' | '1H' | '4H' | '1D'

interface ChartDataPoint {
  time: string
  timeFormatted: string
  price: number
}

// Move config outside component to prevent recreation
const timeframeConfig: Record<TimeFrame, { points: number; interval: number }> = {
  '1M': { points: 60, interval: 1000 },
  '5M': { points: 60, interval: 5000 },
  '15M': { points: 48, interval: 15000 },
  '1H': { points: 24, interval: 60000 },
  '4H': { points: 24, interval: 240000 },
  '1D': { points: 30, interval: 3600000 }
}

// Format time based on timeframe
const formatTime = (date: Date, tf: TimeFrame): string => {
  if (tf === '1M') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } else if (tf === '5M' || tf === '15M' || tf === '1H' || tf === '4H') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
interface liveChartInterface {
  isfromChartID?: boolean
}
export default function LiveChart(livechartprops : liveChartInterface) {
  const { isfromChartID = false } = livechartprops
  // Use typed hooks
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { data, currentPrice, timeframe, priceChange, cryptoSymbol } = useSelector((state: RootState) => state.chart)
  const { selectedCrypto } = useSelector((state: RootState) => state.crypto)
  console.log("selectedCrypto", selectedCrypto)
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update chart when a new crypto is selected
  useEffect(() => {
    if (selectedCrypto) {
      // Clear any existing interval
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }

      // Update chart crypto info
      dispatch(setCrypto({
        id: selectedCrypto.id,
        symbol: selectedCrypto.symbol,
        price: selectedCrypto.price
      }))
      
      // Initialize data with selected crypto's base price
      dispatch(initializeData({ 
        timeframe, 
        basePrice: selectedCrypto.price 
      }))
    }
  }, [selectedCrypto, dispatch]) // Remove timeframe from dependencies to prevent loops

  // Initialize data when timeframe changes (but not when selectedCrypto changes)
  useEffect(() => {
    const basePrice = selectedCrypto?.price || currentPrice
    dispatch(initializeData({ timeframe, basePrice }))
  }, [timeframe, dispatch]) // Only depend on timeframe changes

  // Simulate real-time updates
  useEffect(() => {
    // Clear any existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current)
    }

    const config = timeframeConfig[timeframe as TimeFrame]
    const basePrice = selectedCrypto?.price || currentPrice
    
    // Calculate volatility based on price range
    const volatilityFactor = basePrice > 1000 ? 0.01 : 
                           basePrice > 100 ? 0.02 : 
                           basePrice > 10 ? 0.03 : 
                           basePrice > 1 ? 0.04 : 0.05
    const volatility = basePrice * volatilityFactor
    
    updateIntervalRef.current = setInterval(() => {
      const randomChange = (Math.random() - 0.5) * volatility
      const newPrice = basePrice + randomChange
      const now = new Date()
      
      dispatch(updatePrice({
        price: Math.max(newPrice, basePrice * 0.9), // Prevent negative or too low prices
        time: now.toISOString(),
        timeFormatted: formatTime(now, timeframe as TimeFrame)
      }))
    }, config.interval)

    // Cleanup function
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [timeframe, selectedCrypto?.id]) // Depend on crypto id to restart when crypto changes

  // D3 Chart
  useEffect(() => {
    if (!data.length) return

    const margin = { top: 20, right: 30, bottom: 40, left: 70 }
    
    // Get parent container dimensions
    const container = svgRef.current?.parentElement
    const containerWidth = container?.clientWidth || 800
    const containerHeight = container?.clientHeight || 400
    
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom - 120 // Subtract header and buttons height

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Convert ISO strings back to Date objects for D3
    const dataWithDates = data.map(d => ({
      ...d,
      time: new Date(d.time)
    }))

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(dataWithDates, d => d.time) as [Date, Date])
      .range([0, width])

    const priceExtent = d3.extent(dataWithDates, d => d.price) as [number, number]
    const pricePadding = (priceExtent[1] - priceExtent[0]) * 0.1 || 10

    const yScale = d3.scaleLinear()
      .domain([
        priceExtent[0] - pricePadding,
        priceExtent[1] + pricePadding
      ])
      .range([height, 0])

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .ticks(5)
        .tickSize(-height)
        .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)
      .style("stroke", "#374151")

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)
      .style("stroke", "#374151")

    // Area generator
    const area = d3.area<typeof dataWithDates[0]>()
      .x(d => xScale(d.time))
      .y0(height)
      .y1(d => yScale(d.price))
      .curve(d3.curveMonotoneX)

    // Line generator
    const line = d3.line<typeof dataWithDates[0]>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX)

    // Gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", yScale(priceExtent[1]))
      .attr("x2", 0).attr("y2", yScale(priceExtent[0]))

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.3)

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0)

    // Add area
    g.append("path")
      .datum(dataWithDates)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area as any)

    // Add line
    g.append("path")
      .datum(dataWithDates)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line as any)

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d => formatTime(d as Date, timeframe as TimeFrame))
      )
      .style("color", "#9ca3af")
      .style("font-size", "12px")

    // Y axis
    g.append("g")
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => {
          const price = d as number
          if (price >= 1000) {
            return `$${(price / 1000).toFixed(1)}k`
          } else if (price >= 1) {
            return `$${price.toFixed(0)}`
          } else {
            return `$${price.toFixed(3)}`
          }
        })
      )
      .style("color", "#9ca3af")
      .style("font-size", "12px")

    // Tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style("opacity", 0)
      .style("position", "absolute")
      .style("pointer-events", "none")

    // Add dots for hover
    const dots = g.selectAll(".dot")
      .data(dataWithDates)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.time))
      .attr("cy", d => yScale(d.price))
      .attr("r", 0)
      .style("fill", "#3b82f6")

    // Overlay for mouse tracking
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", function(event) {
        const [mouseX] = d3.pointer(event)
        const x0 = xScale.invert(mouseX)
        const bisect = d3.bisector<typeof dataWithDates[0], Date>(d => d.time).left
        const index = bisect(dataWithDates, x0, 1)
        const d0 = dataWithDates[index - 1]
        const d1 = dataWithDates[index]
        const d = d1 && (x0.getTime() - d0.time.getTime() > d1.time.getTime() - x0.getTime()) ? d1 : d0

        if (d) {
          dots.attr("r", (datum) => datum === d ? 4 : 0)

          tooltip
            .style("opacity", 1)
            .style("left", `${event.offsetX + 10}px`)
            .style("top", `${event.offsetY - 10}px`)
            .html(`
              <div class="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <p class="text-xs text-gray-400">${d.timeFormatted}</p>
                <p class="text-sm font-bold text-white">$${d.price.toFixed(2)}</p>
              </div>
            `)
        }
      })
      .on("mouseout", function() {
        dots.attr("r", 0)
        tooltip.style("opacity", 0)
      })

  }, [data, timeframe])

  const isPositive = priceChange >= 0

  const handleTimeframeChange = (tf: TimeFrame) => {
    dispatch(setTimeframe(tf))
  }

  const openInNewPage = () => {
    if (selectedCrypto) {
      // Use window.open for new tab/window
      window.open(`/chart/${selectedCrypto.id}`, '_blank')
    } else {
      // Default to Bitcoin (id: 1) if no crypto is selected
      window.open('/chart/1', '_blank')
    }
  }

  // Display the selected crypto name or default to Bitcoin
  const cryptoName = selectedCrypto?.name || 'Bitcoin'
  const displaySymbol = selectedCrypto?.symbol || cryptoSymbol || 'BTC'

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">{cryptoName} Price</h2>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold">
              ${currentPrice >= 1 ? currentPrice.toFixed(2) : currentPrice.toFixed(4)}
            </p>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{Math.abs(priceChange).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400">Symbol</p>
            <p className="text-sm font-medium">{displaySymbol}</p>
          </div>
          <div className="flex items-center gap-2">
            {!isfromChartID && <button
              onClick={openInNewPage}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Open in full page"
            >
              <ExternalLink className="w-4 h-4" />
            </button>}
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-400">Live</span>
          </div>
        </div>
      </div>

      {/* Timeframe Toggle Buttons */}
      <div className="flex gap-1 mb-4">
        {(Object.keys(timeframeConfig) as TimeFrame[]).map((tf) => (
          <button
            key={tf}
            onClick={() => handleTimeframeChange(tf)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart Container - Flex grow to fill remaining space */}
      <div className="relative flex-1 min-h-0">
        <svg ref={svgRef} className="w-full h-full" />
        <div ref={tooltipRef} />
      </div>
    </div>
  )
}