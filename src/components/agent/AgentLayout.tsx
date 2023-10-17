import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeekSelector from "../WeekSelector"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";
import TransactionsTable from "../TransactionsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faRightFromBracket, faSackDollar, faUser } from "@fortawesome/free-solid-svg-icons";
import AgentsAccountsTable from "./AgentAccountsTable";

const AgentLayout = (props: {baseUrl: string, user: User|undefined}) => {
  const router = useRouter();
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tab, setTab] = useState<string>("accounts");

  const logOut = async () => {
    await fetch(props.baseUrl + "/api/logout", {
      method: "POST"
    })
      .then(() => router.refresh())
  }

  return (
    <div className="mb-6 sm:px-5">
      <div className="flex flex-row justify-between items-center">
        <div className="flex justify-start w-1/6 animate-flicker-text text-4xl font-akira-sb text-white tracking-wide uppercase">
          Syndicate
        </div>
        <div className="flex flex-col w-2/3 content-center mb-3 text-gray-100">
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
        <div className="flex justify-end w-1/6">
          <button onClick={() => logOut()} className="flex flex-row items-center px-2 text-gray-100">
            Log Out
            <div>
              <FontAwesomeIcon icon={faRightFromBracket} className="ml-2" />
            </div>
          </button>
        </div>
      </div>
      {tab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} currentUser={props.user} />}
      {tab === "accounts" && <AgentsAccountsTable baseUrl={props.baseUrl} currentUser={props.user} selectedStartOfWeek={selectedStartOfWeek} />}
    </div>
  )
}

export default AgentLayout