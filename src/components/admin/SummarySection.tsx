import { useEffect, useState } from "react"

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const SummarySection = (props: {baseUrl: string, weeklyTotal: number, totalCollected: number}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center min-w-full text-gray-100 bg-gray-700 rounded">
      <div className="flex flex-row flex-grow">
        <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700 rounded-tl sm:rounded-l">
          <div className="text-sm sm:text-md">Weekly Total</div>
          <div className={`text-lg sm:text-xl ${props.weeklyTotal >= 0 ? "text-green-500" : "text-red-500"} font-semibold`}>{USDollar.format(props.weeklyTotal)}</div>
        </div>
        <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700 rounded-tr">
          <div className="text-sm sm:text-md">Total Adjustments</div>
          <div className="text-lg sm:text-xl font-semibold">{USDollar.format(props.totalCollected)}</div>
        </div>
      </div>
      <div className="flex flex-row flex-grow">
        <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700 rounded-bl">
          <div className="text-sm sm:text-md">Total Settled</div>
          <div className="text-lg sm:text-xl font-semibold">
            {isNaN((props.totalCollected/props.weeklyTotal) * 100) ? 0 : ((props.totalCollected/props.weeklyTotal) * 100).toFixed(2)}%
          </div>
        </div>
        <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700 rounded-br sm:rounded-r">
          <div className="text-sm sm:text-md">Total Unsettled</div>
          <div className="text-xl font-semibold">
            {USDollar.format(props.weeklyTotal-props.totalCollected)} / {isNaN((100 - (props.totalCollected/props.weeklyTotal) * 100)) ? 0 : (100 - (props.totalCollected/props.weeklyTotal) * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummarySection