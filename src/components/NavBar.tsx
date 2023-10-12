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
          <button onClick={() => logOut()} className="flex flex-auto justify-end w-1/3">
            <div className="flex flex-auto w-1/3"></div>
          </button>
        }
        <div className="flex flex-auto justify-center w-1/3 animate-flicker-text text-3xl font-akira-sb text-white tracking-wide uppercase">
          Syndicate
        </div>
        {props.session &&
          <button onClick={() => logOut()} className="flex flex-auto justify-end w-1/3">
            Log Out
          </button>
        }
      </div>
    </nav>
  );
};

export default NavBar;