import { useEffect, useState } from "react";
import WeekSelector from "../WeekSelector"
import AccountsTable from "./AccountsTable"
import AgentsTable from "./AgentsTable"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";
import TransactionsTable from "../TransactionsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faSackDollar, faUser } from "@fortawesome/free-solid-svg-icons";

const AdminLayout = (props: {baseUrl: string, user: User|undefined}) => {
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [adminTab, setAdminTab] = useState<string>("accounts");
  const [agentsCount, setAgentsCount] = useState<number>(0);

  useEffect(() => {
    fetch(props.baseUrl + "/api/agents/count", {
        method: "GET"
      })
      .then((response) => response.json())
      .then((data) => {
        setAgentsCount(data);
      })
  },[])

  return (
    <div className="mb-6 sm:px-5">
      <div className="flex flex-col content-center mb-3 text-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-3">
          <button className={`flex flex-row items-center mb-3 sm:mb-0 px-3 text-2xl uppercase ${adminTab === "accounts" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("accounts")}>
            <FontAwesomeIcon icon={faSackDollar} width={20} className="mr-2" />
            <div>
              Weekly Figures
            </div>
          </button>
          <button className={`flex flex-row items-center mb-3 sm:mb-0 mx-5 px-3 text-2xl uppercase ${adminTab === "agents" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("agents")}>
            <FontAwesomeIcon icon={faUser} width={20} className="mr-2" />
            <div>
              Agents ({agentsCount})
            </div>
          </button>
          <button className={`flex flex-row items-center px-3 text-2xl uppercase ${adminTab === "transactions" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("transactions")}>
            <FontAwesomeIcon icon={faArrowsRotate} width={20} className="mr-2" />
            <div>
              Transactions
            </div>
          </button>
        </div>
        {(adminTab === "accounts" || adminTab === "transactions") && <WeekSelector setSelectedStartOfWeek={setSelectedStartOfWeek} />}
      </div>
      {adminTab === "accounts" && <AccountsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} />}
      {adminTab === "agents" && <AgentsTable baseUrl={props.baseUrl} />}
      {adminTab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} />}
    </div>
  )
}

export default AdminLayout