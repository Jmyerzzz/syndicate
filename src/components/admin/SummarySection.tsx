import { useMemo, useState } from "react"

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const SummarySection = (props: {baseUrl: string, weeklyTotal: number, totalCollected: number}) => {
  const [agentsCount, setAgentsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useMemo(() => {
    setIsLoading(true)
    fetch(props.baseUrl + "/api/agents/count", {
        method: "GET"
      })
      .then((response) => response.json())
      .then((data) => {
        setAgentsCount(data);
        setIsLoading(false)
      })
  },[])

  return (
    <div className="flex items-start justify-center min-w-full min-h-[68px] bg-gray-100">
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2">
        <div className="text-md text-gray-700">Agents</div>
        {!isLoading && <div className="text-xl text-gray-700 font-semibold">{agentsCount}</div>}
      </div>
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2">
        <div className="text-md text-gray-700">Weekly Total</div>
        {!isLoading && <div className={`text-xl ${props.weeklyTotal >= 0 ? "text-green-500" : "text-red-500"} font-semibold`}>{USDollar.format(props.weeklyTotal)}</div>}
      </div>
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2">
        <div className="text-md text-gray-700">Total Collected</div>
        {!isLoading && <div className="text-xl text-gray-700 font-semibold">{USDollar.format(props.totalCollected)}</div>}
      </div>
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2">
        <div className="text-md text-gray-700">Total Paid</div>
        {!isLoading && <div className="text-xl text-gray-700 font-semibold">{((props.totalCollected/props.weeklyTotal) * 100).toFixed(2)}%</div>}
      </div>
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2">
        <div className="text-md text-gray-700">Total Owed</div>
        {!isLoading && <div className="text-xl text-gray-700 font-semibold">{(100 - (props.totalCollected/props.weeklyTotal) * 100).toFixed(2)}%</div>}
      </div>
    </div>
  )
}

export default SummarySection