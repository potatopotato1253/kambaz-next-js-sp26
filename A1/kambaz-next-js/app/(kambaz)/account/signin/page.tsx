import Link from "next/link";

export default function Signin() {
  return (
    <div id="wd-signin-screen" className="wd-account-screen">
      <h1>Sign in</h1>

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

      <Link id="wd-signin-btn" href="/account/profile" className="btn btn-primary w-100 mb-2">
        Sign in
      </Link>

      <Link id="wd-signup-link" href="/account/signup">
        Sign up
      </Link>
    </div>
  );
}
