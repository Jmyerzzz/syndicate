import { getPageSession } from "../../auth/lucia";
import { redirect } from "next/navigation";
import { Metadata } from 'next'
import Homepage from '@/pages/Hompage'
 
export const metadata: Metadata = {
  title: 'Syndicate',
  description: 'Syndicate Accounting',
}

const BASE_URL = process.env.URL || "";

const Page = async () => {
  const session = await getPageSession();
  if (!session) redirect("/login");

  return (
    <Homepage baseUrl={BASE_URL} user={session.user} />
  )
}

export default Page