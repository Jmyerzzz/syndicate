'use client'

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faBook, faRightFromBracket, faSackDollar, faUser } from '@fortawesome/free-solid-svg-icons';
import { User } from '@prisma/client';

const NavBar = (props: {baseUrl: string, isAdmin: boolean, tab: string, setTab: any}) => {
  const router = useRouter();
  const [agentsCount, setAgentsCount] = useState<number>(0);

  const logOut = async () => {
    await fetch(props.baseUrl + "/api/logout", {
      method: "POST"
    })
      .then(() => router.refresh())
  }

  useEffect(() => {
    fetch(props.baseUrl + "/api/agents/count", {
        method: "GET"
      })
      .then((response) => response.json())
      .then((data) => {
        setAgentsCount(data);
      })
  },[])

  return (
    <nav className="mt-4 bg-[17, 23, 41]">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex md:justify-start md:w-1/6 animate-flicker-text text-4xl font-akira-sb text-white tracking-wide uppercase">
          WAGERS
        </div>
        <div className="md:hidden mb-3">
          <button onClick={() => logOut()} className="flex flex-row items-center px-2 text-gray-100">
            Log Out
            <div>
              <FontAwesomeIcon icon={faRightFromBracket} className="ml-2" />
            </div>
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:w-2/3 items-center justify-center text-gray-100">
          <button className={`flex flex-row items-center mb-3 md:mb-0 px-3 text-2xl uppercase ${props.tab === "accounts" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => props.setTab("accounts")}>
            <FontAwesomeIcon icon={faSackDollar} width={20} className="mr-2" />
            <div>
              Weekly Figures
            </div>
          </button>
          {props.isAdmin && (
            <>
              <button className={`flex flex-row items-center mb-3 md:mb-0 ml-5 px-3 text-2xl uppercase ${props.tab === "runners" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => props.setTab("runners")}>
                <FontAwesomeIcon icon={faArrowsRotate} width={20} className="mr-2" />
                <div>
                  Runners
                </div>
              </button>
              <button className={`flex flex-row items-center mb-3 md:mb-0 mx-5 px-3 text-2xl uppercase ${props.tab === "agents" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => props.setTab("agents")}>
                <FontAwesomeIcon icon={faUser} width={20} className="mr-2" />
                <div>
                  Agents ({agentsCount})
                </div>
              </button>
            </>
          )}
          <button className={`flex flex-row items-center px-3 text-2xl uppercase ${props.tab === "transactions" && "text-blue-400 border-b border-solid border-blue-400"}`} onClick={() => props.setTab("transactions")}>
            <FontAwesomeIcon icon={faBook} width={20} className="mr-2" />
            <div>
              Transactions
            </div>
          </button>
        </div>
        <div className="hidden md:flex md:justify-end md:w-1/6">
          <button onClick={() => logOut()} className="flex flex-row items-center px-2 text-gray-100">
            Log Out
            <div>
              <FontAwesomeIcon icon={faRightFromBracket} className="ml-2" />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;