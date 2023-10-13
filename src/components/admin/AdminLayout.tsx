import { useMemo, useState } from "react";
import WeekSelector from "../WeekSelector"
import AccountsTable from "./AccountsTable"
import AgentsTable from "./AgentsTable"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";

const AdminLayout = (props: {baseUrl: string, user: User|undefined}) => {
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [adminTab, setAdminTab] = useState<string>("accounts");

  return (
    <div className="mb-6 px-20">
      <div className="flex flex-col content-center text-gray-100">
        <div className="flex flex-row justify-center mb-3">
          <button className={`mr-2 px-3 text-2xl uppercase ${adminTab === "accounts" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("accounts")}>
            Weekly Figures
          </button>
          <button className={`px-3 text-2xl uppercase ${adminTab === "agents" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("agents")}>
            Agents
          </button>
          <button className={`px-3 text-2xl uppercase ${adminTab === "transactions" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("transactions")}>
            Transactions
          </button>
        </div>
        {adminTab === "accounts" && <WeekSelector setSelectedStartOfWeek={setSelectedStartOfWeek} />}
      </div>
      {adminTab === "accounts" && <AccountsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} setSelectedStartOfWeek={setSelectedStartOfWeek} />}
      {adminTab === "agents" && <AgentsTable baseUrl={props.baseUrl} />}
      {/* {adminTab === "transactions" && <TransactionsTable  />} */}
    </div>
  )
}

export default AdminLayout