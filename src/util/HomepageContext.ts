import { createContext } from "react";
import { User, Role } from "@prisma/client";

export const HomepageContext = createContext<{user: User, isAdmin: boolean, baseUrl: string}>({
  user: {
    id: "",
    name: "",
    username: "",
    role: Role.AGENT,
    risk_percentage: 0,
    gabe_way: 0,
    order: [],
    agent_order: [],
  },
  isAdmin: false,
  baseUrl: "",
});