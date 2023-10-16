'use client'

import { useState } from "react"
import { User } from "@prisma/client";

import AdminLayout from "../components/admin/AdminLayout";
import AgentLayout from "@/components/agent/AgentLayout";

export default function Homepage(props: {baseUrl: string, user: User, role: string}) {
  const [currentUser, setCurrentUser] = useState<User>(props.user);
  const [isAdmin, setIsAdmin] = useState<boolean>(props.role === "ADMIN");

  return (
    <div className="flex flex-col justify-center">
      <button className="text-2xl font-bold text-gray-500" onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? 'Admin' : 'Agent'} View</button>
      {isAdmin ? (
        <AdminLayout baseUrl={props.baseUrl} user={currentUser} />
      ) : (
        <AgentLayout baseUrl={props.baseUrl} user={currentUser} />
      )}
    </div>
  )
}