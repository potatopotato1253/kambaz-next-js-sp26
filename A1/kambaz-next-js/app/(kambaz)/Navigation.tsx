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

  const active = (href: string) =>
    pathname === href || (href === "/dashboard" && pathname.startsWith("/courses"));

  const itemClass = (href: string) =>
    active(href)
      ? "border-0 bg-white text-center"
      : "border-0 bg-black text-center";

  const linkClass = (href: string) =>
    active(href)
      ? "text-danger text-decoration-none d-block"
      : "text-white text-decoration-none d-block";

  const iconClass = (href: string, isAccount = false) =>
    active(href)
      ? "fs-1 text-danger"
      : isAccount
        ? "fs-1 text-white"
        : "fs-1 text-danger";

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

      <ListGroupItem className={itemClass("/account")}>
        <Link href="/account" id="wd-account-link" className={linkClass("/account")}>
          <FaRegCircleUser className={iconClass("/account", true)} />
          <br />
          Account
        </Link>
      </ListGroupItem>
      <br />

      <ListGroupItem className={itemClass("/dashboard")}>
        <Link href="/dashboard" id="wd-dashboard-link" className={linkClass("/dashboard")}>
          <AiOutlineDashboard className={iconClass("/dashboard")} />
          <br />
          Dashboard
        </Link>
      </ListGroupItem>
      <br />

      <ListGroupItem className={itemClass("/courses")}>
        <Link href="/courses" id="wd-course-link" className={linkClass("/courses")}>
          <LiaBookSolid className={iconClass("/courses")} />
          <br />
          Courses
        </Link>
      </ListGroupItem>
      <br />

      <ListGroupItem className={itemClass("/calendar")}>
        <Link href="/calendar" id="wd-calendar-link" className={linkClass("/calendar")}>
          <IoCalendarOutline className={iconClass("/calendar")} />
          <br />
          Calendar
        </Link>
      </ListGroupItem>
      <br />

      <ListGroupItem className={itemClass("/inbox")}>
        <Link href="/inbox" id="wd-inbox-link" className={linkClass("/inbox")}>
          <FaInbox className={iconClass("/inbox")} />
          <br />
          Inbox
        </Link>
      </ListGroupItem>
      <br />

      <ListGroupItem className={itemClass("/labs")}>
        <Link href="/labs" id="wd-labs-link" className={linkClass("/labs")}>
          <LiaCogSolid className={iconClass("/labs")} />
          <br />
          Labs
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}
