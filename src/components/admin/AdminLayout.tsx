import { useContext, useEffect, useRef, useState } from "react";
import WeekSelector from "../WeekSelector";
import AccountsTable from "./AccountsTable";
import AgentsTable from "./AgentsTable";
import { addDays, startOfWeek } from "date-fns";
import TransactionsTable from "../TransactionsTable";
import RunnersTable from "./RunnersTable";
import NavBar from "../NavBar";
import { UserAccounts } from "@/types/types";
import {
  groupAccountsByUser,
  sortAccountsByIds,
  sortAgentsById,
  sortUserAccountsByAgentOrder,
} from "@/util/util";
import BookiesTable from "./BookiesTable";
import SummarySection from "./SummarySection";
import { HomepageContext } from "@/util/HomepageContext";

const AdminLayout = () => {
  const { user, isAdmin, baseUrl } = useContext(HomepageContext);
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(
    startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 })
  );
  const prevSelectedStartOfWeek = useRef(selectedStartOfWeek);
  const [selectedDate, setSelectedDate] = useState(
    selectedStartOfWeek || addDays(new Date(), -7)
  );
  const [tab, setTab] = useState<string>("accounts");
  const [groupedAccounts, setGroupedAccounts] = useState<UserAccounts[]>([]);
  const [agentList, setAgentList] = useState<any[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountRefreshKey, setAccountRefreshKey] = useState<number>(0);
  const [agentRefreshKey, setAgentRefreshKey] = useState<number>(0);

  useEffect(() => {
    if (prevSelectedStartOfWeek.current !== selectedStartOfWeek) {
      setIsLoading(true);
    }
    fetch(baseUrl + "/api/accounts/all", {
      method: "POST",
      body: JSON.stringify(selectedStartOfWeek),
    })
      .then((response) => response.json())
      .then((data) => {
        setGroupedAccounts(
          sortUserAccountsByAgentOrder(
            groupAccountsByUser(data).map((user) => {
              user = sortAccountsByIds(user, user.order);
              return user;
            }),
            user.agent_order
          )
        );
        setIsLoading(false);
        prevSelectedStartOfWeek.current = selectedStartOfWeek;
      });
  }, [selectedStartOfWeek, accountRefreshKey, baseUrl, user.agent_order]);

  useEffect(() => {
    fetch(baseUrl + "/api/agents/all", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setAgentList(sortAgentsById(data, user.agent_order));
        setIsLoading(false);
      });
  }, [baseUrl, agentRefreshKey, user.agent_order]);

  return (
    <div className="mb-6 px-1 md:px-5">
      <NavBar
        baseUrl={baseUrl}
        isAdmin={isAdmin}
        agentsCount={agentList.length}
        tab={tab}
        setTab={setTab}
      />
      {(tab === "accounts" || tab === "transactions" || tab === "runners") && (
        <WeekSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedStartOfWeek={selectedStartOfWeek}
          setSelectedStartOfWeek={setSelectedStartOfWeek}
        />
      )}
      {tab === "accounts" && (
        <>
          <SummarySection
            weeklyTotal={weeklyTotal}
            totalCollected={totalCollected}
            isLoading={isLoading}
          />
          <AccountsTable
            baseUrl={baseUrl}
            selectedStartOfWeek={selectedStartOfWeek}
            groupedAccounts={groupedAccounts}
            setWeeklyTotal={setWeeklyTotal}
            setTotalCollected={setTotalCollected}
            isLoading={isLoading}
            setRefreshKey={setAccountRefreshKey}
          />
        </>
      )}
      {tab === "runners" && (
        <RunnersTable groupedAccounts={groupedAccounts} isLoading={isLoading} />
      )}
      {tab === "transactions" && (
        <TransactionsTable
          groupedAccounts={groupedAccounts}
          isLoading={isLoading}
        />
      )}
      {tab === "bookies" && (
        <BookiesTable groupedAccounts={groupedAccounts} isLoading={isLoading} />
      )}
      {tab === "agents" && (
        <AgentsTable
          baseUrl={baseUrl}
          agentList={agentList}
          isLoading={isLoading}
          setRefreshKey={setAgentRefreshKey}
        />
      )}
    </div>
  );
};

export default AdminLayout;
