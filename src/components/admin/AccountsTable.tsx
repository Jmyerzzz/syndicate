import { useMemo, useState } from "react";
import { Oval } from "react-loader-spinner";
import UpdateWeeklyFigure from "./UpdateWeeklyFigure";
import SummarySection from "./SummarySection";

interface Account {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    role: string;
    risk_percentage: number | null;
  };
  website: string;
  username: string;
  password: string;
  ip_location: string;
  credit_line: number;
  max_win: number;
  weeklyFigures: Array<{
    id: string;
    account_id: string;
    amount: number;
    date: string;
  }>;
}

interface UserAccounts {
  username: string;
  accounts: Account[];
}

const groupAccountsByUser = (accounts: Account[]): UserAccounts[] => {
  const grouped: { [userId: string]: Account[] } = {};

  accounts.forEach((account) => {
    const username = account.user.username;

    if (!grouped[username]) {
      grouped[username] = [];
    }

    grouped[username].push(account);
  });

  const userAccountsArray: UserAccounts[] = Object.keys(grouped).map((username) => ({
    username,
    accounts: grouped[username],
  }));

  return userAccountsArray;
}

const AccountsTable = (props: {baseUrl: string, selectedStartOfWeek: Date, setSelectedStartOfWeek: any}) => {
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
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

  const TableRows = () => {
    return (
      <>
        {
          groupedAccounts.map((user, index) => {
            const elements: React.ReactElement[] = [];
            elements.push(<tr key={"separator"}><td colSpan={7} className="px-6 bg-gray-400 text-gray-100">{user.username}</td></tr>)
            user.accounts.map((account, index) => {
              const weeklyFigureAmount = account.weeklyFigures.length > 0 ? account.weeklyFigures[0].amount : 0;
              const weeklyFigureId = account.weeklyFigures.length > 0 ? account.weeklyFigures[0].id : "";
              elements.push(
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.website}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.username}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.password}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.ip_location}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">${account.credit_line.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">${account.max_win.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-no-wrap bg-gray-100 text-gray-500 font-medium border-l-2 border-gray-200">
                    <div className="flex flex-row justify-between items-center">
                      ${weeklyFigureAmount.toLocaleString()}
                      <UpdateWeeklyFigure baseUrl={props.baseUrl} account={account} weeklyFigureId={weeklyFigureId} currentAmount={weeklyFigureAmount} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                    </div>
                  </td>
                </tr>
              )
            })
          return elements;
          })
        }
      </>
    )
  }

  return (
    <div className="flex flex-col justify-items-center items-center">
      <SummarySection />
      <table className="mt-4 table-auto min-w-[1140px]">
        <thead className="text-gray-100">
          <tr>
            <th colSpan={6} className="mx-auto px-6 py-3 bg-gray-600 text-md font-bold uppercase tracking-wider text-center border-b-2 border-gray-500">
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
  )
}

export default AccountsTable