'use client'

import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react'

// Move config outside component to prevent recreation
const timeframeConfig = {
  '1M': { points: 60, interval: 1000 },
  '5M': { points: 60, interval: 5000 },
  '15M': { points: 48, interval: 15000 },
  '1H': { points: 24, interval: 60000 },
  '4H': { points: 24, interval: 240000 },
  '1D': { points: 30, interval: 3600000 }
}
interface DatapPriceAtTime<T = Date, U = number> {
  time: T
  timeFormatted?: string
  price: U
}


type TimeFrame = '1M' | '5M' | '15M' | '1H' | '4H' | '1D'


export default function LiveChart() {
  const [data, setData] = useState<DatapPriceAtTime[]>([])
  const [currentPrice, setCurrentPrice] = useState(43250)
  const [timeframe, setTimeframe] = useState<TimeFrame>('1H')
  const [priceChange, setPriceChange] = useState(2.34)
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)

  // Format time based on timeframe
  const formatTime = (date: Date, tf: string) => {
    if (tf === '1M') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } else if (tf === '5M' || tf === '15M' || tf === '1H' || tf === '4H') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Generate initial data based on timeframe
  useEffect(() => {
    const config = timeframeConfig[timeframe]
    const basePrice = 43000
    const volatility = timeframe === '1M' ? 100 :
      timeframe === '5M' ? 200 :
        timeframe === '15M' ? 300 :
          timeframe === '1H' ? 400 :
            timeframe === '4H' ? 600 : 800

    const newData = Array.from({ length: config.points }, (_, i) => {
      const timeOffset = (config.points - i) * config.interval
      const time = new Date(Date.now() - timeOffset)
      const randomPrice = basePrice + (Math.random() - 0.5) * volatility + Math.sin(i / 5) * (volatility / 2)

      return {
        time: time,
        timeFormatted: formatTime(time, timeframe),
        price: Math.max(randomPrice, basePrice - volatility / 2)
      }
    })
    setData(newData)

    // Calculate price change
    if (newData.length > 0) {
      const change = ((newData[newData.length - 1].price - newData[0].price) / newData[0].price * 100)
      setPriceChange(change)
    }
  }, [timeframe])

  // Simulate real-time updates
  useEffect(() => {
    const config = timeframeConfig[timeframe]

    const interval = setInterval(() => {
      const newPrice = 43000 + (Math.random() - 0.5) * 500
      const now = new Date()
      const newDataPoint = {
        time: now,
        timeFormatted: formatTime(now, timeframe),
        price: newPrice
      }

      setCurrentPrice(newPrice)
      setData(prev => {
        const updated = [...prev.slice(1), newDataPoint]
        if (updated.length > 0) {
          const change = ((updated[updated.length - 1].price - updated[0].price) / updated[0].price * 100)
          setPriceChange(change)
        }
        return updated
      })
    }, config.interval)

    return () => clearInterval(interval)
  }, [timeframe])

  // D3 Chart
  useEffect(() => {
    if (!data.length) return

    const margin = { top: 20, right: 30, bottom: 40, left: 70 }
    const width = 800 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const xExtent = d3.extent(data, d => d.time)
    const xDomain: [Date, Date] =
      xExtent[0] && xExtent[1]
        ? [xExtent[0], xExtent[1]]
        : [new Date(Date.now() - 1000 * 60 * 60), new Date()] // fallback: last hour


    // Scales
    const xScale = d3.scaleTime()
      .domain(xDomain)
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, (d: { price: any }) => d.price) - 100,
        d3.max(data, (d: { price: any }) => d.price) + 100
      ])
      .range([height, 0])

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(5)
          .tickSize(-height)
          .tickFormat(() => "") // <-- FIXED
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)
      .style("stroke", "#374151")

    g.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => "") // <-- FIXED
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)
      .style("stroke", "#374151")

    // Area generator
    const area = d3.area<{ time: Date, price: number }>()
      .x((d: { time: Date }) => xScale(d.time))
      .y0(height)
      .y1((d: { price: number }) => yScale(d.price))
      .curve(d3.curveMonotoneX)

    // Line generator
    const line = d3.line<{ time: Date, price: number }>()
      .x((d: { time: any }) => xScale(d.time))
      .y((d: { price: any }) => yScale(d.price))
      .curve(d3.curveMonotoneX)

    // Gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", yScale(d3.max(data, (d: { price: any }) => d.price)))
      .attr("x2", 0).attr("y2", yScale(d3.min(data, (d: { price: any }) => d.price)))

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
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area)

    // Add line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line)

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat((d: any) => formatTime(d, timeframe))
      )
      .style("color", "#9ca3af")
      .style("font-size", "12px")

    // Y axis
    g.append("g")
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat((d: { toLocaleString: () => any }) => `$${d.toLocaleString()}`)
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
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d: { time: any }) => xScale(d.time))
      .attr("cy", (d: { price: any }) => yScale(d.price))
      .attr("r", 0)
      .style("fill", "#3b82f6")

    // Overlay for mouse tracking
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", function (event: { offsetX: number; offsetY: number }) {
        const [mouseX] = d3.pointer(event)
        const x0 = xScale.invert(mouseX)
        const bisect = d3.bisector((d: { time: any }) => d.time).left
        const index = bisect(data, x0, 1)
        const d0 = data[index - 1]
        const d1 = data[index]
        let d = d0
        if (d1 && d0) {
          d = (x0.getTime() - d0.time.getTime() > d1.time.getTime() - x0.getTime()) ? d1 : d0
        }

        if (d) {
          dots.attr("r", (datum: any) => datum === d ? 4 : 0)

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
      .on("mouseout", function () {
        dots.attr("r", 0)
        tooltip.style("opacity", 0)
      })

  }, [data, timeframe])

  const isPositive = priceChange >= 0

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Bitcoin Price</h2>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold">${currentPrice.toFixed(2)}</p>
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
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      {/* Timeframe Toggle Buttons */}
      <div className="flex gap-1 mb-4">
        {Object.keys(timeframeConfig).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf as TimeFrame)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${timeframe === tf
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200'
              }`}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="relative">
        <svg ref={svgRef} className="w-full" />
        <div ref={tooltipRef} />
      </div>
    </div>
  )
}