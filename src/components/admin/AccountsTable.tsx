import React, { useCallback, useState } from "react";
import { Oval } from "react-loader-spinner";
import AddWeeklyFigure from "../AddWeeklyFigure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserAccounts, USDollar } from "@/types/types";
import {
  faCheck,
  faChevronDown,
  faChevronRight,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import EditAccount from "../EditAccount";
import EditWeeklyFigure from "../EditWeeklyFigure";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Tooltip } from "@material-tailwind/react";

const DraggableTableRows = (props: {
  baseUrl: string;
  selectedStartOfWeek: Date;
  groupedAccounts: UserAccounts[];
  setWeeklyTotal: any;
  setTotalCollected: any;
  setRefreshKey: any;
}) => {
  let weeklyTotal = 0,
    totalCollected = 0;
  const elements: JSX.Element[] = [];
  let groupedAccounts = props.groupedAccounts;
  const [collapsedRows, setCollapsedRows] = useState<number[]>([]);
  const [cellUpdating, setCellUpdating] = useState<boolean>(false);

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

  const markStiffed = useCallback(
    (weeklyFigureId: string, stiffed: boolean) => {
      setCellUpdating(true);
      fetch("/api/figure/stiff", {
        method: "POST",
        body: JSON.stringify({
          weeklyFigureId: weeklyFigureId,
          stiffed: stiffed,
        }),
      }).then(() =>
        setTimeout(() => {
          setCellUpdating(false);
        }, 1200)
      );

      setTimeout(() => {
        props.setRefreshKey((oldKey: number) => oldKey + 1);
      }, 1000);
    },
    [props]
  );

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    background: isDragging && "#e9d5ff",

    display: isDragging && "table",

    ...draggableStyle,
  });

  groupedAccounts.forEach((user, index0) => {
    let weeklyFigureTotal = 0,
      adjustmentsTotal = 0;
    elements.push(
      <tbody>
        <tr key={user.username} onClick={() => handleRowClick(index0)}>
          <td
            colSpan={12}
            className="px-3 bg-zinc-400 text-white text-lg font-medium hover:cursor-pointer"
          >
            {!collapsedRows.includes(index0) ? (
              <FontAwesomeIcon
                icon={faChevronDown}
                className="mr-3"
                width={20}
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-3"
                width={20}
              />
            )}
            {user.name} - {user.risk}%
          </td>
        </tr>
      </tbody>
    );

    user.accounts.map((account) => {
      let weeklyFigureAmount: number = 0;
      if (account.weeklyFigures.length > 0) {
        weeklyFigureAmount = account.weeklyFigures[0].amount;
        weeklyFigureTotal += account.weeklyFigures[0].amount;
      }
      weeklyTotal += weeklyFigureAmount;
      let adjustmentsSum = 0;
      if (
        account.weeklyFigures[0] &&
        account.weeklyFigures[0].adjustments.length > 0
      ) {
        account.weeklyFigures[0].adjustments.map((adjustment) => {
          adjustmentsSum += adjustment.amount;
        });
        adjustmentsTotal += adjustmentsSum;
      }
      totalCollected += adjustmentsSum;
    });

    !collapsedRows.includes(index0) &&
      elements.push(
        <Droppable
          key={user.username + "droppable"}
          droppableId={user.username + "droppable"}
        >
          {(provided) => (
            <tbody
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="text-zinc-700"
            >
              {user.accounts.map((account, index1) => {
                let weeklyFigureAmount: number = 0,
                  adjustmentsSum: number = 0;
                if (account.weeklyFigures.length > 0) {
                  weeklyFigureAmount = account.weeklyFigures[0].amount;
                }
                if (
                  account.weeklyFigures[0] &&
                  account.weeklyFigures[0].adjustments.length > 0
                ) {
                  account.weeklyFigures[0].adjustments.map((adjustment) => {
                    adjustmentsSum += adjustment.amount;
                  });
                }
                const stiffed =
                  account.weeklyFigures[0] && account.weeklyFigures[0].stiffed;
                return (
                  <Draggable
                    key={account.id + "draggable"}
                    draggableId={account.id.toString()}
                    index={index1}
                  >
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={account.id}
                        className={`
                        text-zinc-700
                        hover:bg-purple-200
                          ${cellUpdating && "cursor-progress"}
                          ${
                            stiffed
                              ? "bg-red-200"
                              : account.weeklyFigures[0] &&
                                account.weeklyFigures[0].amount !== 0 &&
                                weeklyFigureAmount === adjustmentsSum
                              ? "bg-green-200"
                              : "even:bg-white odd:bg-zinc-100"
                          }
                        `}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <td className="td-base w-1/24">{index1 + 1}</td>
                        <td className="td-base group w-3/24">
                          <div className="flex flex-row items-center">
                            {account.website}
                            <EditAccount
                              baseUrl={props.baseUrl}
                              account={account}
                              setRefreshKey={props.setRefreshKey}
                            />
                          </div>
                        </td>
                        <td className="td-base w-3/24">{account.bookie}</td>
                        <td className="td-base w-3/24">{account.referral}</td>
                        <td className="td-base w-1/12">{account.username}</td>
                        <td className="td-base w-1/12">{account.password}</td>
                        <td className="td-base w-1/12">
                          {account.ip_location}
                        </td>
                        <td className="td-base w-1/24">
                          ${account.credit_line.toLocaleString()}
                        </td>
                        <td className="td-base w-1/24">
                          ${account.max_win.toLocaleString()}
                        </td>
                        <td className="td-base w-1/12 font-medium border-l-2 border-zinc-200">
                          <div className="flex flex-row justify-between items-center">
                            {USDollar.format(weeklyFigureAmount)}
                            {account.weeklyFigures[0] ? (
                              <EditWeeklyFigure
                                baseUrl={props.baseUrl}
                                account={account}
                                weeklyFigure={account.weeklyFigures[0]}
                                selectedStartOfWeek={props.selectedStartOfWeek}
                                setRefreshKey={props.setRefreshKey}
                                setCellUpdating={setCellUpdating}
                              />
                            ) : (
                              <AddWeeklyFigure
                                baseUrl={props.baseUrl}
                                account={account}
                                selectedStartOfWeek={props.selectedStartOfWeek}
                                setRefreshKey={props.setRefreshKey}
                                setCellUpdating={setCellUpdating}
                              />
                            )}
                          </div>
                        </td>
                        <td className="td-base group w-1/12 font-medium border-l-2 border-zinc-200">
                          <div
                            className={`flex flex-row justify-left items-center ${
                              account.weeklyFigures[0] &&
                              "group-hover:justify-between"
                            } ${
                              adjustmentsSum > 0
                                ? "text-green-500"
                                : adjustmentsSum < 0
                                ? "text-red-500"
                                : "text-zinc-700"
                            }`}
                          >
                            {USDollar.format(adjustmentsSum)}
                            {account.weeklyFigures[0] && (
                              <button
                                type="button"
                                id={`tooltip-${account.id}`}
                                disabled={account.weeklyFigures.length === 0}
                                onClick={() =>
                                  markStiffed(
                                    account.weeklyFigures[0].id,
                                    !account.weeklyFigures[0].stiffed
                                  )
                                }
                                className="invisible group-hover:visible transition ease-in-out opacity-0 group-hover:opacity-100 duration-400 text-zinc-500 rounded"
                              >
                                <Tooltip
                                  placement="right"
                                  content={stiffed ? "UNSTIFF" : "STIFF"}
                                  className={`text-gray-700 font-medium ${
                                    stiffed
                                      ? "bg-green-400/40"
                                      : "bg-red-400/40"
                                  } backdrop-blur-md shadow-xl shadow-black/30`}
                                >
                                  {stiffed ? (
                                    <FontAwesomeIcon icon={faCheck} />
                                  ) : (
                                    <FontAwesomeIcon icon={faX} />
                                  )}
                                </Tooltip>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="td-base w-1/24 font-medium border-l-2 border-zinc-200">
                          {USDollar.format(weeklyFigureAmount - adjustmentsSum)}
                        </td>
                      </tr>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      );
    !collapsedRows.includes(index0) && (
      <React.Fragment key={user.username + "totals-frag"}>
        {elements.push(
          <tbody>
            <tr key={user.username + "totals"} className="bg-white">
              <td colSpan={9} className="px-3 py-2 text-right">
                Totals:
              </td>
              <td className="td-base font-semibold text-zinc-700">
                {USDollar.format(weeklyFigureTotal)}
              </td>
              <td className="td-base font-semibold text-zinc-700">
                {USDollar.format(adjustmentsTotal)}
              </td>
              <td className="td-base font-semibold text-zinc-700">
                {USDollar.format(weeklyFigureTotal - adjustmentsTotal)}
              </td>
            </tr>
            <tr key={user.username + "synd_totals"} className="bg-white">
              <td
                colSpan={9}
                className={`px-3 py-2 text-right ${
                  index0 === groupedAccounts.length - 1 && "rounded-bl"
                }`}
              >
                Syndicate Way:
              </td>
              <td
                colSpan={3}
                className={`td-base font-semibold text-zinc-700 ${
                  index0 === groupedAccounts.length - 1 && "rounded-br"
                }`}
              >
                {USDollar.format(weeklyFigureTotal * ((100 - user.risk) / 100))}
              </td>
            </tr>
          </tbody>
        )}
      </React.Fragment>
    );
  });
  props.setWeeklyTotal(weeklyTotal);
  props.setTotalCollected(totalCollected);
  return elements;
};

const AccountsTable = (props: {
  baseUrl: string;
  selectedStartOfWeek: Date;
  groupedAccounts: UserAccounts[];
  setWeeklyTotal: any;
  setTotalCollected: any;
  isLoading: boolean;
  setRefreshKey: any;
}) => {
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
      }),
    });
    groupedAccounts = groupedAccounts.map((user) => {
      if (user.username === username) {
        user.accounts = items;
        return user;
      }
      return user;
    });
  };

  return (
    <div className="flex flex-col 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
      <DragDropContext onDragEnd={handleDrop}>
        <table className="table-auto min-w-full">
          <thead className="text-zinc-100">
            <tr>
              <th
                colSpan={9}
                className="py-3 bg-zinc-600 text-md font-bold uppercase tracking-wider text-left md:text-center border-b-2 border-zinc-500 rounded-tl"
              >
                Accounts
              </th>
              <th
                rowSpan={2}
                className="px-2 py-3 bg-zinc-700 text-xs font-bold uppercase tracking-wider text-center"
              >
                Weekly Figure
              </th>
              <th
                rowSpan={2}
                className="px-2 py-3 bg-zinc-700 text-xs font-bold uppercase tracking-wider text-center border-l-2 border-zinc-600"
              >
                Adjustments
              </th>
              <th
                rowSpan={2}
                className="px-2 py-3 bg-zinc-700 text-xs font-bold uppercase tracking-wider text-center border-l-2 border-zinc-600 rounded-tr"
              >
                Balance
              </th>
            </tr>
            <tr>
              <th className="th-base">#</th>
              <th className="th-base">Website</th>
              <th className="th-base">Bookie</th>
              <th className="th-base">Referral</th>
              <th className="th-base">Username</th>
              <th className="th-base">Password</th>
              <th className="th-base">IP Address</th>
              <th className="th-base">Credit Line</th>
              <th className="th-base">Max Win</th>
            </tr>
          </thead>
          {props.isLoading ? (
            <tbody>
              <tr>
                <td
                  colSpan={12}
                  className="mx-auto py-3 text-center bg-[17, 23, 41]"
                >
                  <Oval
                    height={60}
                    width={60}
                    color="#4287f5"
                    wrapperStyle={{ display: "flex", justifyContent: "center" }}
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4d64ab"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </td>
              </tr>
            </tbody>
          ) : (
            <DraggableTableRows
              baseUrl={props.baseUrl}
              selectedStartOfWeek={props.selectedStartOfWeek}
              groupedAccounts={groupedAccounts}
              setWeeklyTotal={props.setWeeklyTotal}
              setTotalCollected={props.setTotalCollected}
              setRefreshKey={props.setRefreshKey}
            />
          )}
        </table>
      </DragDropContext>
    </div>
  );
};

export default AccountsTable;
