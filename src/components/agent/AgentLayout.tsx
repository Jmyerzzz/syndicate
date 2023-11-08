import { useContext, useEffect, useRef, useState } from "react";
import WeekSelector from "../WeekSelector";
import { addDays, startOfWeek } from "date-fns";
import TransactionsTable from "../TransactionsTable";
import AgentsAccountsTable from "./AgentAccountsTable";
import NavBar from "../NavBar";
import { UserAccounts } from "@/types/types";
import { groupAccountsByUser, sortUserAccountsByIds } from "@/util/util";
import { HomepageContext } from "@/util/HomepageContext";

const AgentLayout = () => {
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    if (prevSelectedStartOfWeek.current !== selectedStartOfWeek) {
      setIsLoading(true);
    }
    fetch(baseUrl + "/api/accounts/user", {
      method: "POST",
      body: JSON.stringify({
        date: selectedStartOfWeek,
        username: user.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGroupedAccounts(
          sortUserAccountsByIds(groupAccountsByUser(data), user.order)
        );
        setIsLoading(false);
        prevSelectedStartOfWeek.current = selectedStartOfWeek;
      });
  }, [selectedStartOfWeek, refreshKey, baseUrl, user]);

  return (
    <div className="mb-6 px-1 md:px-5">
      <NavBar baseUrl={baseUrl} isAdmin={isAdmin} tab={tab} setTab={setTab} />
      <WeekSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedStartOfWeek={selectedStartOfWeek}
        setSelectedStartOfWeek={setSelectedStartOfWeek}
      />
      {tab === "accounts" && (
        <AgentsAccountsTable
          baseUrl={baseUrl}
          currentUser={user}
          selectedStartOfWeek={selectedStartOfWeek}
          groupedAccounts={groupedAccounts}
          isLoading={isLoading}
          setRefreshKey={setRefreshKey}
        />
      )}
      {tab === "transactions" && (
        <TransactionsTable
          groupedAccounts={groupedAccounts}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AgentLayout;
