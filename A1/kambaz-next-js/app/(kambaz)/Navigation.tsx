"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";

export default function KambazNavigation() {
  const pathname = usePathname();

  const links = [
    { label: "Account", href: "/account", icon: FaRegCircleUser },
    { label: "Dashboard", href: "/dashboard", icon: AiOutlineDashboard },
    { label: "Courses", href: "/dashboard", icon: LiaBookSolid },
    { label: "Calendar", href: "/calendar", icon: IoCalendarOutline },
    { label: "Inbox", href: "/inbox", icon: FaInbox },
    { label: "Labs", href: "/labs", icon: LiaCogSolid },
  ];

  const isActive = (href: string, label: string) => {
    if (label === "Dashboard" && pathname.startsWith("/courses")) return true;
    return pathname === href || pathname.startsWith(href + "/") || pathname.includes(label.toLowerCase());
  };

  return (
    <ListGroup
      id="wd-kambaz-navigation"
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 120 }}
    >
      <ListGroupItem
        className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <img src="/images/NEU.jpg" width="75" alt="Northeastern University" />
      </ListGroupItem>
      <br />

      {links.map((link) => {
        const active = isActive(link.href, link.label);
        const Icon = link.icon;

        return (
          <ListGroupItem
            key={link.label}
            className={`bg-black text-center border-0 ${
              active ? "bg-white" : ""
            }`}
          >
            <Link
              href={link.href}
              className={`text-decoration-none d-block ${
                active ? "text-danger" : "text-white"
              }`}
              id={`wd-${link.label.toLowerCase()}-link`}
            >
              <Icon className={`fs-1 ${active ? "text-danger" : "text-danger"}`} />
              <br />
              {link.label}
            </Link>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
