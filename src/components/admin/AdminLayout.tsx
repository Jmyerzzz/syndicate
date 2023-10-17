import { useEffect, useState } from "react";
import WeekSelector from "../WeekSelector"
import AccountsTable from "./AccountsTable"
import AgentsTable from "./AgentsTable"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";
import TransactionsTable from "../TransactionsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faBook, faRightFromBracket, faSackDollar, faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import RunnersTable from "./RunnersTable";

const AdminLayout = (props: {baseUrl: string, user: User|undefined}) => {
  const router = useRouter();
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [adminTab, setAdminTab] = useState<string>("accounts");
  const [agentsCount, setAgentsCount] = useState<number>(0);

  const logOut = async () => {
    await fetch(props.baseUrl + "/api/logout", {
      method: "POST"
    })
      .then(() => router.refresh())
  }

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
      <div className="flex flex-row justify-between items-center">
        <div className="flex justify-start w-1/6 animate-flicker-text text-4xl font-akira-sb text-white tracking-wide uppercase">
          WAGERS
        </div>
        <div className="flex flex-row w-2/3 items-center justify-center text-gray-100">
          <button className={`flex flex-row items-center mb-3 sm:mb-0 px-3 text-2xl uppercase ${adminTab === "accounts" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("accounts")}>
            <FontAwesomeIcon icon={faSackDollar} width={20} className="mr-2" />
            <div>
              Weekly Figures
            </div>
          </button>
          <button className={`flex flex-row items-center mb-3 sm:mb-0 ml-5 px-3 text-2xl uppercase ${adminTab === "runners" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("runners")}>
            <FontAwesomeIcon icon={faArrowsRotate} width={20} className="mr-2" />
            <div>
              Runners
            </div>
          </button>
          <button className={`flex flex-row items-center mb-3 sm:mb-0 mx-5 px-3 text-2xl uppercase ${adminTab === "agents" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("agents")}>
            <FontAwesomeIcon icon={faUser} width={20} className="mr-2" />
            <div>
              Agents ({agentsCount})
            </div>
          </button>
          <button className={`flex flex-row items-center px-3 text-2xl uppercase ${adminTab === "transactions" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => setAdminTab("transactions")}>
            <FontAwesomeIcon icon={faBook} width={20} className="mr-2" />
            <div>
              Transactions
            </div>
          </button>
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
      {(adminTab === "accounts" || adminTab === "transactions" || adminTab === "runners") && <WeekSelector setSelectedStartOfWeek={setSelectedStartOfWeek} />}
      {adminTab === "accounts" && <AccountsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} />}
      {adminTab === "runners" && <RunnersTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} />}
      {adminTab === "agents" && <AgentsTable baseUrl={props.baseUrl} />}
      {adminTab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} />}
    </div>
  )
}

export default AdminLayout