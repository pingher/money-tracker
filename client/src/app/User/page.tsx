import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated;
  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }
  return <div className="py-36">Hello</div>;
}
