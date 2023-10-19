import React, { useState } from "react";
import { Oval } from "react-loader-spinner";
import SummarySection from "./SummarySection";
import { UserAccounts, USDollar, BookieData } from "@/types/types";
import { groupAccountsByBookie } from "@/util/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const BookiesTable = (props: {groupedAccounts: UserAccounts[], isLoading: boolean}) => {
  const groupedByBookie = groupAccountsByBookie(props.groupedAccounts);

  console.log(groupedByBookie)

  const TableRows = () => {
    const elements: React.ReactElement[] = [];
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

    groupedByBookie.map((bookie: BookieData, index0: number) => {
      elements.push(
        <tr key={bookie.name + index0} onClick={() => handleRowClick(index0)}>
          <td colSpan={12} className="px-3 bg-gray-500 text-gray-100 text-lg hover:cursor-pointer">
            {!collapsedRows.includes(index0) ? <FontAwesomeIcon icon={faChevronDown} className="mr-3" width={20} /> : <FontAwesomeIcon icon={faChevronRight} className="mr-3" width={20} />}
            {bookie.name}
          </td>
        </tr>
      )
      bookie.websites.map((website, index1) => {
        !collapsedRows.includes(index0) && (
          elements.push(
            <tr key={bookie.name + website.website + index1}>
              <td colSpan={12} className="px-3 bg-blue-200 text-gray-700 text-lg hover:cursor-pointer">
                {website.website}
              </td>
            </tr>
          )
        )
        website.accounts.map((account, index2) => {
          !collapsedRows.includes(index0) && (
            elements.push(
              <tr key={account.id + "accounts" + index2} className="bg-white text-gray-700">
                <td className="px-3 py-2 whitespace-no-wrap">{index2+1}</td>
                <td className="px-3 py-2 w-1/12 whitespace-no-wrap"></td>
                <td className="px-3 py-2 whitespace-no-wrap">{account.user.name}</td>
                <td className="px-3 py-2 whitespace-no-wrap">{account.referral}</td>
                <td className="px-3 py-2 whitespace-no-wrap">{account.username}</td>
                <td className="px-3 py-2 whitespace-no-wrap">{account.password}</td>
                <td className="px-3 py-2 whitespace-no-wrap">{account.ip_location}</td>
                <td className="px-3 py-2 whitespace-no-wrap">${account.credit_line.toLocaleString()}</td>
                <td className="px-3 py-2 whitespace-no-wrap">${account.max_win.toLocaleString()}</td>
              </tr>
            )
          )
        })
      })
    })
    return elements;
  }

  return (
    <>
      <div className="flex flex-col 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
        <table className="table-auto min-w-full">
          <thead className="text-gray-100">
            <tr>
              <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                #
              </th>
              <th className="px-3 py-3 w-1/12 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider"></th>
              <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                Agent
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                Referral
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                Username
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                Password
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                Credit Line
              </th>
              <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
                Max Win
              </th>
            </tr>
          </thead>
          {/* <DraggableTableRows /> */}
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {
              props.isLoading ? (
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

export default BookiesTable