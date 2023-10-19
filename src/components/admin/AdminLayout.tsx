import { useEffect, useState } from "react";
import WeekSelector from "../WeekSelector"
import AccountsTable from "./AccountsTable"
import AgentsTable from "./AgentsTable"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";
import TransactionsTable from "../TransactionsTable";
import RunnersTable from "./RunnersTable";
import NavBar from "../NavBar";
import { UserAccounts } from "@/types/types";
import { groupAccountsByUser } from "@/util/util";
import BookiesTable from "./BookiesTable";

const AdminLayout = (props: {baseUrl: string, user: User|undefined, isAdmin: boolean}) => {
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tab, setTab] = useState<string>("accounts");
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [agentList, setAgentList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);


  useEffect(() => {
    setIsLoading(true)
    fetch(props.baseUrl + "/api/accounts/all", {
        method: "POST",
        body: JSON.stringify(selectedStartOfWeek)
    })
      .then((response) => response.json())
      .then((data) => {
        setGroupedAccounts(groupAccountsByUser(data))
        setIsLoading(false)
      })
  },[selectedStartOfWeek, refreshKey])

  useEffect(() => {
    setIsLoading(true)
    fetch(props.baseUrl + "/api/agents/all", {
        method: "GET"
      })
      .then((response) => response.json())
      .then((data) => {
        setAgentList(data);
        setIsLoading(false)
      })
  },[refreshKey])

  return (
    <div className="mb-6 sm:px-5">
      <NavBar baseUrl={props.baseUrl} isAdmin={props.isAdmin} tab={tab} setTab={setTab} />
      {(tab === "accounts" || tab === "transactions" || tab === "runners") && <WeekSelector selectedStartOfWeek={selectedStartOfWeek} setSelectedStartOfWeek={setSelectedStartOfWeek} />}
      {tab === "accounts" && <AccountsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} groupedAccounts={groupedAccounts} isLoading={isLoading} setRefreshKey={setRefreshKey} />}
      {tab === "runners" && <RunnersTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} groupedAccounts={groupedAccounts} isLoading={isLoading} />}
      {tab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} groupedAccounts={groupedAccounts} isLoading={isLoading} />}
      {tab === "bookies" && <BookiesTable groupedAccounts={groupedAccounts} isLoading={isLoading} />}
      {tab === "agents" && <AgentsTable baseUrl={props.baseUrl} agentList={agentList} isLoading={isLoading} setRefreshKey={setRefreshKey} />}
    </div>
  )
}

export default AdminLayout