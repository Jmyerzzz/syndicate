import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeekSelector from "../WeekSelector"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";
import TransactionsTable from "../TransactionsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faBook, faRightFromBracket, faSackDollar, faUser } from "@fortawesome/free-solid-svg-icons";
import AgentsAccountsTable from "./AgentAccountsTable";
import NavBar from "../NavBar";

const AgentLayout = (props: {baseUrl: string, user: User|undefined, isAdmin: boolean}) => {
  const router = useRouter();
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tab, setTab] = useState<string>("accounts");

  return (
    <div className="mb-6 md:px-5">
      <NavBar baseUrl={props.baseUrl} isAdmin={props.isAdmin} tab={tab} setTab={setTab} />
      <WeekSelector setSelectedStartOfWeek={setSelectedStartOfWeek} />
      {tab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} currentUser={props.user} />}
      {tab === "accounts" && <AgentsAccountsTable baseUrl={props.baseUrl} currentUser={props.user} selectedStartOfWeek={selectedStartOfWeek} />}
    </div>
  )
}

export default AgentLayout