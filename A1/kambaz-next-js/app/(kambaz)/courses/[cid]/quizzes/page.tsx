"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Dropdown,
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaBan,
  FaCheckCircle,
} from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import * as client from "../../client";

type Quiz = {
  _id: string;
  course: string;
  title: string;
  description?: string;
  quizType?: string;
  assignmentGroup?: string;
  points: number;
  shuffleAnswers?: boolean;
  timeLimit?: number | null;
  multipleAttempts?: boolean;
  howManyAttempts?: number;
  showCorrectAnswers?: string;
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  published: boolean;
  questions?: any[];
  score?: number | null;
};

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

const availabilityLabel = (quiz: Quiz) => {
  const now = new Date();
  const from = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const until = quiz.untilDate ? new Date(quiz.untilDate) : null;

  if (from && now < from) {
    return `Not available until ${formatCanvasLike(quiz.availableDate)}`;
  }
  if (until && now > until) {
    return "Closed";
  }
  return "Available";
};

export default function QuizzesPage() {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as { currentUser: any };

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const fetchQuizzes = async () => {
    if (!cid) return;
    const data = await client.findQuizzesForCourse(cid);

    const visibleQuizzes = isFaculty
      ? data
      : data.filter((quiz: Quiz) => quiz.published);

    setQuizzes(visibleQuizzes);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) =>
      q.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [quizzes, search]);

  const onAddQuiz = async () => {
    if (!cid) return;

    const newQuiz = {
      title: "New Quiz",
      description: "",
      quizType: "Graded Quiz",
      assignmentGroup: "Quizzes",
      points: 0,
      shuffleAnswers: true,
      timeLimit: 20,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: "Always",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      dueDate: null,
      availableDate: null,
      untilDate: null,
      published: false,
      questions: [],
    };

    const createdQuiz = await client.createQuiz(cid, newQuiz);
    setQuizzes((prev) => [createdQuiz, ...prev]);
    router.push(`/courses/${cid}/quizzes/${createdQuiz._id}/editor`);
  };

  const onDeleteQuiz = async (quizId: string) => {
    const ok = window.confirm("Are you sure you want to delete this quiz?");
    if (!ok) return;

    await client.deleteQuiz(quizId);
    setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
  };

  const onTogglePublish = async (quiz: Quiz) => {
    const updatedQuiz = {
      ...quiz,
      published: !quiz.published,
    };

    const savedQuiz = await client.updateQuiz(updatedQuiz);

    setQuizzes((prev) =>
      prev.map((q) => (q._id === savedQuiz._id ? savedQuiz : q))
    );
  };

  const onEditQuiz = (quizId: string) => {
    router.push(`/courses/${cid}/quizzes/${quizId}/editor`);
  };

  return (
    <div id="wd-quizzes">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: 340 }}>
          <InputGroup.Text className="bg-white">
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            placeholder="Search for Quiz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        {isFaculty && (
          <div className="d-flex align-items-center gap-2">
            <Button variant="danger" onClick={onAddQuiz}>
              <FaPlus className="me-2" />
              Quiz
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="border"
                size="sm"
                id="wd-quizzes-top-menu"
              >
                <IoEllipsisVertical />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>Quiz options</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem className="p-0 mb-3 border-gray">
          <div className="bg-light p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <BsGripVertical className="fs-3" />
              <FaChevronDown className="fs-6 text-muted" />
              <span className="fw-bold">ASSIGNMENT QUIZZES</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Badge pill bg="light" text="dark" className="border">
                {filteredQuizzes.length}
              </Badge>
            </div>
          </div>

          {filteredQuizzes.length === 0 ? (
            <div className="p-3 text-muted">
              {isFaculty ? (
                <>
                  No quizzes yet. Click <strong>+ Quiz</strong> to create one.
                </>
              ) : (
                <>No quizzes available.</>
              )}
            </div>
          ) : (
            <ListGroup className="rounded-0">
              {filteredQuizzes.map((quiz) => (
                <ListGroupItem key={quiz._id} className="p-3 border-gray">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <BsGripVertical className="fs-3 text-secondary" />

                      <div>
                        <Link
                          href={`/courses/${cid}/quizzes/${quiz._id}`}
                          className="fw-bold text-dark text-decoration-none"
                        >
                          {quiz.title}
                        </Link>

                        <div className="small text-muted">
                          <span>{availabilityLabel(quiz)}</span>
                          <span className="text-muted"> | </span>
                          <b>Due</b> {formatCanvasLike(quiz.dueDate) || "No due date"}
                          <span className="text-muted"> | </span>
                          {quiz.points ?? 0} pts
                          <span className="text-muted"> | </span>
                          {quiz.questions?.length ?? 0} Questions
                          {!isFaculty &&
                            quiz.score !== null &&
                            quiz.score !== undefined && (
                              <>
                                <span className="text-muted"> | </span>
                                Score: {quiz.score}
                              </>
                            )}
                        </div>
                      </div>
                    </div>

                    {isFaculty && (
                      <div className="d-flex align-items-center gap-3">
                        <span
                          onClick={() => onTogglePublish(quiz)}
                          style={{ cursor: "pointer" }}
                          title={quiz.published ? "Unpublish quiz" : "Publish quiz"}
                        >
                          {quiz.published ? (
                            <FaCheckCircle className="text-success fs-5" />
                          ) : (
                            <FaBan className="text-danger fs-5" />
                          )}
                        </span>

                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="light"
                            size="sm"
                            className="border-0 bg-white shadow-none"
                          >
                            <IoEllipsisVertical className="fs-5" />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => onEditQuiz(quiz._id)}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => onDeleteQuiz(quiz._id)}>
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => onTogglePublish(quiz)}>
                              {quiz.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}