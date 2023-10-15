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
    <div className="flex sm:items-start sm:justify-center min-w-full text-gray-100 bg-gray-700 rounded">
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700 rounded-tl rounded-bl">
        <div className="text-sm sm:text-md">Agents</div>
        {!isLoading && <div className="text-lg sm:text-xl font-semibold">{agentsCount}</div>}
      </div>
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700">
        <div className="text-sm sm:text-md">Weekly Total</div>
        {!isLoading && <div className={`text-lg sm:text-xl ${props.weeklyTotal >= 0 ? "text-green-500" : "text-red-500"} font-semibold`}>{USDollar.format(props.weeklyTotal)}</div>}
      </div>
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700">
        <div className="text-sm sm:text-md">Total Adjustments</div>
        {!isLoading && <div className="text-lg sm:text-xl font-semibold">{USDollar.format(props.totalCollected)}</div>}
      </div>
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700">
        <div className="text-sm sm:text-md">Total Settled</div>
        {!isLoading &&
          <div className="text-lg sm:text-xl font-semibold">
            {isNaN((props.totalCollected/props.weeklyTotal) * 100) ? 0 : ((props.totalCollected/props.weeklyTotal) * 100).toFixed(2)}%
          </div>
        }
      </div>
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-gray-700 rounded-tr rounded-br">
        <div className="text-md">Total Unsettled</div>
        {!isLoading &&
          <div className="text-xl font-semibold">
            {USDollar.format(props.weeklyTotal-props.totalCollected)} / {isNaN((100 - (props.totalCollected/props.weeklyTotal) * 100)) ? 0 : (100 - (props.totalCollected/props.weeklyTotal) * 100).toFixed(2)}%
          </div>
        }
      </div>
    </div>
  )
}

export default SummarySection