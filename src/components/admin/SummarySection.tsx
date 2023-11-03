import { USDollar } from "@/types/types"

const SummarySection = (props: {weeklyTotal: number, totalCollected: number, isLoading: boolean}) => {
  return (
    <div className={`${props.isLoading && "animate-pulse"} flex flex-col sm:flex-row 2xl:items-start 2xl:justify-center min-w-full mt-3 text-slate-100 bg-slate-700 rounded`}>
      <div className="flex flex-row flex-grow">
        <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-slate-700 rounded-tl sm:rounded-l">
          <div className="text-sm md:text-md">Weekly Total</div>
          <div className={`text-lg md:text-xl ${props.weeklyTotal >= 0 ? "text-green-500" : "text-red-500"} font-semibold`}>{USDollar.format(props.weeklyTotal)}</div>
        </div>
        <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-slate-700 rounded-tr">
          <div className="text-sm md:text-md">Total Adjustments</div>
          <div className="text-lg md:text-xl font-semibold">{USDollar.format(props.totalCollected)}</div>
        </div>
      </div>
      <div className="flex flex-row flex-grow">
        <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-slate-700 rounded-bl">
          <div className="text-sm md:text-md">Total Settled</div>
          <div className="text-lg md:text-xl font-semibold">
            {isNaN((props.totalCollected/props.weeklyTotal) * 100) ? 0 : ((props.totalCollected/props.weeklyTotal) * 100).toFixed(2)}%
          </div>
        </div>
        <div className="flex flex-col flex-grow items-center justify-center px-4 py-2 bg-slate-700 rounded-br sm:rounded-r">
          <div className="text-sm md:text-md">Total Unsettled</div>
          <div className="text-xl font-semibold">
            {USDollar.format(props.weeklyTotal-props.totalCollected)} / {isNaN((100 - (props.totalCollected/props.weeklyTotal) * 100)) ? 0 : (100 - (props.totalCollected/props.weeklyTotal) * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummarySection