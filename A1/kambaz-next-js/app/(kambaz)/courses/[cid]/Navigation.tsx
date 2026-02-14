"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();

  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];

  const hrefFor = (label: string) => `/courses/${cid}/${label.toLowerCase()}`;

  return (
    <ListGroup id="wd-course-navigation" className="rounded-0">
      {links.map((label) => {
        const href = hrefFor(label);
        const active = pathname === href || pathname.startsWith(href + "/");

        return (
          <ListGroupItem key={label} active={active} className="border-0">
            <Link className="wd-course-link" href={href}>
              {label}
            </Link>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
