'use client'

import "overlayscrollbars/overlayscrollbars.css";
import { useEffect, useState } from "react"
import { User } from "@prisma/client";

import AdminLayout from "../components/admin/AdminLayout";
import AgentLayout from "@/components/agent/AgentLayout";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import { HomepageContext } from "@/util/HomepageContext";

export default function Homepage(props: {baseUrl: string, user: User, role: string}) {
  const [isAdmin] = useState<boolean>(props.role === "ADMIN");
  const [initBodyOverlayScrollbars] =
    useOverlayScrollbars({
      defer: true,
      options: {
        scrollbars: {
          theme: "os-theme-light",
          autoHide: "scroll",
        },
      },
    });

  useEffect(() => {
    initBodyOverlayScrollbars(document.body);
  }, [initBodyOverlayScrollbars]);

  return (
    <HomepageContext.Provider
      value={{
        user: props.user,
        isAdmin: props.role === "ADMIN",
        baseUrl: props.baseUrl,
      }}
    >
      <div className="flex flex-col justify-center">
        {/* <button className="text-2xl font-bold text-gray-500" onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? 'Admin' : 'Agent'} View</button> */}
        {isAdmin ? (
          <AdminLayout />
        ) : (
          <AgentLayout />
        )}
      </div>
    </HomepageContext.Provider>
  )
}