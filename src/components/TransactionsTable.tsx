import { useCallback, useState } from "react";
import { Oval } from "react-loader-spinner";
import { USDollar, UserAccounts, dateTimeFormat } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const TableRows = (props: { groupedAccounts: UserAccounts[] }) => {
  const [collapsedRows, setCollapsedRows] = useState<number[]>([]);

  const handleRowClick = useCallback(
    (index: number) => {
      const currentIndex = collapsedRows.indexOf(index);
      const newCollapsedRows = [...collapsedRows];
      if (currentIndex === -1) {
        newCollapsedRows.push(index);
      } else {
        newCollapsedRows.splice(currentIndex, 1);
      }
      setCollapsedRows(newCollapsedRows);
    },
    [collapsedRows]
  );

  return (
    <>
      {props.groupedAccounts?.map((user, index) => {
        const elements: React.ReactElement[] = [];
        elements.push(
          <tr key={"user" + index} onClick={() => handleRowClick(index)}>
            <td
              colSpan={6}
              className="px-3 bg-zinc-500 text-zinc-100 text-lg font-medium hover:cursor-pointer"
            >
              {!collapsedRows.includes(index) ? (
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
              {user.name}
            </td>
          </tr>
        );
        user.accounts.map((account: any, index0: number) => {
          account.weeklyFigures.map((figure: any, index1: number) => {
            !collapsedRows.includes(index) &&
              figure.amount !== 0 &&
              elements.push(
                <tr key={figure.id} className="bg-zinc-200">
                  <td
                    className={`td-base text-zinc-500 ${
                      (index1 === account.weeklyFigures.length - 1 ||
                        figure.adjustments.length === 0) &&
                      index0 === user.accounts.length - 1 &&
                      figure.adjustments.length === 0 &&
                      "rounded-bl"
                    }`}
                  >
                    FIGURE
                  </td>
                  <td className="td-base">{account.username}</td>
                  <td className="td-base">{account.website}</td>
                  <td className="td-base">
                    {dateTimeFormat.format(new Date(figure.transaction_date))}
                  </td>
                  <td
                    className={`td-base ${
                      figure.amount > 0
                        ? "text-green-500"
                        : figure.amount < 0
                        ? "text-red-500"
                        : "text-zinc-700"
                    }`}
                  >
                    {USDollar.format(figure.amount)}
                  </td>
                  <td
                    className={`td-base text-zinc-500 ${
                      (index1 === account.weeklyFigures.length - 1 ||
                        figure.adjustments.length === 0) &&
                      index0 === user.accounts.length - 1 &&
                      figure.adjustments.length === 0 &&
                      "rounded-br"
                    }`}
                  ></td>
                </tr>
              );
            figure.adjustments.map((adjustment: any, index2: number) => {
              !collapsedRows.includes(index) &&
                elements.push(
                  <tr key={adjustment.id} className="bg-white">
                    <td
                      className={`td-base text-zinc-500 ${
                        index2 === figure.adjustments.length - 1 &&
                        index0 === user.accounts.length - 1 &&
                        "rounded-bl"
                      }`}
                    >
                      ADJUSTMENT
                    </td>
                    <td className="td-base">{user.username}</td>
                    <td className="td-base">{account.website}</td>
                    <td className="td-base">
                      {dateTimeFormat.format(
                        new Date(adjustment.transaction_date)
                      )}
                    </td>
                    <td
                      className={`td-base ${
                        adjustment.amount > 0
                          ? "text-green-500"
                          : adjustment.amount < 0
                          ? "text-red-500"
                          : "text-zinc-700"
                      }`}
                    >
                      {USDollar.format(adjustment.amount)}
                    </td>
                    <td
                      className={`td-base text-zinc-500 ${
                        index2 === figure.adjustments.length - 1 &&
                        index0 === user.accounts.length - 1 &&
                        "rounded-br"
                      }`}
                    >
                      {adjustment.zero_out ? "ZEROED" : ""}
                    </td>
                  </tr>
                );
            });
          });
        });
        return elements;
      })}
    </>
  );
};

const TransactionsTable = (props: {
  groupedAccounts: UserAccounts[];
  isLoading: boolean;
}) => {
  return (
    <div className="flex flex-col 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
      <table className="table-auto min-w-full">
        <thead className="text-zinc-100">
          <tr>
            <th className="px-3 py-3 bg-zinc-700 text-left text-sm font-bold uppercase tracking-wider rounded-tl">
              Type
            </th>
            <th className="px-3 py-3 bg-zinc-700 text-left text-sm font-bold uppercase tracking-wider">
              Username
            </th>
            <th className="px-3 py-3 bg-zinc-700 text-left text-sm font-bold uppercase tracking-wider">
              Website
            </th>
            <th className="px-3 py-3 bg-zinc-700 text-left text-sm font-bold uppercase tracking-wider">
              Date
            </th>
            <th className="px-3 py-3 bg-zinc-700 text-left text-sm font-bold uppercase tracking-wider">
              Amount
            </th>
            <th className="px-3 py-3 bg-zinc-700 text-left text-sm font-bold uppercase tracking-wider rounded-tr">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="text-zinc-700">
          {props.isLoading ? (
            <tr>
              <td
                colSpan={6}
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
          ) : (
            <TableRows groupedAccounts={props.groupedAccounts} />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
