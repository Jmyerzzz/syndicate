import React from 'react';

const NavBar = () => {
  return (
    <nav className="bg-black pt-6 pb-10">
      <div className="container mx-auto flex items-center justify-center">
        <div className="animate-flicker-text text-2xl font-akira-sb text-white tracking-wide uppercase">
          Syndicate
        </div>
      </div>
    </nav>
  );
};

export default NavBar;