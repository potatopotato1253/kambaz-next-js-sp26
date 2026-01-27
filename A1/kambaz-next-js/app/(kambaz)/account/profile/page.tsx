import Link from "next/link";

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="wd-account-screen">
      <h1>Profile</h1>

      <input defaultValue="alice" className="form-control mb-2" />
      <input defaultValue="123" className="form-control mb-2" />
      <input defaultValue="Alice" className="form-control mb-2" />
      <input defaultValue="Wonderland" className="form-control mb-2" />
      <input defaultValue="2000-01-01" type="date" className="form-control mb-2" />
      <input defaultValue="alice@wonderland.com" type="email" className="form-control mb-2" />

      <select defaultValue="USER" className="form-select mb-3">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </select>

      <Link href="/account/signin" className="btn btn-danger w-100">
        Signout
      </Link>
    </div>
  );
}
