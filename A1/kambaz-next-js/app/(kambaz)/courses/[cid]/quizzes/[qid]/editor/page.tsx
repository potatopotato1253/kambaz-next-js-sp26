"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Form, Nav, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../store";
import * as client from "../../../../client";

export default function QuizEditorPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as { currentUser: any };

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quizType, setQuizType] = useState("Graded Quiz");
  const [points, setPoints] = useState(0);
  const [assignmentGroup, setAssignmentGroup] = useState("Quizzes");
  const [shuffleAnswers, setShuffleAnswers] = useState(true);

  const [hasTimeLimit, setHasTimeLimit] = useState(true);
  const [timeLimit, setTimeLimit] = useState(20);

  const [multipleAttempts, setMultipleAttempts] = useState(false);
  const [howManyAttempts, setHowManyAttempts] = useState(1);

  const [showCorrectAnswers, setShowCorrectAnswers] = useState("Always");
  const [accessCode, setAccessCode] = useState("");
  const [oneQuestionAtATime, setOneQuestionAtATime] = useState(true);
  const [webcamRequired, setWebcamRequired] = useState(false);
  const [lockQuestionsAfterAnswering, setLockQuestionsAfterAnswering] =
    useState(false);

  const [dueDate, setDueDate] = useState("");
  const [availableDate, setAvailableDate] = useState("");
  const [untilDate, setUntilDate] = useState("");

  const toDateTimeLocal = (value?: string) => {
    if (!value) return "";
    const d = new Date(value);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const loadQuiz = async () => {
    if (!qid) return;
    setLoading(true);
    try {
      const data = await client.findQuizById(qid);

      setQuiz(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setQuizType(data.quizType || "Graded Quiz");
      setPoints(data.points || 0);
      setAssignmentGroup(data.assignmentGroup || "Quizzes");
      setShuffleAnswers(
        data.shuffleAnswers !== undefined ? data.shuffleAnswers : true
      );

      if (data.timeLimit !== null && data.timeLimit !== undefined) {
        setHasTimeLimit(true);
        setTimeLimit(data.timeLimit || 20);
      } else {
        setHasTimeLimit(false);
        setTimeLimit(20);
      }

      setMultipleAttempts(data.multipleAttempts || false);
      setHowManyAttempts(data.howManyAttempts || 1);
      setShowCorrectAnswers(data.showCorrectAnswers || "Always");
      setAccessCode(data.accessCode || "");
      setOneQuestionAtATime(
        data.oneQuestionAtATime !== undefined ? data.oneQuestionAtATime : true
      );
      setWebcamRequired(data.webcamRequired || false);
      setLockQuestionsAfterAnswering(data.lockQuestionsAfterAnswering || false);

      setDueDate(toDateTimeLocal(data.dueDate));
      setAvailableDate(toDateTimeLocal(data.availableDate));
      setUntilDate(toDateTimeLocal(data.untilDate));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [qid]);

  if (!isFaculty) {
    return (
      <div className="p-3">
        <h4>Access denied</h4>
        <p>Only faculty can edit quizzes.</p>
      </div>
    );
  }

  const onSave = async () => {
    if (!quiz) return;

    const updatedQuiz = {
      ...quiz,
      title,
      description,
      quizType,
      points,
      assignmentGroup,
      shuffleAnswers,
      timeLimit: hasTimeLimit ? timeLimit : null,
      multipleAttempts,
      howManyAttempts: multipleAttempts ? howManyAttempts : 1,
      showCorrectAnswers,
      accessCode,
      oneQuestionAtATime,
      webcamRequired,
      lockQuestionsAfterAnswering,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      availableDate: availableDate ? new Date(availableDate).toISOString() : null,
      untilDate: untilDate ? new Date(untilDate).toISOString() : null,
    };

    await client.updateQuiz(updatedQuiz);
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const onCancel = () => {
    router.push(`/courses/${cid}/quizzes`);
  };

  if (loading) {
    return <div className="p-3">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-3">Quiz not found.</div>;
  }

  return (
    <div id="wd-quiz-editor" className="p-3">
      <Nav className="mb-4 nav nav-tabs">
        <Nav.Item>
          <Nav.Link active>Details</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} href={`/courses/${cid}/quizzes/${qid}/editor/questions`}>
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Quiz Type</Form.Label>
              <Form.Select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
              >
                <option>Graded Quiz</option>
                <option>Practice Quiz</option>
                <option>Graded Survey</option>
                <option>Ungraded Survey</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Assignment Group</Form.Label>
              <Form.Select
                value={assignmentGroup}
                onChange={(e) => setAssignmentGroup(e.target.value)}
              >
                <option>Quizzes</option>
                <option>Exams</option>
                <option>Assignments</option>
                <option>Project</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mb-4">
          <Form.Check
            type="checkbox"
            label="Shuffle Answers"
            checked={shuffleAnswers}
            onChange={(e) => setShuffleAnswers(e.target.checked)}
            className="mb-2"
          />

          <Form.Check
            type="checkbox"
            label="Time Limit"
            checked={hasTimeLimit}
            onChange={(e) => setHasTimeLimit(e.target.checked)}
            className="mb-2"
          />
          {hasTimeLimit && (
            <Form.Group className="mb-3 ms-4" style={{ maxWidth: 250 }}>
              <Form.Label>Minutes</Form.Label>
              <Form.Control
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />
            </Form.Group>
          )}

          <Form.Check
            type="checkbox"
            label="Multiple Attempts"
            checked={multipleAttempts}
            onChange={(e) => setMultipleAttempts(e.target.checked)}
            className="mb-2"
          />
          {multipleAttempts && (
            <Form.Group className="mb-3 ms-4" style={{ maxWidth: 250 }}>
              <Form.Label>How Many Attempts</Form.Label>
              <Form.Control
                type="number"
                value={howManyAttempts}
                onChange={(e) => setHowManyAttempts(Number(e.target.value))}
              />
            </Form.Group>
          )}

          <Form.Check
            type="checkbox"
            label="One Question at a Time"
            checked={oneQuestionAtATime}
            onChange={(e) => setOneQuestionAtATime(e.target.checked)}
            className="mb-2"
          />
          <Form.Check
            type="checkbox"
            label="Webcam Required"
            checked={webcamRequired}
            onChange={(e) => setWebcamRequired(e.target.checked)}
            className="mb-2"
          />
          <Form.Check
            type="checkbox"
            label="Lock Questions After Answering"
            checked={lockQuestionsAfterAnswering}
            onChange={(e) => setLockQuestionsAfterAnswering(e.target.checked)}
          />
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Show Correct Answers</Form.Label>
          <Form.Select
            value={showCorrectAnswers}
            onChange={(e) => setShowCorrectAnswers(e.target.value)}
          >
            <option>Always</option>
            <option>After Due Date</option>
            <option>Never</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Access Code</Form.Label>
          <Form.Control
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
        </Form.Group>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Available Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Until Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={untilDate}
                onChange={(e) => setUntilDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onSave}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}