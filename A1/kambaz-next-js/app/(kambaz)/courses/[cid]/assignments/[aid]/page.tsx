"use client";

import { useRef } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function AssignmentEditor() {
  const dueRef = useRef<HTMLInputElement | null>(null);
  const fromRef = useRef<HTMLInputElement | null>(null);
  const untilRef = useRef<HTMLInputElement | null>(null);

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current;
    if (!el) return;
    // modern browsers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyEl = el as any;
    if (typeof anyEl.showPicker === "function") anyEl.showPicker();
    else el.click();
  };

  return (
    <div id="wd-assignments-editor">
      <Form>
        {/* Name */}
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control defaultValue="A1 - ENV + HTML" />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-4" controlId="wd-description">
          <Form.Control
            as="textarea"
            rows={5}
            defaultValue="The assignment is available online Submit a link to the landing page of"
          />
        </Form.Group>

        {/* Points */}
        <Row className="mb-3 align-items-center">
          <Col md={3} className="text-md-end">
            <Form.Label htmlFor="wd-points" className="mb-0">
              Points
            </Form.Label>
          </Col>
          <Col md={9}>
            <Form.Control id="wd-points" defaultValue={100} />
          </Col>
        </Row>

        {/* Assignment Group */}
        <Row className="mb-3 align-items-center">
          <Col md={3} className="text-md-end">
            <Form.Label htmlFor="wd-assignment-group" className="mb-0">
              Assignment Group
            </Form.Label>
          </Col>
          <Col md={9}>
            <Form.Select id="wd-assignment-group" defaultValue="ASSIGNMENTS">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Display Grade */}
        <Row className="mb-4 align-items-center">
          <Col md={3} className="text-md-end">
            <Form.Label htmlFor="wd-display-grade-as" className="mb-0">
              Display Grade as
            </Form.Label>
          </Col>
          <Col md={9}>
            <Form.Select id="wd-display-grade-as" defaultValue="PERCENTAGE">
              <option value="PERCENTAGE">Percentage</option>
              <option value="POINTS">Points</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Submission Type */}
        <Row className="mb-4">
          <Col md={3} className="text-md-end">
            <Form.Label htmlFor="wd-submission-type" className="mb-0">
              Submission Type
            </Form.Label>
          </Col>
          <Col md={9}>
            <Form.Select id="wd-submission-type" defaultValue="ONLINE" className="mb-3">
              <option value="ONLINE">Online</option>
              <option value="ON_PAPER">On Paper</option>
              <option value="NO_SUBMISSIONS">No Submissions</option>
            </Form.Select>

            <div className="border p-3 rounded">
              <div className="fw-semibold mb-2">Online Entry Options</div>
              <Form.Check type="checkbox" id="wd-text-entry" label="Text Entry" className="mb-2" />
              <Form.Check type="checkbox" id="wd-website-url" label="Website URL" className="mb-2" />
              <Form.Check
                type="checkbox"
                id="wd-media-recordings"
                label="Media Recordings"
                className="mb-2"
              />
              <Form.Check
                type="checkbox"
                id="wd-student-annotation"
                label="Student Annotation"
                className="mb-2"
              />
              <Form.Check type="checkbox" id="wd-file-uploads" label="File Uploads" />
            </div>
          </Col>
        </Row>

        {/* Assign box */}
        <Row className="mb-4">
          <Col md={3} className="text-md-end">
            <Form.Label className="mb-0">Assign</Form.Label>
          </Col>

          <Col md={9}>
            <div className="border rounded p-3">
              {/* Assign to input with chip */}
              <div className="mb-3">
                <div className="fw-semibold mb-2">Assign to</div>

                <div className="border rounded px-2 py-2 d-flex align-items-center gap-2 flex-wrap">
                  <span className="bg-light border rounded px-2 py-1 d-inline-flex align-items-center gap-1">
                    Everyone
                    <IoClose className="text-secondary" style={{ cursor: "pointer" }} />
                  </span>
                </div>
              </div>

              {/* Due (ONE icon, clickable) */}
              <div className="mb-3">
                <div className="fw-semibold mb-2">Due</div>

                <InputGroup>
                  {/* visible (no native icon) */}
                  <Form.Control placeholder="mm/dd/yyyy --:-- --" />

                  {/* icon button */}
                  <InputGroup.Text
                    className="bg-light text-dark border"
                    style={{ cursor: "pointer" }}
                    onClick={() => openPicker(dueRef)}
                  >
                    <FaCalendarAlt />
                  </InputGroup.Text>
                </InputGroup>

                {/* hidden native picker */}
                <input
                  ref={dueRef}
                  type="datetime-local"
                  id="wd-due-date"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 1,
                    height: 1,
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Available from + Until (ONE icon each, clickable) */}
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="fw-semibold mb-2">Available from</div>

                  <InputGroup>
                    <Form.Control placeholder="mm/dd/yyyy --:-- --" />
                    <InputGroup.Text
                      className="bg-light text-dark border"
                      style={{ cursor: "pointer" }}
                      onClick={() => openPicker(fromRef)}
                    >
                      <FaCalendarAlt />
                    </InputGroup.Text>
                  </InputGroup>

                  <input
                    ref={fromRef}
                    type="datetime-local"
                    id="wd-available-from"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: 1,
                      height: 1,
                      pointerEvents: "none",
                    }}
                  />
                </Col>

                <Col md={6}>
                  <div className="fw-semibold mb-2">Until</div>

                  <InputGroup>
                    <Form.Control placeholder="mm/dd/yyyy --:-- --" />
                    <InputGroup.Text
                      className="bg-light text-dark border"
                      style={{ cursor: "pointer" }}
                      onClick={() => openPicker(untilRef)}
                    >
                      <FaCalendarAlt />
                    </InputGroup.Text>
                  </InputGroup>

                  <input
                    ref={untilRef}
                    type="datetime-local"
                    id="wd-available-until"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: 1,
                      height: 1,
                      pointerEvents: "none",
                    }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Save</Button>
        </div>
      </Form>
    </div>
  );
}
