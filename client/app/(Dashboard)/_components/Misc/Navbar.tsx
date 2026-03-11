"use client";

import ProfileDropDown from "./ProfileDropdown";

const Navbar = () => {
  return (
    <nav className="bg-navbar fixed flex w-full items-center justify-between p-6 px-10 shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-1">
        <div className="bg-primary inline-flex size-12 items-center justify-center rounded-lg text-center">
          <span className="text-primary-foreground text-lg font-bold">
            {"</>"}
          </span>
        </div>
        <h1 className="text-foreground text-2xl font-bold">
          <span className="text-primary"> Sync</span>pad
        </h1>
      </div>

      {/* Profile for logged in user */}
      <ProfileDropDown />
    </nav>
  );
};

export default Navbar;
