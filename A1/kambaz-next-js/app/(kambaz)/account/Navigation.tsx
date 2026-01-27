"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountNavigation() {
  const pathname = usePathname();

  const links = [
    { label: "Signin", href: "/account/signin" },
    { label: "Signup", href: "/account/signup" },
    { label: "Profile", href: "/account/profile" },
  ];

  return (
    <div id="wd-account-navigation">
      {links.map((link) => (
        <div
          key={link.href}
          className={`wd-account-nav-item ${
            pathname === link.href ? "active" : ""
          }`}
        >
          <Link className="wd-account-link" href={link.href}>
            {link.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
