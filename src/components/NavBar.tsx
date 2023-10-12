'use client'

import React from 'react';
import { useRouter } from "next/navigation";

const NavBar = (props: {baseUrl: string, session: any}) => {
  const router = useRouter();

  const logOut = async () => {
    await fetch(props.baseUrl + "/api/logout", {
      method: "POST"
    })
      .then(() => router.refresh())
  }
  return (
    <nav className="bg-black">
      <div className="container mx-auto flex items-center justify-center pt-6 pb-10">
        {props.session &&
          <div className="flex flex-auto w-1/3"></div>
        }
        <div className="flex flex-auto justify-center w-1/3 animate-flicker-text text-3xl font-akira-sb text-white tracking-wide uppercase">
          Syndicate
        </div>
        {props.session &&
          <div className="flex flex-auto justify-end w-1/3">
            <button onClick={() => logOut()} className="px-2 text-gray-100 bg-gray-700 rounded">
              Log Out
            </button>
          </div>
        }
      </div>
    </nav>
  );
};

export default NavBar;