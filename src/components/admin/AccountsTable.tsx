import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import SummarySection from "./SummarySection";
import AddWeeklyFigure from "../agent/AddWeeklyFigure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserAccounts, USDollar } from "@/types/types";
import { groupAccountsByUser } from "@/util/util";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import EditAccount from "../EditAccount";
import EditWeeklyFigure from "../EditWeeklyFigure";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import React from "react";

const AccountsTable = (props: {baseUrl: string, selectedStartOfWeek: Date}) => {
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
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

  const DraggableTableRows = () => {
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

    const reorder = (list: UserAccounts[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
    
      return result;
    };

    const handleDrop = (result: any) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      const items = reorder(
        groupedAccounts,
        result.source.index,
        result.destination.index
      );


      setGroupedAccounts(items);
    };

    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
    
      // change background colour if dragging
      background: isDragging && "lightgreen",
    
      // styles we need to apply on draggables
      ...draggableStyle
    });

    return (
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <tbody
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="text-gray-700 divide-y divide-gray-200"
            >
              {groupedAccounts.map((user, index0) => {
                let weeklyFigureAmount: number, weeklyFigureTotal = 0, adjustmentsTotal = 0;
                return (
                  <React.Fragment key={index0}>
                    <tr key={"user" + index0} onClick={() => handleRowClick(index0)}>
                      <td colSpan={11} className="px-3 bg-gray-500 text-gray-100 text-lg hover:cursor-pointer">
                        {!collapsedRows.includes(index0) ? <FontAwesomeIcon icon={faChevronDown} className="mr-3" width={20} /> : <FontAwesomeIcon icon={faChevronRight} className="mr-3" width={20} />}
                        {user.username} - {user.risk}% Risk
                      </td>
                    </tr>
                    {!collapsedRows.includes(index0) && (
                      user.accounts.map((account, index1) => {
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
                        return (
                          <Draggable key={index1} draggableId={account.id.toString()} index={index1+1} isDragDisabled={false}>
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                key={index1 + "row"}
                                className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : "even:bg-white odd:bg-gray-100"} text-gray-700`}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <td className="px-3 py-2 whitespace-no-wrap w-1/12">
                                  <div className="flex flex-row items-center">
                                    <EditAccount baseUrl={props.baseUrl} account={account} setRefreshKey={setRefreshKey} />
                                    {account.website}
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-no-wrap w-1/12">{account.bookie}</td>
                                <td className="px-3 py-2 whitespace-no-wrap w-1/12">{account.referral}</td>
                                <td className="px-3 py-2 whitespace-no-wrap w-1/12">{account.username}</td>
                                <td className="px-3 py-2 whitespace-no-wrap w-1/12">{account.password}</td>
                                <td className="px-3 py-2 whitespace-no-wrap w-1/12">{account.ip_location}</td>
                                <td className="px-3 py-2 whitespace-no-wrap w-1/12">${account.credit_line.toLocaleString()}</td>
                                <td className="px-3 py-2 whitespace-no-wrap w-1/12">${account.max_win.toLocaleString()}</td>
                                <td className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-3 py-2 whitespace-no-wrap w-1/12 font-medium border-l-2 border-gray-200`}>
                                  <div className="flex flex-row justify-between items-center">
                                    {USDollar.format(weeklyFigureAmount)}
                                    {account.weeklyFigures[0] ? (
                                      <EditWeeklyFigure baseUrl={props.baseUrl} account={account} weeklyFigure={account.weeklyFigures[0]} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                                    ) : (
                                      <AddWeeklyFigure baseUrl={props.baseUrl} account={account} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={setRefreshKey} />
                                    )}
                                  </div>
                                </td>
                                <td className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-3 py-2 whitespace-no-wrap w-1/12 font-medium border-l-2 border-gray-200`}>
                                  <div className={`flex flex-row justify-between items-center ${adjustmentsSum > 0 ? "text-green-500" : adjustmentsSum < 0 ? "text-red-500" : "text-gray-700"}`}>
                                    {USDollar.format(adjustmentsSum)}
                                    <button type="button" disabled={account.weeklyFigures.length === 0} onClick={() => markStiffed(account.weeklyFigures[0].id, !account.weeklyFigures[0].stiffed)} className={`ml-4 px-1 w-5/12 bg-gray-300 text-gray-500 rounded ${account.weeklyFigures.length > 0 && "hover:bg-gray-400"}`}>
                                      {stiffed ? "Unstiff" : "Stiff"}
                                    </button>
                                  </div>
                                </td>
                                <td className={`${ account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-3 py-2 whitespace-no-wrap w-1/12 font-medium border-l-2 border-gray-200`}>
                                  {USDollar.format(weeklyFigureAmount-adjustmentsSum)}
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        )
                      })
                    )}
                    {!collapsedRows.includes(index0) && (
                      <>
                        <tr key={user.username + "totals"} className="bg-white">
                          <td colSpan={8} className="px-3 py-2 text-right">Totals:</td>
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
                          <td colSpan={8} className={`px-3 py-2 text-right ${index0 === groupedAccounts.length-1 && "rounded-bl"}`}>Syndicate Way:</td>
                          <td colSpan={8} className={`px-3 py-2 whitespace-no-wrap font-semibold text-gray-700 ${index0 === groupedAccounts.length-1 && "rounded-br"}`}>
                            {USDollar.format(weeklyFigureTotal * ((100-user.risk)/100))}
                          </td>
                        </tr>
                      </>
                    )}
                    setWeeklyTotal(weeklyTotal)
                    setTotalCollected(totalCollected)
                  </React.Fragment>)
              })}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

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
          groupedAccounts.map((user, index0) => {
            const elements: React.ReactElement[] = [];
            let weeklyFigureAmount: number, weeklyFigureTotal = 0, adjustmentsTotal = 0;
            elements.push(
              <tr key={"user" + index0} onClick={() => handleRowClick(index0)}>
                <td colSpan={12} className="px-3 bg-gray-500 text-gray-100 text-lg hover:cursor-pointer">
                  {!collapsedRows.includes(index0) ? <FontAwesomeIcon icon={faChevronDown} className="mr-3" width={20} /> : <FontAwesomeIcon icon={faChevronRight} className="mr-3" width={20} />}
                  {user.username} - {user.risk}% Risk
                </td>
              </tr>)
            user.accounts.map((account, index1) => {
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
                  <tr key={index0 + index1 + "main"} className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : account.weeklyFigures[0] && weeklyFigureAmount === adjustmentsSum ? "bg-green-200" : "even:bg-white odd:bg-gray-100"} text-gray-700`}>
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
                      <div className={`flex flex-row justify-between items-center ${adjustmentsSum > 0 ? "text-green-500" : adjustmentsSum < 0 ? "text-red-500" : "text-gray-700"}`}>
                        {USDollar.format(adjustmentsSum)}
                        <button type="button" disabled={account.weeklyFigures.length === 0} onClick={() => markStiffed(account.weeklyFigures[0].id, !account.weeklyFigures[0].stiffed)} className={`ml-4 px-1 w-5/12 bg-gray-300 text-gray-500 rounded ${account.weeklyFigures.length > 0 && "hover:bg-gray-400"}`}>
                          {stiffed ? "Unstiff" : "Stiff"}
                        </button>
                      </div>
                    </td>
                    <td className={`${ account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-3 py-2 whitespace-no-wrap font-medium border-l-2 border-gray-200`}>
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
                    <td colSpan={9} className={`px-3 py-2 text-right ${index0 === groupedAccounts.length-1 && "rounded-bl"}`}>Syndicate Way:</td>
                    <td colSpan={9} className={`px-3 py-2 whitespace-no-wrap font-semibold text-gray-700 ${index0 === groupedAccounts.length-1 && "rounded-br"}`}>
                      {USDollar.format(weeklyFigureTotal * ((100-user.risk)/100))}
                    </td>
                  </tr>
                </>
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
    <>
      <SummarySection baseUrl={props.baseUrl} weeklyTotal={weeklyTotal} totalCollected={totalCollected} />
      <div className="flex flex-col sm:justify-items-center sm:items-center overflow-x-auto">
        <table className="mt-4 table-auto min-w-full">
          <thead className="text-gray-100">
            <tr>
              <th colSpan={9} className="mx-auto px-3 py-3 bg-gray-700 text-md font-bold uppercase tracking-wider text-center border-b-2 border-gray-500 rounded-tl">
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
          {/* <DraggableTableRows /> */}
          <tbody className="text-gray-700 divide-y divide-gray-200">
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
    </>
  )
}

export default AccountsTable