import { useState } from "react"

const SummarySection = () => {
  const [agentsCount, setAgentsCount] = useState<number>(45);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(100);
  const [totalCollected, setTotalCollected] = useState<number>(50);
  const [paid, setPaid] = useState<number>(45);

  return (
    <div className="flex items-center justify-center w-[1140px]">
      <div className="flex flex-col items-center justify-center px-4 py-2 bg-white">
        <div className="text-md text-gray-700">Agents</div>
        <div className="text-xl text-gray-700 font-semibold">{agentsCount}</div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-2 bg-white">
        <div className="text-md text-gray-700">Weekly Total</div>
        <div className={`text-xl ${weeklyTotal >= 0 ? "text-green-500" : "text-red-500"} font-semibold`}>${weeklyTotal.toLocaleString()}</div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-2 bg-white">
        <div className="text-md text-gray-700">Total Collected</div>
        <div className="text-xl text-gray-700 font-semibold">${totalCollected.toLocaleString()}</div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-2 bg-white">
        <div className="text-md text-gray-700">Total Paid</div>
        <div className="text-xl text-gray-700 font-semibold">{(totalCollected/weeklyTotal) * 100}%</div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-2 bg-white">
        <div className="text-md text-gray-700">Total Owed</div>
        <div className="text-xl text-gray-700 font-semibold">45</div>
      </div>
    </div>
  )
}

export default SummarySection