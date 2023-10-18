import { useEffect, useState } from "react";
import AddAccount from "./AddAccount";
import WeekSelector from "../WeekSelector";
import { User } from "@prisma/client";
import { startOfWeek } from "date-fns";
import { Oval } from "react-loader-spinner";
import UpdateAdjustments from "./UpdateAdjustments";
import { Account, UserAccounts, USDollar } from "@/types/types";
import { groupAccountsByUser } from "@/util/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import EditAccount from "../EditAccount";
import AddWeeklyFigure from "./AddWeeklyFigure";
import EditWeeklyFigure from "../EditWeeklyFigure";


const AgentsAccountsTable = (props: {baseUrl: string, currentUser: User|undefined, selectedStartOfWeek: Date}) => {
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    fetch(props.baseUrl + "/api/accounts/user", {
        method: "POST",
        body: JSON.stringify({
          date: props.selectedStartOfWeek,
          username: props.currentUser?.username
        })
      })
      .then((response) => response.json())
      .then((data) => {
        setGroupedAccounts(groupAccountsByUser(data));
        setIsLoading(false);
      })
  },[props, refreshKey])

  const TableRows = () => {
    return (
      <>
        {
          groupedAccounts.map((user, index0) => {
            const elements: React.ReactElement[] = [];
            let weeklyFigureAmount: number, weeklyFigureTotal = 0, adjustmentsTotal = 0;
            user.accounts.map((account, index1) => {
              weeklyFigureAmount = 0
              if (account.weeklyFigures.length > 0) {
                weeklyFigureAmount = account.weeklyFigures[0].amount;
                weeklyFigureTotal += account.weeklyFigures[0].amount;
              }
              let adjustmentsSum = 0;
              if (account.weeklyFigures[0] && account.weeklyFigures[0].adjustments.length > 0) {
                account.weeklyFigures[0].adjustments.map((adjustment) => {
                  adjustmentsSum += adjustment.amount;
                })
                adjustmentsTotal += adjustmentsSum
              }
              const stiffed = account.weeklyFigures[0] && account.weeklyFigures[0].stiffed;
              elements.push(
                <tr key={index1} className={`${stiffed ? "bg-red-200" : account.weeklyFigures[0] && weeklyFigureAmount === adjustmentsSum ? "bg-green-200" :  "even:bg-white odd:bg-gray-100"} text-gray-700`}>
                  <td className="px-3 py-2 whitespace-no-wrap">{index1+1}</td>
                  <td className="px-3 py-2 whitespace-no-wrap">
                    <div className="flex flex-row items-center">
                      <EditAccount baseUrl={props.baseUrl} account={account} setRefreshKey={setRefreshKey} />
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
                  <td className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-3 py-2 whitespace-no-wrap font-medium border-l-2 border-gray-200`}>
                    <div className="flex flex-row justify-between items-center">
                      {USDollar.format(weeklyFigureAmount)}
                      {account.weeklyFigures[0] ? (
                        <EditWeeklyFigure baseUrl={props.baseUrl} account={account} weeklyFigure={account.weeklyFigures[0]} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                      ) : (
                        <AddWeeklyFigure baseUrl={props.baseUrl} account={account} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-no-wrap font-medium border-l-2 border-gray-200">
                    <div className="flex flex-row justify-between items-center">
                      <div className={`${adjustmentsSum > 0 ? "text-green-500" : adjustmentsSum < 0 ? "text-red-500" : "text-gray-700"}`}>
                        {USDollar.format(adjustmentsSum)}
                      </div>
                      <UpdateAdjustments baseUrl={props.baseUrl} account={account} weeklyFigure={account.weeklyFigures[0]} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-no-wrap font-medium border-l-2 border-gray-200">
                    {USDollar.format(weeklyFigureAmount-adjustmentsSum)}
                  </td>
                </tr>
              )
            })
            elements.push(
              <>
                <tr key={"totals" + index0} className="bg-white">
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
              </>
            )
          return elements;
          })
        }
          <tr>
            <td colSpan={12} className="bg-gray-400 hover:bg-gray-500 text-gray-100 rounded-b">
              <AddAccount baseUrl={props.baseUrl} user={props.currentUser} setRefreshKey={setRefreshKey} />
            </td>
          </tr>
      </>
    )
  }

  return (
    <div className="flex justify-center mb-6">
      <table className="mt-4 table-auto min-w-full">
        <thead className="text-gray-100">
          <tr>
            <th colSpan={9} className="mx-auto px-3 py-3 bg-gray-700 text-md font-bold uppercase tracking-wider text-center border-b-2 border-gray-500 rounded-tl">
              Accounts ({props.currentUser?.username} - {props.currentUser?.risk_percentage}% Risk)
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
        <tbody className="text-gray-500 divide-y divide-gray-200">
          {
            isLoading ? (
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
              <TableRows />
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default AgentsAccountsTable