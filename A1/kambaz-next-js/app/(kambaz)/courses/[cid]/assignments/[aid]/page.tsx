"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateAssignment } from "../reducer";
import * as client from "../../../client";

import { Button, Col, Form, Row } from "react-bootstrap";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const [assignment, setAssignment] = useState<any>(null);

  const fetchAssignment = async () => {
    const found = await client.findAssignmentById(aid);
    setAssignment(found);
  };

  useEffect(() => {
    if (!aid) return;
    fetchAssignment();
  }, [aid]);

  if (!assignment) return <div id="wd-assignments-editor">Assignment not found.</div>;

  const save = async () => {
    const updated = await client.updateAssignment(assignment);
    dispatch(updateAssignment(updated));
    router.push(`/courses/${cid}/assignments`);
  };

  const cancel = () => {
    router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-3">
      <h2 className="mb-3">Assignment Editor</h2>
      <hr />

      <Form>
        <Form.Group className="mb-3" controlId="wd-assignment-name">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control
            value={assignment.title}
            onChange={(e) =>
              setAssignment({ ...assignment, title: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-assignment-description">
          <Form.Control
            as="textarea"
            rows={5}
            value={assignment.description ?? ""}
            onChange={(e) =>
              setAssignment({ ...assignment, description: e.target.value })
            }
          />
        </Form.Group>

        <Row className="mb-3 align-items-center">
          <Col md={2} className="text-md-end">
            <Form.Label className="mb-0">Points</Form.Label>
          </Col>
          <Col md={10}>
            <Form.Control
              type="number"
              value={assignment.points ?? 100}
              onChange={(e) =>
                setAssignment({ ...assignment, points: Number(e.target.value) })
              }
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={2} className="text-md-end">
            <Form.Label className="mb-0">Assign</Form.Label>
          </Col>

          <Col md={10}>
            <div className="border rounded p-3">
              <div className="mb-3">
                <div className="fw-semibold mb-1">Due</div>
                <Form.Control
                  type="datetime-local"
                  value={assignment.due ?? ""}
                  onChange={(e) =>
                    setAssignment({ ...assignment, due: e.target.value })
                  }
                />
              </div>

              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="fw-semibold mb-1">Available from</div>
                  <Form.Control
                    type="datetime-local"
                    value={assignment.availableFrom ?? ""}
                    onChange={(e) =>
                      setAssignment({
                        ...assignment,
                        availableFrom: e.target.value,
                      })
                    }
                  />
                </Col>

                <Col md={6}>
                  <div className="fw-semibold mb-1">Until</div>
                  <Form.Control
                    type="datetime-local"
                    value={assignment.availableUntil ?? ""}
                    onChange={(e) =>
                      setAssignment({
                        ...assignment,
                        availableUntil: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={save}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}