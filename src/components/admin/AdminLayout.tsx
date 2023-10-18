import { useState } from "react";
import WeekSelector from "../WeekSelector"
import AccountsTable from "./AccountsTable"
import AgentsTable from "./AgentsTable"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";
import TransactionsTable from "../TransactionsTable";
import RunnersTable from "./RunnersTable";
import NavBar from "../NavBar";

const AdminLayout = (props: {baseUrl: string, user: User|undefined}) => {
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tab, setTab] = useState<string>("accounts");

  return (
    <div className="mb-6 sm:px-5">
      <NavBar baseUrl={props.baseUrl} user={props.user} tab={tab} setTab={setTab} />
      {(tab === "accounts" || tab === "transactions" || tab === "runners") && <WeekSelector setSelectedStartOfWeek={setSelectedStartOfWeek} />}
      {tab === "accounts" && <AccountsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} />}
      {tab === "runners" && <RunnersTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} />}
      {tab === "agents" && <AgentsTable baseUrl={props.baseUrl} />}
      {tab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} />}
    </div>
  )
}

export default AdminLayout