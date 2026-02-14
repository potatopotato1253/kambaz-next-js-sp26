'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useRef } from 'react';
import * as db from '../../../../database';

import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

type Assignment = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  due?: string; // ISO-like string
  availableFrom?: string;
  availableUntil?: string;
};

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();

  const assignment = useMemo(() => {
    return (db.assignments as Assignment[]).find(
      (a) => a._id === aid && a.course === cid
    );
  }, [aid, cid]);

  const dueRef = useRef<HTMLInputElement | null>(null);
  const fromRef = useRef<HTMLInputElement | null>(null);
  const untilRef = useRef<HTMLInputElement | null>(null);

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current;
    if (!el) return;

    const anyEl = el as any;
    if (typeof anyEl.showPicker === 'function') anyEl.showPicker();
    else el.click();
  };

  if (!assignment) {
    return <div id="wd-assignments-editor">Assignment not found.</div>;
  }

  const backHref = `/courses/${cid}/assignments`;

  return (
    <div id="wd-assignments-editor">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control defaultValue={assignment.title} />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-description">
          <Form.Control
            as="textarea"
            rows={5}
            defaultValue={assignment.description ?? ''}
            placeholder="Add description here..."
          />
        </Form.Group>

        <Row className="mb-3 align-items-center">
          <Col md={3} className="text-md-end">
            <Form.Label htmlFor="wd-points" className="mb-0">
              Points
            </Form.Label>
          </Col>
          <Col md={9}>
            <Form.Control
              id="wd-points"
              type="number"
              defaultValue={assignment.points ?? 100}
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={3} className="text-md-end">
            <Form.Label className="mb-0">Assign</Form.Label>
          </Col>

          <Col md={9}>
            <div className="border rounded p-3">
              <div className="mb-3">
                <div className="fw-semibold mb-2">Assign to</div>

                <div className="border rounded px-2 py-2 d-flex align-items-center gap-2 flex-wrap">
                  <span className="bg-light border rounded px-2 py-1 d-inline-flex align-items-center gap-1">
                    Everyone
                    <IoClose className="text-secondary" style={{ cursor: 'pointer' }} />
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="fw-semibold mb-2">Due</div>

                <InputGroup>
                  <Form.Control
                    id="wd-due-date-input"
                    type="datetime-local"
                    defaultValue={assignment.due ?? ''}
                  />
                  <InputGroup.Text
                    className="bg-light text-dark border"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openPicker(dueRef)}
                  >
                    <FaCalendarAlt />
                  </InputGroup.Text>
                </InputGroup>

                <input
                  ref={dueRef}
                  type="datetime-local"
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: 1,
                    height: 1,
                    pointerEvents: 'none',
                  }}
                />
              </div>

              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="fw-semibold mb-2">Available from</div>

                  <InputGroup>
                    <Form.Control
                      id="wd-available-from-input"
                      type="datetime-local"
                      defaultValue={assignment.availableFrom ?? ''}
                    />
                    <InputGroup.Text
                      className="bg-light text-dark border"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openPicker(fromRef)}
                    >
                      <FaCalendarAlt />
                    </InputGroup.Text>
                  </InputGroup>

                  <input
                    ref={fromRef}
                    type="datetime-local"
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: 1,
                      height: 1,
                      pointerEvents: 'none',
                    }}
                  />
                </Col>

                <Col md={6}>
                  <div className="fw-semibold mb-2">Until</div>

                  <InputGroup>
                    <Form.Control
                      id="wd-available-until-input"
                      type="datetime-local"
                      defaultValue={assignment.availableUntil ?? ''}
                    />
                    <InputGroup.Text
                      className="bg-light text-dark border"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openPicker(untilRef)}
                    >
                      <FaCalendarAlt />
                    </InputGroup.Text>
                  </InputGroup>

                  <input
                    ref={untilRef}
                    type="datetime-local"
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: 1,
                      height: 1,
                      pointerEvents: 'none',
                    }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2">
          <Link href={backHref} className="btn btn-secondary">
            Cancel
          </Link>
          <Link href={backHref} className="btn btn-danger">
            Save
          </Link>
        </div>
      </Form>
    </div>
  );
}
