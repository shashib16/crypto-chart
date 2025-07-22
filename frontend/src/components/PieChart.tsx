'use client'

import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function PieChart() {
  const data = [
    { name: 'Bitcoin', value: 52.3, amount: '$932B' },
    { name: 'Ethereum', value: 17.8, amount: '$318B' },
    { name: 'BNB', value: 4.2, amount: '$75B' },
    { name: 'XRP', value: 3.1, amount: '$55B' },
    { name: 'Others', value: 22.6, amount: '$403B' },
  ]

  const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#6b7280']

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <p className="text-sm font-bold text-white">{payload[0].name}</p>
          <p className="text-xs text-gray-400">{payload[0].value}%</p>
          <p className="text-xs text-gray-400">{payload[0].payload.amount}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-6">Market Dominance</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RePieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-6 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm text-gray-300">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-white">{item.value}%</span>
              <span className="text-xs text-gray-500 ml-2">{item.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}