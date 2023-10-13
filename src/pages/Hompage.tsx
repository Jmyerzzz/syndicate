'use client'

import { useEffect, useState } from "react"
import * as lucia from "lucia";
import { User } from "@prisma/client";

import AgentsAccountsTable from "../components/agent/AgentAccountsTable";
import AdminLayout from "../components/admin/AdminLayout";

export default function Homepage(props: {baseUrl: string, user: User}) {
  const role = props.user.role === "ADMIN" || false
  const [currentUser, setCurrentUser] = useState<User>(props.user);
  const [isAdmin, setIsAdmin] = useState<boolean>(role);

  return (
    <div className="flex flex-col justify-center">
      <button className="text-2xl font-bold text-gray-500" onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? 'Admin' : 'Agent'} View</button>
      {isAdmin ? (
        <AdminLayout baseUrl={props.baseUrl} user={currentUser} />
      ) : (
        <AgentsAccountsTable baseUrl={props.baseUrl} currentUser={currentUser} />
      )}
    </div>
  )
}