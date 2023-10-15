'use client'

import React from 'react';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const NavBar = (props: {baseUrl: string, session: any}) => {
  const router = useRouter();

  const logOut = async () => {
    await fetch(props.baseUrl + "/api/logout", {
      method: "POST"
    })
      .then(() => router.refresh())
  }
  return (
    <nav className="bg-[17, 23, 41]">
      <div className="sm:px-20 mx-auto flex flex-col sm:flex-row items-center justify-center pt-6 pb-4 sm:pb-10">
        {props.session &&
          <div className="flex flex-auto sm:w-1/3"></div>
        }
        <div className="flex flex-auto justify-center mb-3 sm:mb-0 sm:w-1/3 animate-flicker-text text-4xl font-akira-sb text-white tracking-wide uppercase">
          Syndicate
        </div>
        {props.session &&
          <div className="flex flex-auto justify-end sm:w-1/3">
            <button onClick={() => logOut()} className="flex flex-row items-center px-2 text-gray-100">
              Log Out
              <div>
                <FontAwesomeIcon icon={faRightFromBracket} className="ml-2" />
              </div>
            </button>
          </div>
        }
      </div>
    </nav>
  );
};

export default NavBar;