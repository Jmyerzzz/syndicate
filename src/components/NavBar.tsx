"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faBook,
  faListCheck,
  faRightFromBracket,
  faSackDollar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const NavBar = (props: {
  baseUrl: string;
  isAdmin: boolean;
  agentsCount?: number;
  tab: string;
  setTab: any;
}) => {
  const router = useRouter();

  const logOut = useCallback(async () => {
    await fetch(props.baseUrl + "/api/logout", {
      method: "POST",
    }).then(() => router.refresh());
  }, [props.baseUrl, router]);

  return (
    <nav className="mt-4 bg-[17, 23, 41]">
      <div className="flex flex-col 2xl:flex-row justify-between items-center">
        <div className="flex 2xl:justify-start 2xl:w-1/6 animate-flicker-text text-4xl font-akira-sb text-white tracking-wide uppercase">
          WAGERS
        </div>
        <div className="2xl:hidden mb-3">
          <button
            onClick={() => logOut()}
            className="flex flex-row items-center px-2 text-zinc-100"
          >
            Log Out
            <div>
              <FontAwesomeIcon icon={faRightFromBracket} className="ml-2" />
            </div>
          </button>
        </div>
        <div className="flex flex-col 2xl:flex-row 2xl:w-2/3 items-center justify-center text-zinc-100">
          <button
            className={`flex flex-row items-center mb-3 2xl:mb-0 px-3 text-2xl uppercase ${
              props.tab === "accounts" &&
              "text-blue-400 border-b border-solid border-blue-400"
            }`}
            onClick={() => props.setTab("accounts")}
          >
            <FontAwesomeIcon icon={faSackDollar} width={20} className="mr-2" />
            <div>Weekly Figures</div>
          </button>
          {props.isAdmin && (
            <button
              className={`flex flex-row items-center mb-3 2xl:mb-0 2xl:mx-4 px-3 text-2xl uppercase ${
                props.tab === "runners" &&
                "text-blue-400 border-b border-solid border-blue-400"
              }`}
              onClick={() => props.setTab("runners")}
            >
              <FontAwesomeIcon
                icon={faArrowsRotate}
                width={20}
                className="mr-2"
              />
              <div>Runners</div>
            </button>
          )}
          <button
            className={`flex flex-row items-center mb-3 2xl:mb-0 2xl:mr-4 px-3 text-2xl uppercase ${
              props.tab === "transactions" &&
              "text-blue-400 border-b border-solid border-blue-400"
            }`}
            onClick={() => props.setTab("transactions")}
          >
            <FontAwesomeIcon icon={faListCheck} width={20} className="mr-2" />
            <div>Transactions</div>
          </button>
          {props.isAdmin && (
            <>
              <button
                className={`flex flex-row items-center mb-3 2xl:mb-0 2xl:mr-4 px-3 text-2xl uppercase ${
                  props.tab === "bookies" &&
                  "text-blue-400 border-b border-solid border-blue-400"
                }`}
                onClick={() => props.setTab("bookies")}
              >
                <FontAwesomeIcon icon={faBook} width={20} className="mr-2" />
                <div>Bookies</div>
              </button>
              <button
                className={`flex flex-row items-center px-3 text-2xl uppercase ${
                  props.tab === "agents" &&
                  "text-blue-400 border-b border-solid border-blue-400"
                }`}
                onClick={() => props.setTab("agents")}
              >
                <FontAwesomeIcon icon={faUser} width={20} className="mr-2" />
                <div>Agents ({props.agentsCount})</div>
              </button>
            </>
          )}
        </div>
        <div className="hidden 2xl:flex 2xl:justify-end 2xl:w-1/6">
          <button
            onClick={() => logOut()}
            className="flex flex-row items-center px-2 text-zinc-100"
          >
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
