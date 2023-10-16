import { useMemo, useState } from "react";
import { Oval } from "react-loader-spinner";
import { USDollar, dateTimeFormat } from "@/types/types";
import { groupAccountsByUser } from "@/util/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { User } from "@prisma/client";

const TransactionsTable = (props: {baseUrl: string, selectedStartOfWeek: Date, currentUser?: User|undefined}) => {
  const [groupedAccounts, setGroupedAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (!props.currentUser) {
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
  } else {
    useMemo(() => {
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
    },[props.selectedStartOfWeek])
  }

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
            elements.push(
              <tr key={"user" + index} onClick={() => handleRowClick(index)}>
                <td colSpan={5} className="px-6 bg-gray-500 text-gray-100 text-lg hover:cursor-pointer">
                  {!collapsedRows.includes(index) ? <FontAwesomeIcon icon={faChevronDown} className="mr-3" width={20} /> : <FontAwesomeIcon icon={faChevronRight} className="mr-3" width={20} />}
                  {user.username}
                </td>
              </tr>
            )
            user.accounts.map((account: any, index0: number) => {
              account.weeklyFigures.map((figure: any, index1: number) => {
                console.log(`${index0}, ${(user.accounts.length-1)}`)
                console.log(`${index1}, ${(account.weeklyFigures.length-1)}`)

                !collapsedRows.includes(index) && (
                  elements.push(
                    <tr key={"figure" + index} className="px-6 py-4 whitespace-no-wrap bg-gray-200 border-t-2 border-gray-700">
                      <td className={`px-6 py-4 whitespace-no-wrap text-gray-500 ${((index1 === account.weeklyFigures.length-1 || figure.adjustments.length === 0) && (index0 === user.accounts.length-1 && figure.adjustments.length === 0)) && "rounded-bl"}`}>FIGURE</td>
                      <td className="px-6 py-4 whitespace-no-wrap">{dateTimeFormat.format(new Date(figure.transaction_date))}</td>
                      <td className={`px-6 py-4 whitespace-no-wrap ${figure.amount > 0 ? "text-green-500" : figure.amount < 0 ? "text-red-500" : "text-gray-700"}`}>{USDollar.format(figure.amount)}</td>
                      <td className={`px-6 py-4 whitespace-no-wrap text-gray-500 ${((index1 === account.weeklyFigures.length-1 || figure.adjustments.length === 0) && (index0 === user.accounts.length-1 && figure.adjustments.length === 0)) && "rounded-br"}`}>{account.website}</td>
                    </tr>
                  )
                )
                figure.adjustments.map((adjustment: any, index2: number) => {
                  !collapsedRows.includes(index) && (
                    elements.push(
                      <tr key={"adjustment" + index} className="px-6 py-4 whitespace-no-wrap bg-white">
                        <td className={`px-6 py-4 whitespace-no-wrap text-gray-500 ${index2 === figure.adjustments.length-1 && index0 === user.accounts.length-1 && "rounded-bl"}`}>ADJUSTMENT</td>
                        <td className="px-6 py-4 whitespace-no-wrap">{dateTimeFormat.format(new Date(adjustment.transaction_date))}</td>
                        <td className={`px-6 py-4 whitespace-no-wrap ${adjustment.amount > 0 ? "text-green-500" : adjustment.amount < 0 ? "text-red-500" : "text-gray-700"}`}>{USDollar.format(adjustment.amount)}</td>
                        <td className={`px-6 py-4 whitespace-no-wrap text-gray-500 ${index2 === figure.adjustments.length-1 && index0 === user.accounts.length-1 && "rounded-br"}`}>{adjustment.zero_out ? "ZEROED" : ""}</td>
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
    <div className="flex flex-col sm:justify-items-center sm:items-center">
      <table className="mt-4 table-auto">
        <thead className="text-gray-100">
          <tr>
            <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider rounded-tl">
              Type
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider rounded-tr">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700 divide-y divide-gray-200">
        {
        isLoading ? (
          <tr>
            <td colSpan={4} className="mx-auto py-3 text-center bg-[17, 23, 41]">
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

export default TransactionsTable