import { auth } from "../../../auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import UserForm from "@/components/UserForm";

const BASE_URL = process.env.URL || "";

const Page = async () => {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (session) redirect(BASE_URL + "/");

  // const user = await fetch(BASE_URL + "/api/user", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     userId: session!.user.userId
  //   })
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     return data
  //   })

  return (
    <>
      {/* <UserForm title={"Sign Up"} action={"/api/signup"} role={user.role} /> */}
      <UserForm title={"Sign Up"} action={"/api/signup"} />
    </>
  );
};

export default Page;