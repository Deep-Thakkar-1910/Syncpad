import { Metadata } from "next";
import SigninPage from "../_components/SigninPage";

export const metadata: Metadata = {
  title: "Signin",
  description: "Sign in page for Syncpad",
};

const Signin = () => {
  return <SigninPage />;
};

export default Signin;
