"use client";

import { useParams } from "next/navigation";
import { Button, FormControl, InputGroup, ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../modules/GreenCheckmark";
import { LuNotebookPen } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();

  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: 320 }}>
          <InputGroup.Text className="bg-white">
            <FaSearch />
          </InputGroup.Text>
          <FormControl placeholder="Search for Assignments" id="wd-search-assignment" />
        </InputGroup>

        <div className="text-nowrap">
          <Button variant="secondary" className="me-2" id="wd-add-assignment-group">
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
            <ListGroupItem className="p-3 border-gray wd-assignment-item">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <BsGripVertical className="fs-3 text-secondary" />
                  <LuNotebookPen  className="text-success fs-5" />

                  <div>
                    <Link
                      href={`/courses/${cid}/assignments/123`}
                      className="fw-bold text-dark text-decoration-none wd-assignment-title"
                    >
                      A1
                    </Link>

                    <div className="small">
                      <span className="text-danger">Multiple Modules</span>
                      <span className="text-muted"> | </span>
                      <b>Not available until</b> May 6 at 12:00am
                      <span className="text-muted"> | </span>
                      <br />
                      <b>Due</b> May 13 at 11:59pm <span className="text-muted">|</span> 100 pts
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <GreenCheckmark />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
            </ListGroupItem>

            <ListGroupItem className="p-3 border-gray wd-assignment-item">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <BsGripVertical className="fs-3 text-secondary" />
                  <LuNotebookPen  className="text-success fs-5" />

                  <div>
                    <Link
                      href={`/courses/${cid}/assignments/123`}
                      className="fw-bold text-dark text-decoration-none wd-assignment-title"
                    >
                      A2
                    </Link>

                    <div className="small">
                      <span className="text-danger">Multiple Modules</span>
                      <span className="text-muted"> | </span>
                      <b>Not available until</b> May 13 at 12:00am
                      <span className="text-muted"> | </span>
                      <br />
                      <b>Due</b> May 20 at 11:59pm <span className="text-muted">|</span> 100 pts
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <GreenCheckmark />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
            </ListGroupItem>

            <ListGroupItem className="p-3 border-gray wd-assignment-item">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <BsGripVertical className="fs-3 text-secondary" />
                  <LuNotebookPen  className="text-success fs-5" />

                  <div>
                    <Link
                      href={`/courses/${cid}/assignments/123`}
                      className="fw-bold text-dark text-decoration-none wd-assignment-title"
                    >
                      A3
                    </Link>

                    <div className="small">
                      <span className="text-danger">Multiple Modules</span>
                      <span className="text-muted"> | </span>
                      <b>Not available until</b> May 20 at 12:00am
                      <span className="text-muted"> | </span>
                      <br />
                      <b>Due</b> May 27 at 11:59pm <span className="text-muted">|</span> 100 pts
                    </div>
                  </div>
                </div>

                {/* right side: check + dots */}
                <div className="d-flex align-items-center gap-2">
                  <GreenCheckmark />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
