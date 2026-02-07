"use client";

import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TOC() {
  const pathname = usePathname();

  return (
    <Nav variant="pills" className="justify-content-center mb-3">
      <NavItem>
        <NavLink
          as={Link}
          href="/labs"
          className={`nav-link ${pathname.endsWith("labs") ? "active" : ""}`}
        >
          Labs
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          as={Link}
          href="/labs/lab1"
          className={`nav-link ${pathname.endsWith("lab1") ? "active" : ""}`}
        >
          Lab 1
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          as={Link}
          href="/labs/lab2"
          className={`nav-link ${pathname.endsWith("lab2") ? "active" : ""}`}
        >
          Lab 2
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          as={Link}
          href="/labs/lab3"
          className={`nav-link ${pathname.endsWith("lab3") ? "active" : ""}`}
        >
          Lab 3
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink as={Link} href="/">
          Kambaz
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink href="https://github.com/potatopotato1253/kambaz-next-js-sp26">
          My GitHub
        </NavLink>
      </NavItem>
    </Nav>
  );
}
