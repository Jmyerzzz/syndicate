import { useMemo, useState } from "react";
import { Oval } from "react-loader-spinner";
import SummarySection from "./SummarySection";
import AddWeeklyFigure from "./AddWeeklyFigure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserAccounts, USDollar } from "@/types/types";
import { groupAccountsByUser } from "@/util/util";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import EditAccount from "../EditAccount";

const AccountsTable = (props: {baseUrl: string, selectedStartOfWeek: Date, setSelectedStartOfWeek: any}) => {
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useMemo(() => {
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

  const markStiffed = (weeklyFigureId: string, stiffed: boolean) => {
    fetch("/api/figure/stiff", {
      method: "POST",
      body: JSON.stringify({
        weeklyFigureId: weeklyFigureId,
        stiffed: stiffed
      })
    })

    setTimeout(() => {
      setRefreshKey((oldKey: number) => oldKey +1)
    }, 1000)
  }

  const TableRows = () => {
    let weeklyTotal = 0, totalCollected = 0
    const [collapsedRows, setCollapsedRows] = useState<number[]>([]);

    const handleRowClick = (index: number) => {
      const currentIndex = collapsedRows.indexOf(index);
      const newCollapsedRows = [...collapsedRows];
      if (currentIndex === -1) {
        newCollapsedRows.push(index);
      } else {
        newCollapsedRows.splice(currentIndex, 1);
      }
      setCollapsedRows(newCollapsedRows);
    };

    return (
      <>
        {
          groupedAccounts.map((user, index) => {
            const elements: React.ReactElement[] = [];
            let weeklyFigureAmount: number, weeklyFigureTotal = 0, adjustmentsTotal = 0;
            elements.push(
              <tr key={"user" + index} onClick={() => handleRowClick(index)}>
                <td colSpan={11} className="px-6 bg-gray-500 text-gray-100 text-lg hover:cursor-pointer">
                  {!collapsedRows.includes(index) ? <FontAwesomeIcon icon={faChevronDown} className="mr-3" width={20} /> : <FontAwesomeIcon icon={faChevronRight} className="mr-3" width={20} />}
                  {user.username} - {user.risk}% Risk
                </td>
              </tr>)
            user.accounts.map((account) => {
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
              !collapsedRows.includes(index) && (
                elements.push(
                  <tr key={index} className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : "bg-white"} text-gray-700`}>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      <div className="flex flex-row justify-start items-center">
                        {account.website}
                        <EditAccount baseUrl={props.baseUrl} user={account.user} account={account} setRefreshKey={setRefreshKey} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.bookie}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.referral}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.username}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.password}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.ip_location}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">${account.credit_line.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">${account.max_win.toLocaleString()}</td>
                    <td className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-6 py-4 whitespace-no-wrap bg-gray-100 font-medium border-l-2 border-gray-200`}>
                      <div className="flex flex-row justify-between items-center">
                        {USDollar.format(weeklyFigureAmount)}
                        <AddWeeklyFigure baseUrl={props.baseUrl} account={account} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                      </div>
                    </td>
                    <td className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-6 py-4 whitespace-no-wrap bg-gray-100 font-medium border-l-2 border-gray-200`}>
                      <div className={`flex flex-row justify-between items-center ${adjustmentsSum > 0 ? "text-green-500" : adjustmentsSum < 0 ? "text-red-500" : "text-gray-700"}`}>
                        {USDollar.format(adjustmentsSum)}
                        <button type="button" disabled={account.weeklyFigures.length === 0} onClick={() => markStiffed(account.weeklyFigures[0].id, !account.weeklyFigures[0].stiffed)} className={`ml-4 px-1 w-5/12 bg-gray-500 text-gray-100 rounded ${account.weeklyFigures.length > 0 && "hover:bg-gray-600"}`}>
                          {stiffed ? "Unstiff" : "Stiff"}
                        </button>
                      </div>
                    </td>
                    <td className={`${ account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-6 py-4 whitespace-no-wrap bg-gray-100 font-medium border-l-2 border-gray-200`}>
                      {USDollar.format(weeklyFigureAmount-adjustmentsSum)}
                    </td>
                  </tr>
                )
              )
            })
            !collapsedRows.includes(index) && (
              elements.push(
                <tr key={"totals" + index} className="bg-white">
                  <td colSpan={8} className={`px-6 py-2 text-right ${index === groupedAccounts.length-1 && "rounded-bl"}`}>Totals:</td>
                  <td className="px-6 py-2 whitespace-no-wrap font-semibold text-gray-700">
                    {USDollar.format(weeklyFigureTotal)}
                  </td>
                  <td className="px-6 py-2 whitespace-no-wrap font-semibold text-gray-700">
                    {USDollar.format(adjustmentsTotal)}
                  </td>
                  <td className={`px-6 py-2 whitespace-no-wrap font-semibold text-gray-700 ${index === groupedAccounts.length-1 && "rounded-br"}`}>
                    {USDollar.format(weeklyFigureTotal - adjustmentsTotal)}
                  </td>
                </tr>
              )
            )
            setWeeklyTotal(weeklyTotal)
            setTotalCollected(totalCollected)
            return elements;
          })
        }
      </>
    )
  }

  return (
    <div className="flex flex-col sm:justify-items-center sm:items-center overflow-x-auto">
      <SummarySection baseUrl={props.baseUrl} weeklyTotal={weeklyTotal} totalCollected={totalCollected} />
      <table className="mt-4 table-auto min-w-full">
        <thead className="text-gray-100">
          <tr>
            <th colSpan={8} className="mx-auto px-6 py-3 bg-gray-700 text-md font-bold uppercase tracking-wider text-center border-b-2 border-gray-500 rounded-tl">
              Accounts
            </th>
            <th rowSpan={2} className="mx-auto px-6 py-3 bg-gray-800 text-md font-bold uppercase tracking-wider text-center">
              Weekly Figure
            </th>
            <th rowSpan={2} className="px-6 py-3 bg-gray-800 text-md font-bold uppercase tracking-wider text-center border-l-2 border-gray-700">
              Adjustments
            </th>
            <th rowSpan={2} className="px-6 py-3 bg-gray-800 text-md font-bold uppercase tracking-wider text-center border-l-2 border-gray-700 rounded-tr">
              Balance
            </th>
          </tr>
          <tr>
            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Website
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Bookie
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Referral
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Password
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              IP Address
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Credit Line
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-bold uppercase tracking-wider">
              Max Win
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700 divide-y divide-gray-200">
          {
            isLoading ? (
              <tr>
                <td colSpan={9} className="mx-auto py-3 text-center bg-[17, 23, 41]">
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
  )
}

export default AccountsTable