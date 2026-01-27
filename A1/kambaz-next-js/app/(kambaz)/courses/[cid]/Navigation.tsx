"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: `/courses/${cid}/home` },
    { label: "Modules", href: `/courses/${cid}/modules` },
    { label: "Piazza", href: `/courses/${cid}/piazza` },
    { label: "Zoom", href: `/courses/${cid}/zoom` },
    { label: "Assignments", href: `/courses/${cid}/assignments` },
    { label: "Quizzes", href: `/courses/${cid}/quizzes` },
    { label: "Grades", href: `/courses/${cid}/grades` },
    { label: "People", href: `/courses/${cid}/people` },
  ];

  return (
    <ListGroup id="wd-course-navigation" className="rounded-0">
      {links.map((link) => (
        <ListGroupItem
          key={link.href}
          active={pathname === link.href}
          className="border-0"
        >
          <Link className="wd-course-link" href={link.href}>
            {link.label}
          </Link>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}
