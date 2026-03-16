"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import {
  Badge,
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import { FaPlus } from "react-icons/fa6";
import { FaSearch, FaChevronDown, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";

import GreenCheckmark from "../modules/GreenCheckmark";

import * as client from "../../client";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";
import { deleteAssignment, setAssignments } from "./reducer";

const formatCanvasLike = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${month} ${day} at ${hours}:${minutes}${ampm}`;
};

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );

  const fetchAssignments = async () => {
    const assignments = await client.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  };

  useEffect(() => {
    if (!cid) return;
    fetchAssignments();
  }, [cid]);

  const assignmentsForCourse = assignments;

  const onDelete = async (assignmentId: string) => {
    const ok = window.confirm("Are you sure you want to delete this assignment?");
    if (!ok) return;
    await client.deleteAssignment(assignmentId);
    dispatch(deleteAssignment(assignmentId));
  };

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
          <Button variant="secondary" className="me-2" id="wd-add-assignment-group">
            <FaPlus className="me-2" /> Group
          </Button>

          <Link
            href={`/courses/${cid}/assignments/new`}
            className="btn btn-danger"
            id="wd-add-assignment"
          >
            <FaPlus className="me-2" /> Assignment
          </Link>
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
                        <b>Not available until</b> {formatCanvasLike(a.availableFrom)}
                        <span className="text-muted"> | </span>
                        <br />
                        <b>Due</b> {formatCanvasLike(a.due)}
                        <span className="text-muted"> | </span>
                        {a.points ?? 100} pts
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <FaTrash
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(a._id);
                      }}
                      title="Delete assignment"
                    />
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