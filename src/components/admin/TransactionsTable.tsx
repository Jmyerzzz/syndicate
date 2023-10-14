import { useMemo, useState } from "react";
import { Oval } from "react-loader-spinner";
import { Account, UserAccounts, USDollar } from "@/types/types";

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

const TransactionsTable = (props: {baseUrl: string, selectedStartOfWeek: Date}) => {
  const [groupedAccounts, setGroupedAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  },[props.selectedStartOfWeek])

  const TableRows = () => {
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

    return(
      <>
        {
          groupedAccounts?.map((user, index) => {
            const elements: React.ReactElement[] = [];
            elements.push(<tr key={"user" + index} onClick={() => handleRowClick(index)}><td colSpan={5} className="px-6 bg-gray-500 text-gray-100 text-lg hover:cursor-pointer">{user.username}</td></tr>)
            user.accounts.map((account: any) => {
              account.weeklyFigures.map((figure: any) => {
                !collapsedRows.includes(index) && (
                  elements.push(
                    <tr key={"figure" + index} className="px-6 py-4 whitespace-no-wrap">
                      <td className="px-6 py-4 whitespace-no-wrap">FIGURE</td>
                      <td className="px-6 py-4 whitespace-no-wrap">{figure.transaction_date}</td>
                      <td className={`px-6 py-4 whitespace-no-wrap ${figure.amount > 0 ? "text-green-500" : figure.amount < 0 ? "text-red-500" : "text-gray-700"}`}>{USDollar.format(figure.amount)}</td>
                      <td className="px-6 py-4 whitespace-no-wrap"></td>
                    </tr>
                  )
                )
                figure.adjustments.map((adjustment: any) => {
                  !collapsedRows.includes(index) && (
                    elements.push(
                      <tr key={"adjustment" + index} className="px-6 py-4 whitespace-no-wrap">
                        <td className="px-6 py-4 whitespace-no-wrap">ADJUSTMENT</td>
                        <td className="px-6 py-4 whitespace-no-wrap">{adjustment.transaction_date}</td>
                        <td className={`px-6 py-4 whitespace-no-wrap ${adjustment.amount > 0 ? "text-green-500" : adjustment.amount < 0 ? "text-red-500" : "text-gray-700"}`}>{USDollar.format(adjustment.amount)}</td>
                        <td className="px-6 py-4 whitespace-no-wrap">{adjustment.zero_out ? "ZEROED" : ""}</td>
                      </tr>
                    )
                  )
                })
              })
            })
            return elements;
          })
        }
      </>
    )
  }
  return (
    <div className="flex flex-col justify-items-center items-center h-screen">
        <div>
          <table className="mt-4 table-auto">
            <thead className="text-gray-100">
              <tr>
                <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-700 divide-y divide-gray-200">
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

export default TransactionsTable