import { getPageSession } from "../../auth/lucia";
import { redirect } from "next/navigation";
import { Metadata } from 'next'
import Homepage from '@/pages/Hompage'
 
export const metadata: Metadata = {
  title: 'Syndicate',
  description: 'Syndicate Accounting',
}

const BASE_URL = process.env.NODE_ENV === "production" ? "https://syndicate-eta.vercel.app" : "http://localhost:3000";

const Page = async () => {
  const session = await getPageSession();
  if (!session) redirect(BASE_URL + "/login");

  const user = await fetch(BASE_URL + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      userId: session.user.userId
    })
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })

  return (
    <Homepage baseUrl={BASE_URL} user={user} role={user.role} />
  )
}

export default Page