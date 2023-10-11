import { auth } from "../../../auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import UserForm from "@/components/UserForm";

const Page = async () => {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (session) redirect("/");
  return (
    <>
      <UserForm title={"Sign Up"} action={"/api/signup"} />
    </>
  );
};

export default Page;