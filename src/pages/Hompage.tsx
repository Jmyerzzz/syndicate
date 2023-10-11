'use client'

import { useEffect, useMemo, useState } from "react"
import * as lucia from "lucia";
import { User } from "@prisma/client";
import { startOfWeek } from "date-fns";

import AgentsAccountsTable from "../components/agent/AgentAccountsTable";
import AdminLayout from "../components/admin/AdminLayout";

export default function Homepage(props: {user: lucia.User}) {
  const [currentUser, setCurrentUser] = useState<User>();
  const [adminTab, setAdminTab] = useState<string>("accounts");
  const [agentList, setAgentList] = useState<any[]>([]);
  const [accountList, setAccountList] = useState<any[]>([]);
  const [userAccountList, setUserAccountList] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [selectedStartOfWeek, setSelectedStartOfWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useMemo(() => {
    fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          userId: props.user.userId
        })
      })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data);
        setIsAdmin(data.role === "ADMIN")
      })
  },[])

  useMemo(() => {
    fetch("/api/agents", {
        method: "GET"
      })
      .then((response) => response.json())
      .then((data) => {
        setAgentList(data);
      })
  },[])

  useMemo(() => {
    fetch("/api/accounts/all", {
        method: "POST",
        body: JSON.stringify(selectedStartOfWeek)
      })
      .then((response) => response.json())
      .then((data) => {
        setAccountList(data);
      })
  },[selectedStartOfWeek])

  useMemo(() => {
    fetch("/api/accounts/user", {
        method: "POST",
        body: JSON.stringify({
          date: selectedStartOfWeek,
          username: currentUser?.username
        })
      })
      .then((response) => response.json())
      .then((data) => {
        setUserAccountList(data);
      })
  },[selectedStartOfWeek])

  return (
    <div className="flex flex-col justify-center">
      <button className="text-2xl font-bold text-gray-500" onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? 'Admin' : 'Agent'} View</button>
      {isAdmin ? (
        <AdminLayout accountList={accountList} agentList={agentList} setSelectedStartOfWeek={selectedStartOfWeek} />
      ) : (
        <AgentsAccountsTable currentUser={currentUser} userAccountList={userAccountList} setSelectedStartOfWeek={selectedStartOfWeek} />
      )}
    </div>
  )
}