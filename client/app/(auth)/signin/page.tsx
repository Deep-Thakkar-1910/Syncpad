import { Metadata } from "next";
import { Suspense } from "react";
import SigninPage from "../_components/SigninPage";

export const metadata: Metadata = {
  title: "Signin",
  description: "Sign in page for Syncpad",
};

const Signin = () => {
  return (
    <Suspense fallback={null}>
      <SigninPage />
    </Suspense>
  );
};

export default Signin;
