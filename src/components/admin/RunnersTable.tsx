import { useState } from "react";
import { Oval } from "react-loader-spinner";
import SummarySection from "./SummarySection";
import { UserAccounts, USDollar } from "@/types/types";
import React from "react";

const RunnersTable = (props: {baseUrl: string, selectedStartOfWeek: Date, groupedAccounts: UserAccounts[], isLoading: boolean}) => {
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [totalCollected, setTotalCollected] = useState<number>(0);

  const TableRows = () => {
    let weeklyTotal = 0,totalCollected = 0, agentsTotal = 0, gTotal = 0, tTotal = 0;
    const elements: React.ReactElement[] = [];
  
    props.groupedAccounts.forEach((user, index0) => {
      let weeklyFigureTotal = 0;
      let adjustmentsTotal = 0;
  
      user.accounts.forEach((account) => {
        let weeklyFigureAmount = 0;
  
        if (account.weeklyFigures.length > 0) {
          weeklyFigureAmount = account.weeklyFigures[0].amount;
          weeklyFigureTotal += account.weeklyFigures[0].amount;
        }
        weeklyTotal += weeklyFigureAmount;
  
        let adjustmentsSum = 0;
        if (account.weeklyFigures[0] && account.weeklyFigures[0].adjustments.length > 0) {
          account.weeklyFigures[0].adjustments.forEach((adjustment) => {
            adjustmentsSum += adjustment.amount;
          });
          adjustmentsTotal += adjustmentsSum;
        }
        totalCollected += adjustmentsSum;
  
        setWeeklyTotal(weeklyTotal);
        setTotalCollected(totalCollected);
      });

      agentsTotal += user.risk/100 * weeklyFigureTotal;
      gTotal += ((100 - user.risk + (user.gabe_way || 0))/100 * weeklyFigureTotal);
      tTotal += ((100 - user.risk - (user.gabe_way || 0))/100 * weeklyFigureTotal);

      elements.push(
        <tr key={user.username + "weekly_totals"} className={`${weeklyFigureTotal !== adjustmentsTotal ? "bg-red-200" : weeklyFigureTotal !== adjustmentsTotal ? "bg-green-200" : "even:bg-white odd:bg-gray-200"}`}>
          <td className="px-3 py-2 whitespace-no-wrap text-gray-700">{index0}</td>
          <td className="px-3 py-2 whitespace-no-wrap text-gray-700">{user.accounts[0].user.name}</td>
          <td className="px-3 py-2 whitespace-no-wrap text-gray-700">{user.accounts[0].user.username}</td>
          <td className="px-3 py-2 whitespace-no-wrap text-gray-700">
            {USDollar.format(weeklyFigureTotal)}
          </td>
          <td className="px-3 py-2 whitespace-no-wrap text-gray-700">
            {USDollar.format(adjustmentsTotal)}
          </td>
          <td className="px-3 py-2 whitespace-no-wrap text-gray-700 font-medium">
            {USDollar.format(user.risk/100 * weeklyFigureTotal)}
          </td>
          <td className="px-3 py-2 whitespace-no-wrap text-gray-700 font-medium">
            {user.username !== "gabrieladzich" ? USDollar.format((100 - user.risk + (user.gabe_way || 0))/100 * weeklyFigureTotal) : USDollar.format(0)}
          </td>
          <td className="px-3 py-2 whitespace-no-wrap text-gray-700 font-medium">
            {USDollar.format((100 - user.risk - (user.gabe_way || 0))/100 * weeklyFigureTotal)}
          </td>
        </tr>
      );
    });
    elements.push(
      <tr key={"weekly_totals"} className="bg-white">
        <td colSpan={3} className="px-3 py-2 text-right rounded-bl">Totals:</td>
        <td className="px-3 py-2 whitespace-no-wrap font-semibold text-gray-700">
          {USDollar.format(weeklyTotal)}
        </td>
        <td className="px-3 py-2 whitespace-no-wrap font-semibold text-gray-700">
          {USDollar.format(totalCollected)}
        </td>
        <td className="px-3 py-2 whitespace-no-wrap font-semibold text-gray-700">
          {USDollar.format(agentsTotal)}
        </td>
        <td className="px-3 py-2 whitespace-no-wrap font-semibold text-gray-700">
          {USDollar.format(gTotal)}
        </td>
        <td className="px-3 py-2 whitespace-no-wrap font-semibold text-gray-700 rounded-br">
          {USDollar.format(tTotal)}
        </td>
      </tr>
    )

    return elements;
  };

  return (
    <>
      <SummarySection baseUrl={props.baseUrl} weeklyTotal={weeklyTotal} totalCollected={totalCollected} />
      <div className="flex flex-col 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
        <table className="table-auto min-w-full">
          <thead className="text-gray-100">
            <tr>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider rounded-tl">
                #
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
                Username
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
                Weekly Figure Total
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
                Adjustments Total
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
                Agent Way
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
                Gabe Way
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider rounded-tr">
                T Way
              </th>
            </tr>
          </thead>
          {/* <DraggableTableRows /> */}
          <tbody className="text-gray-700">
            {
              props.isLoading ? (
                <tr>
                  <td colSpan={8} className="mx-auto py-3 text-center bg-[17, 23, 41]">
                    <Oval
                      height={60}
                      width={60}
                      color="#4287f5"
                      wrapperStyle={{display: "flex", "justifyContent": "center"}}
                      visible={true}
                      ariaLabel='oval-loading'
                      secondaryColor="#4d64ab"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  </td>
                </tr>
              ) : (
                <TableRows />
              )
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default RunnersTable