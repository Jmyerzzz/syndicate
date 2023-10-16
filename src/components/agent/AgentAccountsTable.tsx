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


const AgentsAccountsTable = (props: {baseUrl: string, currentUser: User|undefined}) => {
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    fetch(props.baseUrl + "/api/accounts/user", {
        method: "POST",
        body: JSON.stringify({
          date: selectedStartOfWeek,
          username: props.currentUser?.username
        })
      })
      .then((response) => response.json())
      .then((data) => {
        setGroupedAccounts(groupAccountsByUser(data));
        setIsLoading(false);
      })
  },[selectedStartOfWeek, refreshKey])

  const TableRows = () => {
    return (
      <>
        {
          groupedAccounts.map((user, index) => {
            const elements: React.ReactElement[] = [];
            let weeklyFigureAmount: number, weeklyFigureTotal = 0, adjustmentsTotal = 0;
            user.accounts.map((account, index) => {
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
              elements.push(
                <tr key={index} className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : "bg-white"} text-gray-700`}>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="flex flex-row items-center">
                      <EditAccount baseUrl={props.baseUrl} account={account} setRefreshKey={setRefreshKey} />
                      {account.website}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">{account.bookie}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{account.referral}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{account.username}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{account.password}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{account.ip_location}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">${account.credit_line.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">${account.max_win.toLocaleString()}</td>
                  <td className={`${ account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-6 py-4 whitespace-no-wrap bg-gray-100 font-medium border-l-2 border-gray-200`}>
                    {USDollar.format(weeklyFigureAmount)}
                  </td>
                  <td className={`${ account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-6 py-4 whitespace-no-wrap bg-gray-100 font-medium border-l-2 border-gray-200`}>
                    <div className="flex flex-row justify-between items-center">
                      <div className={`${adjustmentsSum > 0 ? "text-green-500" : adjustmentsSum < 0 ? "text-red-500" : "text-gray-700"}`}>
                        {USDollar.format(adjustmentsSum)}
                      </div>
                      <UpdateAdjustments baseUrl={props.baseUrl} account={account} weeklyFigure={account.weeklyFigures[0]} selectedStartOfWeek={selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                    </div>
                  </td>
                  <td className={`${ account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-6 py-4 whitespace-no-wrap bg-gray-100 font-medium border-l-2 border-gray-200`}>
                    {USDollar.format(weeklyFigureAmount-adjustmentsSum)}
                  </td>
                </tr>
              )
            })
            elements.push(
              <tr key={"totals" + index} className="bg-white">
                <td colSpan={8} className="px-6 py-2 text-right">Totals:</td>
                <td className="px-6 py-2 whitespace-no-wrap font-semibold text-gray-700">
                  {USDollar.format(weeklyFigureTotal)}
                </td>
                <td className="px-6 py-2 whitespace-no-wrap font-semibold text-gray-700">
                  {USDollar.format(adjustmentsTotal)}
                </td>
                <td className="px-6 py-2 whitespace-no-wrap font-semibold text-gray-700">
                  {USDollar.format(weeklyFigureTotal - adjustmentsTotal)}
                </td>
              </tr>
            )
          return elements;
          })
        }
          <tr>
            <td colSpan={11} className="bg-gray-400 hover:bg-gray-500 text-gray-100 rounded-b">
              <AddAccount baseUrl={props.baseUrl} user={props.currentUser} setRefreshKey={setRefreshKey} />
            </td>
          </tr>
      </>
    )
  }

  return (
    <div className="flex justify-center mb-6 px-20">
      <div className="flex flex-col items-center min-w-full">
        <div className="flex flex-row justify-between content-center w-full">
          <div className="flex flex-row items-center px-3 text-2xl uppercase text-blue-400 border-b border-solid border-blue-400">
            <FontAwesomeIcon icon={faSackDollar} width={20} className="mr-2" />
            Weekly Figures
          </div>
          <WeekSelector setSelectedStartOfWeek={setSelectedStartOfWeek} />
        </div>
        <table className="mt-4 table-auto min-w-full">
          <thead className="text-gray-100">
            <tr>
              <th colSpan={8} className="mx-auto px-6 py-3 bg-gray-700 text-md font-bold uppercase tracking-wider text-center border-b-2 border-gray-500 rounded-tl">
                Accounts ({props.currentUser?.username} - {props.currentUser?.risk_percentage}% Risk)
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
          <tbody className="text-gray-500 divide-y divide-gray-200">
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
    </div>
  )
}

export default AgentsAccountsTable