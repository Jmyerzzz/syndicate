import { useContext, useEffect, useState } from "react";
import WeekSelector from "../WeekSelector"
import AccountsTable from "./AccountsTable"
import AgentsTable from "./AgentsTable"
import { addDays, startOfWeek } from "date-fns";
import TransactionsTable from "../TransactionsTable";
import RunnersTable from "./RunnersTable";
import NavBar from "../NavBar";
import { UserAccounts } from "@/types/types";
import { groupAccountsByUser, sortAccountsByIds } from "@/util/util";
import BookiesTable from "./BookiesTable";
import SummarySection from "./SummarySection";
import { HomepageContext } from "@/util/HomepageContext";

const AdminLayout = () => {
  const {isAdmin, baseUrl} = useContext(HomepageContext);
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(selectedStartOfWeek || addDays(new Date(), -7));
  const [tab, setTab] = useState<string>("accounts");
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [agentList, setAgentList] = useState<any[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true)
    fetch(baseUrl + "/api/accounts/all", {
        method: "POST",
        body: JSON.stringify(selectedStartOfWeek)
    })
      .then((response) => response.json())
      .then((data) => {
        setGroupedAccounts(groupAccountsByUser(data).map((user) => {
          user = sortAccountsByIds(user, user.order);
          return user;
        }));
        setIsLoading(false);
      })
  },[selectedStartOfWeek, refreshKey, baseUrl])

  useEffect(() => {
    setIsLoading(true)
    fetch(baseUrl + "/api/agents/all", {
        method: "GET"
      })
      .then((response) => response.json())
      .then((data) => {
        setAgentList(data);
        setIsLoading(false);
      })
  },[baseUrl, refreshKey])

  return (
    <div className="mb-6 px-1 md:px-5">
      <NavBar baseUrl={baseUrl} isAdmin={isAdmin} tab={tab} setTab={setTab} />
      {(tab === "accounts" || tab === "transactions" || tab === "runners") && <WeekSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedStartOfWeek={selectedStartOfWeek} setSelectedStartOfWeek={setSelectedStartOfWeek} />}
      {tab === "accounts" &&
        <>
          <SummarySection weeklyTotal={weeklyTotal} totalCollected={totalCollected} />
          <AccountsTable baseUrl={baseUrl} selectedStartOfWeek={selectedStartOfWeek} groupedAccounts={groupedAccounts} setWeeklyTotal={setWeeklyTotal} setTotalCollected={setTotalCollected} isLoading={isLoading} setRefreshKey={setRefreshKey} />
        </>
      }
      {tab === "runners" && <RunnersTable groupedAccounts={groupedAccounts} isLoading={isLoading} />}
      {tab === "transactions" && <TransactionsTable groupedAccounts={groupedAccounts} isLoading={isLoading} />}
      {tab === "bookies" && <BookiesTable groupedAccounts={groupedAccounts} isLoading={isLoading} />}
      {tab === "agents" && <AgentsTable baseUrl={baseUrl} agentList={agentList} isLoading={isLoading} setRefreshKey={setRefreshKey} />}
    </div>
  )
}

export default AdminLayout