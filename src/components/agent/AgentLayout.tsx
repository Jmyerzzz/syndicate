import { useMemo, useState } from "react";
import WeekSelector from "../WeekSelector"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";
import TransactionsTable from "../TransactionsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faSackDollar, faUser } from "@fortawesome/free-solid-svg-icons";
import AgentsAccountsTable from "./AgentAccountsTable";

const AgentLayout = (props: {baseUrl: string, user: User|undefined}) => {
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tab, setTab] = useState<string>("accounts");
  const [agentsCount, setAgentsCount] = useState<number>(0);

  useMemo(() => {
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
          <button className={`flex flex-row items-center mb-3 sm:mb-0 px-3 text-2xl uppercase ${tab === "accounts" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setTab("accounts")}>
            <FontAwesomeIcon icon={faSackDollar} width={20} className="mr-2" />
            <div>
              Weekly Figures
            </div>
          </button>
          <button className={`flex flex-row items-center px-3 text-2xl uppercase ${tab === "transactions" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setTab("transactions")}>
            <FontAwesomeIcon icon={faArrowsRotate} width={20} className="mr-2" />
            <div>
              Transactions
            </div>
          </button>
        </div>
        <WeekSelector setSelectedStartOfWeek={setSelectedStartOfWeek} />
      </div>
      {tab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} currentUser={props.user} />}
      {tab === "accounts" && <AgentsAccountsTable baseUrl={props.baseUrl} currentUser={props.user} selectedStartOfWeek={selectedStartOfWeek} />}
    </div>
  )
}

export default AgentLayout