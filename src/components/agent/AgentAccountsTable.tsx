import React from "react";
import AddAccount from "./AddAccount";
import { User } from "@prisma/client";
import { Oval } from "react-loader-spinner";
import UpdateAdjustments from "./UpdateAdjustments";
import { UserAccounts, USDollar } from "@/types/types";
import EditAccount from "../EditAccount";
import AddWeeklyFigure from "../AddWeeklyFigure";
import EditWeeklyFigure from "../EditWeeklyFigure";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const DraggableTableRows = (props: {baseUrl: string, currentUser: User|undefined, selectedStartOfWeek: Date, groupedAccounts: UserAccounts[], setRefreshKey: any}) => {
  const elements: JSX.Element[] = [];
  let groupedAccounts = props.groupedAccounts;

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: "none",
  
    background: isDragging && "#e9d5ff",

    display: isDragging && "table",

    ...draggableStyle
  });

  groupedAccounts.forEach((user) => {
    let weeklyFigureTotal = 0, adjustmentsTotal = 0;
    elements.push(
      <Droppable key={user.username + "droppable"} droppableId={user.username + "droppable"}>
        {(provided) => (
          <tbody ref={provided.innerRef} {...provided.droppableProps} className="text-slate-700">
            {user.accounts.map((account, index1) => {
              let weeklyFigureAmount: number = 0, adjustmentsSum: number = 0
              if (account.weeklyFigures.length > 0) {
                weeklyFigureAmount = account.weeklyFigures[0].amount;
              }
              if (account.weeklyFigures[0] && account.weeklyFigures[0].adjustments.length > 0) {
                account.weeklyFigures[0].adjustments.map((adjustment) => {
                  adjustmentsSum += adjustment.amount;
                })
              }
              const stiffed = account.weeklyFigures[0] && account.weeklyFigures[0].stiffed;
              return <Draggable key={account.id + "draggable"} draggableId={account.id.toString()} index={index1}>
                {(provided, snapshot) => (
                  <tr
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={account.id}
                    className={`${stiffed ? "bg-red-200" : account.weeklyFigures[0] && account.weeklyFigures[0].amount !== 0 && weeklyFigureAmount === adjustmentsSum ? "bg-green-200" : "even:bg-white odd:bg-slate-100"} text-slate-700`}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <td className="px-3 py-2 whitespace-no-wrap w-1/24">{index1+1}</td>
                    <td className="px-3 py-2 whitespace-no-wrap w-3/24">
                      <div className="flex flex-row items-center">
                        <EditAccount baseUrl={props.baseUrl} account={account} setRefreshKey={props.setRefreshKey} />
                        {account.website}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/24">{account.bookie}</td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/24">{account.referral}</td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/12">{account.username}</td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/12">{account.password}</td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/12">{account.ip_location}</td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/24">${account.credit_line.toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/24">${account.max_win.toLocaleString()}</td>
                    <td className={`${account.weeklyFigures[0] && account.weeklyFigures[0].stiffed ? "bg-red-200" : ""} px-3 py-2 whitespace-no-wrap w-1/12 font-medium border-l-2 border-slate-200`}>
                      <div className="flex flex-row justify-between items-center">
                        {USDollar.format(weeklyFigureAmount)}
                        {account.weeklyFigures[0] ? (
                          <EditWeeklyFigure baseUrl={props.baseUrl} account={account} weeklyFigure={account.weeklyFigures[0]} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={props.setRefreshKey} />
                        ) : (
                          <AddWeeklyFigure baseUrl={props.baseUrl} account={account} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={props.setRefreshKey} />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/12 font-medium border-l-2 border-slate-200">
                      <div className="flex flex-row justify-between items-center">
                        <div className={`${adjustmentsSum > 0 ? "text-green-500" : adjustmentsSum < 0 ? "text-red-500" : "text-slate-700"}`}>
                          {USDollar.format(adjustmentsSum)}
                        </div>
                        <UpdateAdjustments baseUrl={props.baseUrl} account={account} weeklyFigure={account.weeklyFigures[0]} selectedStartOfWeek={props.selectedStartOfWeek} setRefreshKey={props.setRefreshKey} />
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-no-wrap w-1/24 font-medium border-l-2 border-slate-200">
                      {USDollar.format(weeklyFigureAmount-adjustmentsSum)}
                    </td>
                  </tr>
                )}
              </Draggable>
            })}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    )
    {elements.push(
      <tbody>
        <tr key={user.username + "totals"} className="bg-white">
          <td colSpan={9} className="px-3 py-2 text-right">Totals:</td>
          <td className="px-3 py-2 whitespace-no-wrap font-semibold text-slate-700">
            {USDollar.format(weeklyFigureTotal)}
          </td>
          <td className="px-3 py-2 whitespace-no-wrap font-semibold text-slate-700">
            {USDollar.format(adjustmentsTotal)}
          </td>
          <td className="px-3 py-2 whitespace-no-wrap font-semibold text-slate-700">
            {USDollar.format(weeklyFigureTotal - adjustmentsTotal)}
          </td>
        </tr>
      </tbody>
    )}
  })
  elements.push(
    <tr>
      <td colSpan={12} className="bg-slate-400 hover:bg-slate-500 text-slate-100 rounded-b">
        <AddAccount baseUrl={props.baseUrl} user={props.currentUser} setRefreshKey={props.setRefreshKey} />
      </td>
    </tr>
  )
  return elements;
};

const AgentsAccountsTable = (props: {baseUrl: string, currentUser: User|undefined, selectedStartOfWeek: Date, groupedAccounts: UserAccounts[], isLoading: boolean, setRefreshKey: any}) => {
  let groupedAccounts = props.groupedAccounts;

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  const handleDrop = (result: any) => {
    const username = result.destination.droppableId.replace("droppable", "");
    const userObj = groupedAccounts.find((user) => user.username === username);
    const user = userObj!.accounts[0].user;
    if (!result.destination) {
      return;
    }
    const items = reorder(
      userObj!.accounts,
      result.source.index,
      result.destination.index
    );
    const accountIdsOrder = items.map((account) => account.id);
    fetch(props.baseUrl + "/api/user/edit", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        userData: {
          name: user.name,
          username: user.username,
          risk: user.risk_percentage,
          gabeWay: user.gabe_way,
          order: accountIdsOrder,
        },
      })
    })
    groupedAccounts = groupedAccounts.map((user) => {
      if (user.username === username) {
        user.accounts = items;
        return user;
      }
      return user;
    });
  };

  return (
    <div className="flex 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
      <DragDropContext onDragEnd={handleDrop}>
        <table className="table-auto min-w-full">
          <thead className="text-slate-100">
            <tr>
              <th colSpan={9} className="mx-auto px-3 py-3 bg-slate-700 text-md font-bold uppercase tracking-wider text-left md:text-center border-b-2 border-slate-500 rounded-tl">
                Accounts ({props.currentUser?.username} - {props.currentUser?.risk_percentage}% Risk)
              </th>
              <th rowSpan={2} className="mx-auto px-3 py-3 bg-slate-800 text-md font-bold uppercase tracking-wider text-center">
                Weekly Figure
              </th>
              <th rowSpan={2} className="px-3 py-3 bg-slate-800 text-md font-bold uppercase tracking-wider text-center border-l-2 border-slate-700">
                Adjustments
              </th>
              <th rowSpan={2} className="px-3 py-3 bg-slate-800 text-md font-bold uppercase tracking-wider text-center border-l-2 border-slate-700 rounded-tr">
                Balance
              </th>
            </tr>
            <tr>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                #
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                Website
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                Bookie
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                Referral
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                Username
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                Password
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                Credit Line
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-xs font-bold uppercase tracking-wider">
                Max Win
              </th>
            </tr>
          </thead>
          {props.isLoading ? (
            <tbody>
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
            </tbody>
          ) : (
            <DraggableTableRows baseUrl={props.baseUrl} currentUser={props.currentUser} selectedStartOfWeek={props.selectedStartOfWeek} groupedAccounts={groupedAccounts} setRefreshKey={props.setRefreshKey} />
          )}
        </table>
      </DragDropContext>
    </div>
  )
}

export default AgentsAccountsTable