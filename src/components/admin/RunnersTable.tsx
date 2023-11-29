import { Oval } from "react-loader-spinner";
import { UserAccounts, USDollar } from "@/types/types";
import React from "react";

const TableRows = (props: { groupedAccounts: UserAccounts[] }) => {
  let weeklyTotal = 0,
    totalCollected = 0,
    agentsTotal = 0,
    gTotal = 0,
    tTotal = 0;
  const elements: React.ReactElement[] = [];

  props.groupedAccounts.forEach((user, index0) => {
    let weeklyFigureTotal = 0;
    let adjustmentsTotal = 0;

    user.accounts.forEach((account) => {
      if (account.weeklyFigures.length > 0) {
        weeklyFigureTotal += account.weeklyFigures[0].amount;
        weeklyTotal += account.weeklyFigures[0].amount;
      }

      let adjustmentsSum = 0;
      if (
        account.weeklyFigures[0] &&
        account.weeklyFigures[0].adjustments.length > 0
      ) {
        account.weeklyFigures[0].adjustments.forEach((adjustment) => {
          adjustmentsSum += adjustment.amount;
        });
        adjustmentsTotal += adjustmentsSum;
        totalCollected += adjustmentsSum;
      }
    });

    const gWay =
      user.username !== "gabrieladzich"
        ? (user.gabe_way! / 100) * weeklyFigureTotal
        : (user.risk / 100) * weeklyFigureTotal;
    const tWay = ((100 - user.risk - user.gabe_way!) / 100) * weeklyFigureTotal;

    agentsTotal += (user.risk / 100) * weeklyFigureTotal;
    gTotal += gWay;
    tTotal += tWay;

    elements.push(
      <tr
        key={user.username + "weekly_totals"}
        className={`${
          weeklyFigureTotal !== adjustmentsTotal
            ? "bg-red-200"
            : weeklyFigureTotal !== adjustmentsTotal
            ? "bg-green-200"
            : "even:bg-white odd:bg-zinc-100"
        }`}
      >
        <td className="td-base text-zinc-700">{index0 + 1}</td>
        <td className="td-base text-zinc-700">{user.accounts[0].user.name}</td>
        <td className="td-base text-zinc-700">
          {user.accounts[0].user.username}
        </td>
        <td className="td-base text-zinc-700">
          {USDollar.format(weeklyFigureTotal)}
        </td>
        <td className="td-base text-zinc-700">
          {USDollar.format(adjustmentsTotal)}
        </td>
        <td className="td-base text-zinc-700 font-medium">
          {USDollar.format((user.risk / 100) * weeklyFigureTotal)}
        </td>
        <td className="td-base text-zinc-700 font-medium">
          {USDollar.format(gWay)}
        </td>
        <td className="td-base text-zinc-700 font-medium">
          {USDollar.format(tWay)}
        </td>
      </tr>
    );
  });
  elements.push(
    <tr key={"weekly_totals"} className="bg-white">
      <td colSpan={3} className="px-3 py-2 text-right rounded-bl">
        Totals:
      </td>
      <td className="td-base font-semibold text-zinc-700">
        {USDollar.format(weeklyTotal)}
      </td>
      <td className="td-base font-semibold text-zinc-700">
        {USDollar.format(totalCollected)}
      </td>
      <td className="td-base font-semibold text-zinc-700">
        {USDollar.format(agentsTotal)}
      </td>
      <td className="td-base font-semibold text-zinc-700">
        {USDollar.format(gTotal)}
      </td>
      <td className="td-base font-semibold text-zinc-700 rounded-br">
        {USDollar.format(tTotal)}
      </td>
    </tr>
  );
  return (
    <>
      {elements.map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </>
  );
};

const RunnersTable = (props: {
  groupedAccounts: UserAccounts[];
  isLoading: boolean;
}) => {
  return (
    <div className="flex flex-col 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
      <table className="table-auto min-w-full">
        <thead className="text-zinc-100">
          <tr>
            <th className="th-base rounded-tl">#</th>
            <th className="th-base">Name</th>
            <th className="th-base">Username</th>
            <th className="th-base">Weekly Figure Total</th>
            <th className="th-base">Adjustments Total</th>
            <th className="th-base">Agent Way</th>
            <th className="th-base">Gabe Way</th>
            <th className="th-base rounded-tr">T Way</th>
          </tr>
        </thead>
        <tbody className="text-zinc-700">
          {props.isLoading ? (
            <tr>
              <td
                colSpan={8}
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

export default RunnersTable;
