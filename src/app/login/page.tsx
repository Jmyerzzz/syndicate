import { auth } from "../../../auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import UserForm from "@/components/UserForm";

const BASE_URL = process.env.URL || "";

const Page = async () => {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (session) redirect(BASE_URL + "/");
  return (
    <>
      <UserForm title={"Log In"} action={"/api/login"} />
    </>
  );
};

export default Page;