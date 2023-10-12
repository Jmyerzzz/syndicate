import { useEffect, useState } from "react";
import AddAccount from "./AddAccount";
import WeekSelector from "../WeekSelector";
import { User } from "@prisma/client";
import { startOfWeek } from "date-fns";
import { Oval } from "react-loader-spinner";

const AgentsAccountsTable = (props: {baseUrl: string, currentUser: User|undefined}) => {
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [userAccountList, setUserAccountList] = useState<any[]>([]);
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
        setUserAccountList(data);
        setIsLoading(false);
      })
  },[selectedStartOfWeek, refreshKey])

  const TableRows = () => {
    return (
      <>
        {
          userAccountList.map((account, index) => {
            const weeklyFigure = account.weeklyFigures.length > 0 ? account.weeklyFigures[0].amount : 0;
            const elements: React.ReactElement[] = [];
            elements.push(
              <tr key={index}>
                <td className="px-6 py-4 whitespace-no-wrap">{account.website}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{account.username}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{account.password}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{account.ip_location}</td>
                <td className="px-6 py-4 whitespace-no-wrap">${account.credit_line.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-no-wrap">${account.max_win.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-no-wrap bg-gray-100 text-gray-500 font-semibold border-l-2 border-gray-200">${weeklyFigure.toLocaleString()}</td>
              </tr>
            )
            return elements
          })
        }
          <tr>
            <td colSpan={7} className="bg-gray-400 hover:bg-gray-500 text-gray-100">
              <AddAccount baseUrl={props.baseUrl} user={props.currentUser} setRefreshKey={setRefreshKey} />
            </td>
          </tr>
      </>
    )
  }

  return (
    <div className="flex flex-col justify-items-center items-center">
      <div>
        <div className="flex flex-row justify-between content-center px-2">
          <div className="px-3 text-2xl uppercase">Accounts</div>
          <WeekSelector setSelectedStartOfWeek={setSelectedStartOfWeek} />
        </div>
        <table className="mt-4 table-auto min-w-[1140px]">
          <thead className="text-gray-100">
            <tr>
              <th colSpan={6} className="mx-auto px-6 py-3 bg-gray-600 text-md font-bold uppercase tracking-wider text-center">
                Accounts
              </th>
              <th rowSpan={2} className="px-6 py-3 bg-gray-800 text-left text-md font-bold uppercase tracking-wider">
                Weekly Figure
              </th>
            </tr>
            <tr>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Credit Line
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Max Win
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500 divide-y divide-gray-200">
            {
              isLoading ? (
                <tr>
                  <td colSpan={7} className="mx-auto py-3 text-center bg-black">
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