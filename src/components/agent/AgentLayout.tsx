import { useEffect, useState } from "react";
import WeekSelector from "../WeekSelector"
import { startOfWeek } from "date-fns";
import { User } from "@prisma/client";
import TransactionsTable from "../TransactionsTable";
import AgentsAccountsTable from "./AgentAccountsTable";
import NavBar from "../NavBar";
import { UserAccounts } from "@/types/types";
import { groupAccountsByUser } from "@/util/util";

const AgentLayout = (props: {baseUrl: string, user: User|undefined, isAdmin: boolean}) => {
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(selectedStartOfWeek || new Date());
  const [tab, setTab] = useState<string>("accounts");
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true)
    fetch(props.baseUrl + "/api/accounts/user", {
      method: "POST",
      body: JSON.stringify({
        date: selectedStartOfWeek,
        username: props.user?.username
      })
    })
    .then((response) => response.json())
    .then((data) => {
      setGroupedAccounts(groupAccountsByUser(data));
      setIsLoading(false);
    })
  },[selectedStartOfWeek, refreshKey])

  return (
    <div className="mb-6 px-1 md:px-5">
      <NavBar baseUrl={props.baseUrl} isAdmin={props.isAdmin} tab={tab} setTab={setTab} />
      <WeekSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedStartOfWeek={selectedStartOfWeek} setSelectedStartOfWeek={setSelectedStartOfWeek} />
      {tab === "accounts" && <AgentsAccountsTable baseUrl={props.baseUrl} currentUser={props.user} selectedStartOfWeek={selectedStartOfWeek} groupedAccounts={groupedAccounts} isLoading={isLoading} setRefreshKey={setRefreshKey} />}
      {tab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} groupedAccounts={groupedAccounts} isLoading={isLoading} />}
    </div>
  )
}

export default AgentLayout