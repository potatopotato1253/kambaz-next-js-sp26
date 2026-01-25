"use client";

import { Nav, NavItem, NavLink } from "react-bootstrap";

export default function TOC() {
  return (
    <Nav variant="pills" className="justify-content-center mb-3">
      <NavItem><NavLink href="/labs">Labs</NavLink></NavItem>
      <NavItem><NavLink href="/labs/lab1">Lab 1</NavLink></NavItem>
      <NavItem><NavLink href="/labs/lab2">Lab 2</NavLink></NavItem>
      <NavItem><NavLink href="/labs/lab3">Lab 3</NavLink></NavItem>
      <NavItem><NavLink href="/">Kambaz</NavLink></NavItem>
      <NavItem>
        <NavLink href="https://github.com/potatopotato1253/kambaz-next-js-sp26">
          My GitHub
        </NavLink>
      </NavItem>
    </Nav>
  );
}
