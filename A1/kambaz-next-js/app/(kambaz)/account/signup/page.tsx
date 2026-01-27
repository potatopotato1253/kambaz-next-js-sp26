import Link from "next/link";

export default function Signup() {
  return (
    <div id="wd-signup-screen" className="wd-account-screen">
      <h1>Sign up</h1>

      <input
        id="wd-username"
        placeholder="username"
        className="form-control mb-2"
      />

      <input
        id="wd-password"
        placeholder="password"
        type="password"
        className="form-control mb-2"
      />

      <input
        id="wd-password-verify"
        placeholder="verify password"
        type="password"
        className="form-control mb-2"
      />

      <Link href="/account/profile" className="btn btn-primary w-100 mb-2">
        Sign up
      </Link>

      <Link href="/account/signin">Sign in</Link>
    </div>
  );
}
