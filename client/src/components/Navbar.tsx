import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import React from "react";
import { register } from "@/app/api/userApi";

const Navbar = async () => {
  const { isAuthenticated, getPermission, getUser } = getKindeServerSession();
  const user = await getUser();
  if (user) {
    const { family_name, given_name, username, email, id } = user;

    register({
      familyName: family_name,
      givenName: given_name,
      username: username,
      email: email,
      isAdmin: false,
      _id: id,
    }).catch((e) => console.log(e));
  }

  // Admin
  const requiredPermission = await getPermission("delete:user");
  let isAdmin: boolean = false;
  if (requiredPermission && requiredPermission.isGranted) {
    isAdmin = true;
  }

  return (
    <div className="border-b h-[8vh] flex w-full px-24 py-10 fixed top-0 left-0 bg-white z-10">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <p className="font-bold text-2xl">Money Manager</p>
        </Link>
      </div>

      {(await isAuthenticated()) ? (
        <div className="flex items-center gap-x-5">
          {isAdmin ? (
            <>
              <Link
                className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3"
                href="/User"
              >
                User
              </Link>
              <Link
                className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3"
                href="/adminReport"
              >
                User
              </Link>
            </>
          ) : (
            <>
              <Link
                className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3"
                href="/Record"
              >
                Records
              </Link>
              <Link
                className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3"
                href="/Report"
              >
                Reports
              </Link>
              <Link
                className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3"
                href="/Budget"
              >
                Budget
              </Link>
              <Link
                className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3"
                href="/Profile"
              >
                Profile
              </Link>
            </>
          )}

          <LogoutLink className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3">
            Logout
          </LogoutLink>
        </div>
      ) : (
        <div className="flex items-center gap-x-5">
          <LoginLink className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3">
            Login
          </LoginLink>
          <RegisterLink className="hover:text-blue-500 hover:underline hover:decoration-2 hover:underline-offset-8 text-black p-3">
            Register
          </RegisterLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;
