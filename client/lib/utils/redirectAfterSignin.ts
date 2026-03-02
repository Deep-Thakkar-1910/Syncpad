import { redirect } from "next/navigation";

export const redirectAfterSignin = (path: string) => {
  return redirect(`/signin?callbackURL=${encodeURIComponent(path)}`); // util function to redirect to signin and pass a callbackURL to return to same page after signin
};
