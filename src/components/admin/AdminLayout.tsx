import { useState } from "react";
import WeekSelector from "../WeekSelector"
import AccountsTable from "./AccountsTable"
import AgentsTable from "./AgentsTable"

const AdminLayout = (props: {accountList: any[], agentList: any[], setSelectedStartOfWeek: any,}) => {
  const [adminTab, setAdminTab] = useState<string>("accounts");

  return (
    <div>
      <div className="flex flex-col content-center px-2 mb-5 text-gray-100">
        <div className="flex flex-row justify-center mb-3">
          <button className={`mr-2 px-3 text-2xl uppercase ${adminTab === "accounts" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("accounts")}>
            Accounts
          </button>
          <button className={`px-3 text-2xl uppercase ${adminTab === "agents" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("agents")}>
            Agents
          </button>
          <button className={`px-3 text-2xl uppercase ${adminTab === "transactions" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("transactions")}>
            Transactions
          </button>
        </div>
        {adminTab === "accounts" && <WeekSelector setSelectedStartOfWeek={props.setSelectedStartOfWeek} />}
      </div>
      {adminTab === "accounts" && <AccountsTable accountList={props.accountList} setSelectedStartOfWeek={props.setSelectedStartOfWeek} />}
      {adminTab === "agents" && <AgentsTable agentList={props.agentList} />}
      {adminTab === "transactions" && <AccountsTable accountList={props.accountList} setSelectedStartOfWeek={props.setSelectedStartOfWeek} />}
    </div>
  )
}

export default AdminLayout