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
        <NavLink
          as={Link}
          href="/labs/lab4"
          className={`nav-link ${pathname.endsWith("lab4") ? "active" : ""}`}
        >
          Lab 4
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          as={Link}
          href="/labs/lab5"
          className={`nav-link ${pathname.endsWith("lab5") ? "active" : ""}`}
        >
          Lab 5
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

      <NavItem>
        <NavLink href="https://github.com/potatopotato1253/kambaz-node-server-app">
          Node Github
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink href="https://kambaz-node-server-app-4e12.onrender.com">
          Render
        </NavLink>
      </NavItem>
    </Nav>
  );
}
