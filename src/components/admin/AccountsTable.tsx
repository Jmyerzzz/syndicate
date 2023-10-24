import { useCallback, useState } from "react";
import { Oval } from "react-loader-spinner";
import AddWeeklyFigure from "../AddWeeklyFigure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserAccounts, USDollar } from "@/types/types";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import EditAccount from "../EditAccount";
import EditWeeklyFigure from "../EditWeeklyFigure";
import React from "react";

const TableRows = (props: {baseUrl: string, selectedStartOfWeek: Date, groupedAccounts: UserAccounts[], setWeeklyTotal: any, setTotalCollected: any, setRefreshKey: any}) => {
  let weeklyTotal = 0, totalCollected = 0
  const elements: React.ReactElement[] = [];
  const [collapsedRows, setCollapsedRows] = useState<number[]>([]);

  const handleRowClick = useCallback((index: number) => {
    const currentIndex = collapsedRows.indexOf(index);
    const newCollapsedRows = [...collapsedRows];
    if (currentIndex === -1) {
      newCollapsedRows.push(index);
    } else {
      newCollapsedRows.splice(currentIndex, 1);
    }
    setCollapsedRows(newCollapsedRows);
  }, [collapsedRows]);

  const markStiffed = useCallback((weeklyFigureId: string, stiffed: boolean) => {
    fetch("/api/figure/stiff", {
      method: "POST",
      body: JSON.stringify({
        weeklyFigureId: weeklyFigureId,
        stiffed: stiffed
      })
    })

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey +1)
    }, 1000)
  }, [props]);

  return props.groupedAccounts.map((user, index0) => {
    let weeklyFigureAmount: number, weeklyFigureTotal = 0, adjustmentsTotal = 0;
    elements.push(
      <tr key={user.username + index0} onClick={() => handleRowClick(index0)}>
        <td colSpan={12} className="px-3 bg-gray-500 text-gray-100 text-lg hover:cursor-pointer">
          {!collapsedRows.includes(index0) ? <FontAwesomeIcon icon={faChevronDown} className="mr-3" width={20} /> : <FontAwesomeIcon icon={faChevronRight} className="mr-3" width={20} />}
          {user.username} - {user.risk}% Risk
        </td>
      </tr>)
    user.accounts.forEach((account, index1) => {
      weeklyFigureAmount = 0
      if (account.weeklyFigures.length > 0) {
        weeklyFigureAmount = account.weeklyFigures[0].amount;
        weeklyFigureTotal += account.weeklyFigures[0].amount;
      }
      weeklyTotal += weeklyFigureAmount;
      let adjustmentsSum = 0;
      if (account.weeklyFigures[0] && account.weeklyFigures[0].adjustments.length > 0) {
        account.weeklyFigures[0].adjustments.map((adjustment) => {
          adjustmentsSum += adjustment.amount;
        })
        adjustmentsTotal += adjustmentsSum
      }
      totalCollected += adjustmentsSum;
      const stiffed = account.weeklyFigures[0] && account.weeklyFigures[0].stiffed;
      !collapsedRows.includes(index0) && (
        elements.push(
          <tr key={user.username + "data" + index1} className={`${stiffed ? "bg-red-200" : account.weeklyFigures[0] && account.weeklyFigures[0].amount > 0 && weeklyFigureAmount === adjustmentsSum ? "bg-green-200" : "even:bg-white odd:bg-gray-100"} text-gray-700`}>
            <td className="px-3 py-2 whitespace-no-wrap">{index1+1}</td>
            <td className="px-3 py-2 whitespace-no-wrap">
              <div className="flex flex-row items-center">
                <EditAccount baseUrl={props.baseUrl} account={account} setRefreshKey={props.setRefreshKey} />
                {account.website}
              </div>
            </td>
            <td className="px-3 py-2 whitespace-no-wrap">{account.bookie}</td>
            <td className="px-3 py-2 whitespace-no-wrap">{account.referral}</td>
            <td className="px-3 py-2 whitespace-no-wrap">{account.username}</td>
            <td className="px-3 py-2 whitespace-no-wrap">{account.password}</td>
            <td className="px-3 py-2 whitespace-no-wrap">{account.ip_location}</td>
            <td className="px-3 py-2 whitespace-no-wrap">${account.credit_line.toLocaleString()}</td>
            <td className="px-3 py-2 whitespace-no-wrap">${account.max_win.toLocaleString()}</td>
            <td className="px-3 py-2 whitespace-no-wrap font-medium border-l-2 border-gray-200">
              <div className="flex flex-row justify-between items-center">
                {USDollar.format(weeklyFigureAmount)}
                {account.weeklyFigures[0] ? (
                  <EditWeeklyFigure baseUrl={props.baseUrl} account={account} weeklyFigure={account.weeklyFigures[0]} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={props.setRefreshKey} />
                ) : (
                  <AddWeeklyFigure baseUrl={props.baseUrl} account={account} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={props.setRefreshKey} />
                )}
              </div>
            </td>
            <td className="px-3 py-2 whitespace-no-wrap font-medium border-l-2 border-gray-200">
              <div className={`flex flex-row justify-between items-center ${adjustmentsSum > 0 ? "text-green-500" : adjustmentsSum < 0 ? "text-red-500" : "text-gray-700"}`}>
                {USDollar.format(adjustmentsSum)}
                <button type="button" disabled={account.weeklyFigures.length === 0} onClick={() => markStiffed(account.weeklyFigures[0].id, !account.weeklyFigures[0].stiffed)} className={`ml-2 px-2 bg-gray-300 text-gray-500 rounded ${account.weeklyFigures.length > 0 && "hover:bg-gray-400"}`}>
                  {stiffed ? "Unstiff" : "Stiff"}
                </button>
              </div>
            </td>
            <td className="px-3 py-2 whitespace-no-wrap font-medium border-l-2 border-gray-200">
              {USDollar.format(weeklyFigureAmount-adjustmentsSum)}
            </td>
          </tr>
        )
      )
    })
    !collapsedRows.includes(index0) && (
      elements.push(
        <>
          <tr key={user.username + "totals"} className="bg-white">
            <td colSpan={9} className="px-3 py-2 text-right">Totals:</td>
            <td className="px-3 py-2 whitespace-no-wrap font-semibold text-gray-700">
              {USDollar.format(weeklyFigureTotal)}
            </td>
            <td className="px-3 py-2 whitespace-no-wrap font-semibold text-gray-700">
              {USDollar.format(adjustmentsTotal)}
            </td>
            <td className="px-3 py-2 whitespace-no-wrap font-semibold text-gray-700">
              {USDollar.format(weeklyFigureTotal - adjustmentsTotal)}
            </td>
          </tr>
          <tr key={user.username + "synd_totals"} className="bg-white">
            <td colSpan={9} className={`px-3 py-2 text-right ${index0 === props.groupedAccounts.length-1 && "rounded-bl"}`}>T Way:</td>
            <td colSpan={9} className={`px-3 py-2 whitespace-no-wrap font-semibold text-gray-700 ${index0 === props.groupedAccounts.length-1 && "rounded-br"}`}>
              {USDollar.format(weeklyFigureTotal * ((100-user.risk)/100))}
            </td>
          </tr>
        </>
      )
    )
    props.setWeeklyTotal(weeklyTotal)
    props.setTotalCollected(totalCollected)
    return (
      <React.Fragment key={index0}>{elements}</React.Fragment>
    );
  })
}

const AccountsTable = (props: {baseUrl: string, selectedStartOfWeek: Date, groupedAccounts: UserAccounts[], setWeeklyTotal: any, setTotalCollected: any, isLoading: boolean, setRefreshKey: any}) => {
  return (
    <div className="flex flex-col 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
      <table className="table-auto min-w-full">
        <thead className="text-gray-100">
          <tr>
            <th colSpan={9} className="mx-auto px-3 py-3 bg-gray-700 text-md font-bold uppercase tracking-wider text-left md:text-center border-b-2 border-gray-500 rounded-tl">
              Accounts
            </th>
            <th rowSpan={2} className="mx-auto px-3 py-3 bg-gray-800 text-md font-bold uppercase tracking-wider text-center">
              Weekly Figure
            </th>
            <th rowSpan={2} className="px-3 py-3 bg-gray-800 text-md font-bold uppercase tracking-wider text-center border-l-2 border-gray-700">
              Adjustments
            </th>
            <th rowSpan={2} className="px-3 py-3 bg-gray-800 text-md font-bold uppercase tracking-wider text-center border-l-2 border-gray-700 rounded-tr">
              Balance
            </th>
          </tr>
          <tr>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              #
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Website
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Bookie
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Referral
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Username
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Password
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              IP Address
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Credit Line
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Max Win
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {
            props.isLoading ? (
              <tr>
                <td colSpan={12} className="mx-auto py-3 text-center bg-[17, 23, 41]">
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
              <TableRows baseUrl={props.baseUrl} selectedStartOfWeek={props.selectedStartOfWeek} groupedAccounts={props.groupedAccounts} setWeeklyTotal={props.setWeeklyTotal} setTotalCollected={props.setTotalCollected} setRefreshKey={props.setRefreshKey} />
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default AccountsTable