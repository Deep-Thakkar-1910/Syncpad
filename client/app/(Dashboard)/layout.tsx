import { ReactNode } from "react";
import Navbar from "./_components/Misc/Navbar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="pt-36">{children}</main>
    </>
  );
};

export default DashboardLayout;
