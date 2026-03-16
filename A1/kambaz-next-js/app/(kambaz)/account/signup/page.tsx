"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();

  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      redirect("/account/profile");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Unable to sign up");
    }
  };

  return (
    <div id="wd-signup-screen" className="wd-account-screen">
      <h1>Sign up</h1>

      <FormControl
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />

      <FormControl
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />

      <Button
        onClick={signup}
        className="btn btn-primary mb-2 w-100"
        id="wd-signup-btn"
      >
        Sign up
      </Button>

      <Link href="/account/signin" id="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}