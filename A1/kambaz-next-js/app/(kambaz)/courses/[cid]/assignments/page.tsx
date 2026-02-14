"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import * as db from "../../../database";

import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Badge,
} from "react-bootstrap";

import { FaPlus } from "react-icons/fa6";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";

import GreenCheckmark from "../modules/GreenCheckmark";

const formatCanvasLike = (iso?: string) => {
  if (!iso) return "";

  const d = new Date(iso);

  const month = d.toLocaleString("en-US", { month: "short" }); // May
  const day = d.getDate(); // 6

  let hours = d.getHours(); // 0..23
  const minutes = d.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${month} ${day} at ${hours}:${minutes}${ampm}`;
};

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();

  const assignmentsForCourse = db.assignments.filter(
    (a: any) => a.course === cid
  );

  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: 320 }}>
          <InputGroup.Text className="bg-white">
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            placeholder="Search for Assignments"
            id="wd-search-assignment"
          />
        </InputGroup>

        <div className="text-nowrap">
          <Button
            variant="secondary"
            className="me-2"
            id="wd-add-assignment-group"
          >
            <FaPlus className="me-2" /> Group
          </Button>
          <Button variant="danger" id="wd-add-assignment">
            <FaPlus className="me-2" /> Assignment
          </Button>
        </div>
      </div>

      <ListGroup id="wd-assignment-list" className="rounded-0">
        <ListGroupItem className="p-0 mb-3 border-gray wd-assignment-group">
          <div className="bg-secondary p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <BsGripVertical className="fs-3" />
              <FaChevronDown className="fs-6 text-muted" />
              <span className="fw-bold">ASSIGNMENTS</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Badge pill bg="light" text="dark" className="border">
                40% of Total
              </Badge>
              <FaPlus />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>

          <ListGroup className="rounded-0">
            {assignmentsForCourse.map((a: any) => (
              <ListGroupItem
                key={a._id}
                className="p-3 border-gray wd-assignment-item"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <BsGripVertical className="fs-3 text-secondary" />
                    <LuNotebookPen className="text-success fs-5" />

                    <div>
                      <Link
                        href={`/courses/${cid}/assignments/${a._id}`}
                        className="fw-bold text-dark text-decoration-none wd-assignment-title"
                      >
                        {a.title}
                      </Link>

                      <div className="small">
                        <span className="text-danger">Multiple Modules</span>
                        <span className="text-muted"> | </span>

                        <b>Not available until</b>{" "}
                        {formatCanvasLike(a.availableFrom)}

                        <span className="text-muted"> | </span>
                        <br />

                        <b>Due</b> {formatCanvasLike(a.due)}
                        <span className="text-muted"> | </span>

                        {a.points ?? 100} pts
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <GreenCheckmark />
                    <IoEllipsisVertical className="fs-4" />
                  </div>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
