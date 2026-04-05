"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import * as client from "../../../client";

const formatCanvasLike = (iso?: string) => {
  if (!iso) return "Not set";
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

export default function QuizDetailsPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as { currentUser: any };

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadQuiz = async () => {
    if (!qid) return;
    setLoading(true);
    try {
      const data = await client.findQuizById(qid);
      setQuiz(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [qid]);

  if (loading) {
    return <div className="p-3">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-3">Quiz not found.</div>;
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{quiz.title}</h3>

        {isFaculty && (
          <div className="d-flex gap-2">
            <Link
              href={`/courses/${cid}/quizzes/${qid}/preview`}
              className="btn btn-secondary"
            >
              Preview
            </Link>
            <Link
              href={`/courses/${cid}/quizzes/${qid}/editor`}
              className="btn btn-secondary"
            >
              Edit
            </Link>
          </div>
        )}
      </div>

      <div className="border p-3 mb-3">
        <p>
          <b>Quiz Type</b>: {quiz.quizType || "Graded Quiz"}
        </p>
        <p>
          <b>Points</b>: {quiz.points ?? 0}
        </p>
        <p>
          <b>Assignment Group</b>: {quiz.assignmentGroup || "Quizzes"}
        </p>
        <p>
          <b>Shuffle Answers</b>: {quiz.shuffleAnswers ? "Yes" : "No"}
        </p>
        <p>
          <b>Time Limit</b>:{" "}
          {quiz.timeLimit !== null && quiz.timeLimit !== undefined
            ? `${quiz.timeLimit} Minutes`
            : "No time limit"}
        </p>
        <p>
          <b>Multiple Attempts</b>: {quiz.multipleAttempts ? "Yes" : "No"}
        </p>
        <p>
          <b>How Many Attempts</b>: {quiz.howManyAttempts ?? 1}
        </p>
        <p>
          <b>Show Correct Answers</b>: {quiz.showCorrectAnswers || "Always"}
        </p>
        <p>
          <b>Access Code</b>: {quiz.accessCode ? quiz.accessCode : "None"}
        </p>
        <p>
          <b>One Question at a Time</b>:{" "}
          {quiz.oneQuestionAtATime ? "Yes" : "No"}
        </p>
        <p>
          <b>Webcam Required</b>: {quiz.webcamRequired ? "Yes" : "No"}
        </p>
        <p>
          <b>Lock Questions After Answering</b>:{" "}
          {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
        </p>
        <p>
          <b>Due Date</b>: {formatCanvasLike(quiz.dueDate)}
        </p>
        <p>
          <b>Available Date</b>: {formatCanvasLike(quiz.availableDate)}
        </p>
        <p>
          <b>Until Date</b>: {formatCanvasLike(quiz.untilDate)}
        </p>
        <p>
          <b>Published</b>: {quiz.published ? "Yes" : "No"}
        </p>
        <p>
          <b>Questions</b>: {quiz.questions?.length ?? 0}
        </p>
      </div>

      {!isFaculty && (
        <div className="d-flex justify-content-end">
          <Link
            href={`/courses/${cid}/quizzes/${qid}/preview`}
            className="btn btn-danger"
          >
            Start Quiz
          </Link>
        </div>
      )}
    </div>
  );
}