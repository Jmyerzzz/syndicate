import { useContext, useEffect, useState } from "react";
import WeekSelector from "../WeekSelector"
import { startOfWeek } from "date-fns";
import TransactionsTable from "../TransactionsTable";
import AgentsAccountsTable from "./AgentAccountsTable";
import NavBar from "../NavBar";
import { UserAccounts } from "@/types/types";
import { groupAccountsByUser } from "@/util/util";
import { HomepageContext } from "@/util/HomepageContext";

const AgentLayout = (props: {baseUrl: string}) => {
  const {user, isAdmin} = useContext(HomepageContext);
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
        username: user.username
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
      <NavBar baseUrl={props.baseUrl} isAdmin={isAdmin} tab={tab} setTab={setTab} />
      <WeekSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedStartOfWeek={selectedStartOfWeek} setSelectedStartOfWeek={setSelectedStartOfWeek} />
      {tab === "accounts" && <AgentsAccountsTable baseUrl={props.baseUrl} currentUser={user} selectedStartOfWeek={selectedStartOfWeek} groupedAccounts={groupedAccounts} isLoading={isLoading} setRefreshKey={setRefreshKey} />}
      {tab === "transactions" && <TransactionsTable baseUrl={props.baseUrl} selectedStartOfWeek={selectedStartOfWeek} groupedAccounts={groupedAccounts} isLoading={isLoading} />}
    </div>
  )
}

export default AgentLayout