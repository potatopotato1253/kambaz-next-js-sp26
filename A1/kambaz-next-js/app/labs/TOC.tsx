"use client";

import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TOC() {
  const pathname = usePathname();

  return (
    <Nav variant="pills" className="justify-content-center mb-3">
      <NavItem>
        <NavLink as={Link} href="/labs" active={pathname === "/labs"}>Labs</NavLink>
      </NavItem>

      <NavItem>
        <NavLink as={Link} href="/labs/lab1" active={pathname === "/labs/lab1"}>Lab 1</NavLink>
      </NavItem>

      <NavItem>
        <NavLink as={Link} href="/labs/lab2" active={pathname === "/labs/lab2"}>Lab 2</NavLink>
      </NavItem>

      <NavItem>
        <NavLink as={Link} href="/labs/lab3" active={pathname === "/labs/lab3"}>Lab 3</NavLink>
      </NavItem>

      <NavItem>
        <NavLink as={Link} href="/">Kambaz</NavLink>
      </NavItem>

      <NavItem>
        <NavLink href="https://github.com/potatopotato1253/kambaz-next-js-sp26">My GitHub</NavLink>
      </NavItem>
    </Nav>
  );
}
