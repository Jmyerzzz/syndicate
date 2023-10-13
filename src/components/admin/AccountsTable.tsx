import { useMemo, useState } from "react";
import { Oval } from "react-loader-spinner";
import SummarySection from "./SummarySection";
import AddWeeklyFigure from "./AddWeeklyFigure";

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
    stiffed: boolean;
    adjustments: Array<{
      id: string;
      figure_id: string;
      amount: number;
      operation: string;
      date: string;
    }>
  }>;
}

interface UserAccounts {
  username: string;
  accounts: Account[];
}

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
});

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
    return (
      <>
        {
          groupedAccounts.map((user, index) => {
            const elements: React.ReactElement[] = [];
            let weeklyFigureAmount: number, weeklyFigureId: string, weeklyFigureTotal = 0, adjustmentsTotal = 0;
            elements.push(<tr key={"user" + index}><td colSpan={8} className="px-6 bg-gray-400 text-gray-100 text-lg">{user.username}</td></tr>)
            user.accounts.map((account, index) => {
              weeklyFigureAmount = 0
              if (account.weeklyFigures.length > 0) {
                weeklyFigureAmount = account.weeklyFigures[0].amount;
                weeklyFigureId = account.weeklyFigures[0].id;
                weeklyFigureTotal += account.weeklyFigures[0].amount;
              }
              weeklyTotal += weeklyFigureTotal;
              let adjustmentsSum = 0;
              if (account.weeklyFigures[0] && account.weeklyFigures[0].adjustments.length > 0) {
                account.weeklyFigures[0].adjustments.map((adjustment) => {
                  if (adjustment.operation === "credit") {
                    adjustmentsSum += adjustment.amount;
                  } else {
                    adjustmentsSum -= adjustment.amount;
                  }
                })
                adjustmentsTotal += adjustmentsSum
              }
              totalCollected += adjustmentsTotal;
              const stiffed = account.weeklyFigures[0] && account.weeklyFigures[0].stiffed;
              elements.push(
                <tr key={index} className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""}`}>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.website}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.username}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.password}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.ip_location}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">${account.credit_line.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">${account.max_win.toLocaleString()}</td>
                  <td className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-6 py-4 whitespace-no-wrap bg-gray-100 text-gray-500 font-medium border-l-2 border-gray-200`}>
                    <div className="flex flex-row justify-between items-center">
                      {USDollar.format(weeklyFigureAmount)}
                      <AddWeeklyFigure baseUrl={props.baseUrl} account={account} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                    </div>
                  </td>
                  <td className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-6 py-4 whitespace-no-wrap bg-gray-100 text-gray-500 font-medium border-l-2 border-gray-200`}>
                    <div className={`flex flex-row justify-between items-center ${adjustmentsSum > 0 ? "text-green-500" : adjustmentsSum < 0 ? "text-red-500" : "text-gray-500"}`}>
                      {USDollar.format(adjustmentsSum)}
                      <button type="button" onClick={() => markStiffed(account.weeklyFigures[0].id, !account.weeklyFigures[0].stiffed)} className="ml-4 px-1 w-5/12 bg-gray-500 text-gray-100 rounded hover:bg-gray-600">
                        {stiffed ? "Unstiff" : "Stiff"}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
            elements.push(
              <tr key={"totals" + index}>
                <td colSpan={6} className="px-6 py-2 bg-white text-right">Totals:</td>
                <td className="px-6 py-2 whitespace-no-wrap text-gray-500">
                  {USDollar.format(weeklyFigureTotal)}
                </td>
                <td className="px-6 py-2 whitespace-no-wrap text-gray-500">
                  {USDollar.format(adjustmentsTotal)}
                </td>
              </tr>
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
    <div className="flex flex-col justify-items-center items-center">
      <SummarySection baseUrl={props.baseUrl} weeklyTotal={weeklyTotal} totalCollected={totalCollected} />
      <table className="mt-4 table-auto min-w-full">
        <thead className="text-gray-100">
          <tr>
            <th colSpan={6} className="mx-auto px-6 py-3 bg-gray-600 text-md font-bold uppercase tracking-wider text-center border-b-2 border-gray-500">
              Accounts
            </th>
            <th rowSpan={2} className="mx-auto px-6 py-3 bg-gray-800 text-md font-bold uppercase tracking-wider text-center">
              Weekly Figure
            </th>
            <th rowSpan={2} className="px-6 py-3 bg-gray-800 text-md font-bold uppercase tracking-wider text-center border-l-2 border-gray-700">
              Adjustments
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
                <td colSpan={8} className="mx-auto py-3 text-center bg-black">
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