import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import SummarySection from "./SummarySection";
import AddWeeklyFigure from "../agent/AddWeeklyFigure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserAccounts, USDollar } from "@/types/types";
import { groupAccountsByUser } from "@/util/util";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import EditAccount from "../EditAccount";
import EditWeeklyFigure from "../EditWeeklyFigure";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import React from "react";

const RunnersTable = (props: {baseUrl: string, selectedStartOfWeek: Date}) => {
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true)
    fetch(props.baseUrl + "/api/accounts/all", {
        method: "POST",
        body: JSON.stringify(props.selectedStartOfWeek)
      })
      .then((response) => response.json())
      .then((data) => {
        setGroupedAccounts(groupAccountsByUser(data))
        setIsLoading(false)
      })
  },[props.selectedStartOfWeek, refreshKey])

  const TableRows = () => {
    let weeklyTotal = 0;
    let totalCollected = 0;
    const elements: React.ReactElement[] = [];
  
    groupedAccounts.forEach((user, index0) => {
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
  
      elements.push(
        <tr key={user.username + "totals"} className={`${weeklyFigureTotal !== adjustmentsTotal ? "bg-red-200" : weeklyFigureTotal !== adjustmentsTotal ? "bg-green-200" : "even:bg-white odd:bg-gray-100"}`}>
          <td className={`${index0 === groupedAccounts.length - 1 && "rounded-bl"} px-3 py-2 whitespace-no-wrap text-gray-700`}>{user.accounts[0].user.name}</td>
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
            {USDollar.format(adjustmentsTotal)}
          </td>
          <td className={`${index0 === groupedAccounts.length - 1 && "rounded-br"} px-3 py-2 whitespace-no-wrap text-gray-700 font-medium`}>
            {USDollar.format((100 - user.risk)/100 * weeklyFigureTotal)}
          </td>
        </tr>
      );
    });
  
    return elements;
  };

  return (
    <>
      <SummarySection baseUrl={props.baseUrl} weeklyTotal={weeklyTotal} totalCollected={totalCollected} />
      <div className="flex flex-col sm:justify-items-center sm:items-center overflow-x-auto">
        <table className="mt-4 table-auto min-w-full">
          <thead className="text-gray-100">
            <tr>
              <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider rounded-tl">
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
                Syndicate Way
              </th>
            </tr>
          </thead>
          {/* <DraggableTableRows /> */}
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {
              isLoading ? (
                <tr>
                  <td colSpan={7} className="mx-auto py-3 text-center bg-[17, 23, 41]">
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