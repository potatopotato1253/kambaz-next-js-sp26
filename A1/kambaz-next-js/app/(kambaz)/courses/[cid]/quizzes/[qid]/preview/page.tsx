"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Form, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../store";
import * as client from "../../../../client";

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

const formatTimer = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const shuffleArray = <T,>(arr: T[]) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function QuizPreviewPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as { currentUser: any };

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [savingAttempt, setSavingAttempt] = useState(false);

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [answeredLocked, setAnsweredLocked] = useState<Record<string, boolean>>(
    {}
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [displayQuestions, setDisplayQuestions] = useState<any[]>([]);

  const [enteredAccessCode, setEnteredAccessCode] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessError, setAccessError] = useState("");

  const [lastAttempt, setLastAttempt] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [attemptError, setAttemptError] = useState("");

  const loadQuiz = async () => {
    if (!qid) return;
    setLoading(true);

    try {
      const data = await client.findQuizById(qid);
      setQuiz(data);

      const baseQuestions = data?.questions || [];
      const preparedQuestions = baseQuestions.map((q: any) => {
        if (q.type === "Multiple Choice" && data?.shuffleAnswers) {
          return {
            ...q,
            choices: shuffleArray(q.choices || []),
          };
        }
        return q;
      });
      setDisplayQuestions(preparedQuestions);

      if (
        data?.timeLimit !== null &&
        data?.timeLimit !== undefined &&
        Number(data.timeLimit) > 0
      ) {
        setSecondsLeft(Number(data.timeLimit) * 60);
      } else {
        setSecondsLeft(null);
      }

      const quizNeedsAccessCode =
        !isFaculty && !!data?.accessCode?.toString().trim();

      setAccessGranted(!quizNeedsAccessCode);
      setAccessError("");
      setEnteredAccessCode("");
      setAttemptError("");

      if (!isFaculty && currentUser?._id) {
        const [last, countResult] = await Promise.all([
          client.findLastQuizAttempt(qid, currentUser._id),
          client.countQuizAttempts(qid, currentUser._id),
        ]);

        const count = countResult?.count || 0;
        setLastAttempt(last);
        setAttemptCount(count);

        const maxAttempts = data.multipleAttempts
          ? Number(data.howManyAttempts) || 1
          : 1;

        const allowed = count < maxAttempts;
        setCanTakeQuiz(allowed);

        if (last && !allowed) {
          setAnswers(last.answers || {});
          setSubmitted(true);
        } else {
          setAnswers({});
          setSubmitted(false);
        }
      } else {
        setLastAttempt(null);
        setAttemptCount(0);
        setCanTakeQuiz(true);
      }
    } catch (e: any) {
      setAttemptError(e?.response?.data?.message || "Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [qid]);

  const lockAfterAnswer = !!quiz?.lockQuestionsAfterAnswering;
  const showOneAtATime =
    quiz?.oneQuestionAtATime !== undefined ? quiz.oneQuestionAtATime : true;
  const showCorrectAnswers = quiz?.showCorrectAnswers !== "Never";

  const isQuestionLocked = (questionId: string) => {
    if (submitted) return true;
    if (!lockAfterAnswer) return false;
    return !!answeredLocked[questionId];
  };

  const markLocked = (questionId: string) => {
    if (!lockAfterAnswer) return;
    setAnsweredLocked((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleMultipleChoice = (questionId: string, choiceText: string) => {
    if (isQuestionLocked(questionId)) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceText,
    }));
    markLocked(questionId);
  };

  const handleTrueFalse = (questionId: string, value: boolean) => {
    if (isQuestionLocked(questionId)) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    markLocked(questionId);
  };

  const handleFillBlank = (questionId: string, value: string) => {
    if (submitted) return;
    if (isQuestionLocked(questionId)) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const blurFillBlank = (questionId: string) => {
    if ((answers[questionId] ?? "").toString().trim() !== "") {
      markLocked(questionId);
    }
  };

  const calculateScore = () => {
    if (!displayQuestions.length) return 0;

    let total = 0;

    for (const question of displayQuestions) {
      const userAnswer = answers[question._id];

      if (question.type === "Multiple Choice") {
        const correctChoice = question.choices?.find((c: any) => c.correct);
        if (correctChoice && userAnswer === correctChoice.text) {
          total += Number(question.points) || 0;
        }
      }

      if (question.type === "True/False") {
        if (userAnswer === question.answer) {
          total += Number(question.points) || 0;
        }
      }

      if (question.type === "Fill in the Blank") {
        const acceptableAnswers = (question.answers || []).map((a: string) =>
          a.trim().toLowerCase()
        );
        if (
          typeof userAnswer === "string" &&
          acceptableAnswers.includes(userAnswer.trim().toLowerCase())
        ) {
          total += Number(question.points) || 0;
        }
      }
    }

    return total;
  };

  const isCorrect = (question: any) => {
    const userAnswer = answers[question._id];

    if (question.type === "Multiple Choice") {
      const correctChoice = question.choices?.find((c: any) => c.correct);
      return !!correctChoice && userAnswer === correctChoice.text;
    }

    if (question.type === "True/False") {
      return userAnswer === question.answer;
    }

    if (question.type === "Fill in the Blank") {
      const acceptableAnswers = (question.answers || []).map((a: string) =>
        a.trim().toLowerCase()
      );
      return (
        typeof userAnswer === "string" &&
        acceptableAnswers.includes(userAnswer.trim().toLowerCase())
      );
    }

    return false;
  };

  const unlockQuizWithCode = () => {
    const expected = quiz?.accessCode?.toString().trim() || "";
    const entered = enteredAccessCode.trim();

    if (entered === expected) {
      setAccessGranted(true);
      setAccessError("");
    } else {
      setAccessGranted(false);
      setAccessError("Incorrect access code.");
    }
  };

  const onSubmitQuiz = async () => {
    if (savingAttempt) return;

    if (isFaculty) {
      setSubmitted(true);
      return;
    }

    if (!currentUser?._id) return;
    if (!canTakeQuiz) return;

    try {
      setSavingAttempt(true);
      setAttemptError("");

      const savedAttempt = await client.submitQuizAttempt(qid, {
        user: currentUser._id,
        answers,
      });

      setLastAttempt(savedAttempt);

      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      const maxAttempts = quiz?.multipleAttempts
        ? Number(quiz?.howManyAttempts) || 1
        : 1;

      setCanTakeQuiz(newAttemptCount < maxAttempts);
      setSubmitted(true);
    } catch (e: any) {
      setAttemptError(
        e?.response?.data?.message || "Failed to save quiz attempt."
      );
    } finally {
      setSavingAttempt(false);
    }
  };

  useEffect(() => {
    if (submitted) return;
    if (secondsLeft === null) return;
    if (!accessGranted) return;

    if (secondsLeft <= 0) {
      onSubmitQuiz();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, submitted, accessGranted]);

  const questionsToRender = showOneAtATime
    ? displayQuestions.slice(currentQuestionIndex, currentQuestionIndex + 1)
    : displayQuestions;

  const canGoPrev = currentQuestionIndex > 0;
  const canGoNext = currentQuestionIndex < displayQuestions.length - 1;

  const totalQuizPoints = useMemo(() => {
    if (quiz?.points !== undefined && quiz?.points !== null) {
      return Number(quiz.points) || 0;
    }
    return displayQuestions.reduce(
      (sum, q) => sum + (Number(q.points) || 0),
      0
    );
  }, [quiz, displayQuestions]);

  if (loading) {
    return <div className="p-3">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-3">Quiz not found.</div>;
  }

  const needsAccessCode = !isFaculty && !!quiz?.accessCode?.toString().trim();

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">{quiz.title}</h3>
          <div className="text-muted small">
            Available: {formatCanvasLike(quiz.availableDate)}
          </div>
          <div className="text-muted small">
            Due: {formatCanvasLike(quiz.dueDate)}
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {secondsLeft !== null && !submitted && accessGranted && (
            <div className="border rounded px-3 py-2 fw-bold">
              Time Left: {formatTimer(secondsLeft)}
            </div>
          )}

          {isFaculty && (
            <Link
              href={`/courses/${cid}/quizzes/${qid}/editor`}
              className="btn btn-secondary"
            >
              Edit Quiz
            </Link>
          )}
        </div>
      </div>

      {quiz.description && (
        <div className="border p-3 mb-4">
          <h5>Quiz Instructions</h5>
          <div>{quiz.description}</div>
        </div>
      )}

      {attemptError && <Alert variant="danger">{attemptError}</Alert>}

      {needsAccessCode && !accessGranted && (
        <div className="border rounded p-4 mb-4" style={{ maxWidth: 420 }}>
          <h5 className="mb-3">Access Code Required</h5>
          <p className="text-muted small">
            Enter the access code to start this quiz.
          </p>

          {accessError && <Alert variant="danger">{accessError}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Access Code</Form.Label>
            <Form.Control
              type="password"
              value={enteredAccessCode}
              onChange={(e) => setEnteredAccessCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  unlockQuizWithCode();
                }
              }}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              type="button"
              variant="danger"
              onClick={unlockQuizWithCode}
            >
              Start Quiz
            </Button>
          </div>
        </div>
      )}

      {!isFaculty && !canTakeQuiz && lastAttempt && (
        <Alert variant="secondary" className="mb-3">
          You have used all allowed attempts for this quiz. Showing your last
          submitted attempt.
        </Alert>
      )}

      {(!needsAccessCode || accessGranted) && (
        <>
          {displayQuestions.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-4">
              {displayQuestions.map((question: any, index: number) => {
                const answered = answers[question._id] !== undefined;
                return (
                  <Button
                    key={question._id}
                    type="button"
                    variant={index === currentQuestionIndex ? "danger" : "light"}
                    className="border"
                    size="sm"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                    {answered ? " •" : ""}
                  </Button>
                );
              })}
            </div>
          )}

          {displayQuestions.length === 0 ? (
            <div className="alert alert-secondary">
              No questions in this quiz yet.
            </div>
          ) : (
            <div className="mb-3">
              {questionsToRender.map((question: any) => {
                const actualIndex = displayQuestions.findIndex(
                  (q) => q._id === question._id
                );
                const locked = isQuestionLocked(question._id);

                return (
                  <div key={question._id} className="border p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Question {actualIndex + 1}</h5>
                      <span className="small text-muted">
                        {Number(question.points) || 0} pts
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="fw-bold">{question.title}</div>
                      <div>{question.question}</div>
                    </div>

                    {question.type === "Multiple Choice" && (
                      <div>
                        {question.choices?.map((choice: any, choiceIndex: number) => {
                          const isUserChoice =
                            answers[question._id] === choice.text;
                          const isChoiceCorrect = choice.correct;

                          return (
                            <div
                              key={choiceIndex}
                              className={`p-2 rounded mb-2 ${
                                submitted && showCorrectAnswers && isChoiceCorrect
                                  ? "border border-success"
                                  : submitted &&
                                    showCorrectAnswers &&
                                    isUserChoice &&
                                    !isChoiceCorrect
                                  ? "border border-danger"
                                  : ""
                              }`}
                            >
                              <Form.Check
                                type="radio"
                                name={`question-${question._id}`}
                                label={choice.text}
                                checked={isUserChoice}
                                onChange={() =>
                                  handleMultipleChoice(question._id, choice.text)
                                }
                                disabled={locked}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {question.type === "True/False" && (
                      <div>
                        <div
                          className={`p-2 rounded mb-2 ${
                            submitted &&
                            showCorrectAnswers &&
                            question.answer === true
                              ? "border border-success"
                              : submitted &&
                                showCorrectAnswers &&
                                answers[question._id] === true &&
                                question.answer !== true
                              ? "border border-danger"
                              : ""
                          }`}
                        >
                          <Form.Check
                            type="radio"
                            name={`question-${question._id}`}
                            label="True"
                            checked={answers[question._id] === true}
                            onChange={() => handleTrueFalse(question._id, true)}
                            disabled={locked}
                          />
                        </div>

                        <div
                          className={`p-2 rounded ${
                            submitted &&
                            showCorrectAnswers &&
                            question.answer === false
                              ? "border border-success"
                              : submitted &&
                                showCorrectAnswers &&
                                answers[question._id] === false &&
                                question.answer !== false
                              ? "border border-danger"
                              : ""
                          }`}
                        >
                          <Form.Check
                            type="radio"
                            name={`question-${question._id}`}
                            label="False"
                            checked={answers[question._id] === false}
                            onChange={() =>
                              handleTrueFalse(question._id, false)
                            }
                            disabled={locked}
                          />
                        </div>
                      </div>
                    )}

                    {question.type === "Fill in the Blank" && (
                      <div>
                        <Form.Control
                          type="text"
                          placeholder="Type your answer"
                          value={answers[question._id] || ""}
                          onChange={(e) =>
                            handleFillBlank(question._id, e.target.value)
                          }
                          onBlur={() => blurFillBlank(question._id)}
                          disabled={locked}
                        />
                        {submitted && showCorrectAnswers && (
                          <div className="small mt-2 text-muted">
                            Accepted answers: {(question.answers || []).join(", ")}
                          </div>
                        )}
                      </div>
                    )}

                    {locked && !submitted && lockAfterAnswer && (
                      <div className="small text-muted mt-3">
                        This question is locked after answering.
                      </div>
                    )}

                    {submitted && (
                      <div className="mt-3">
                        {isCorrect(question) ? (
                          <div className="text-success fw-bold">Correct</div>
                        ) : (
                          <div className="text-danger fw-bold">Incorrect</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!submitted && showOneAtATime && displayQuestions.length > 0 && (
            <div className="d-flex justify-content-between mb-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                disabled={!canGoPrev}
              >
                Previous
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                disabled={!canGoNext}
              >
                Next
              </Button>
            </div>
          )}

          {!submitted ? (
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                variant="danger"
                onClick={onSubmitQuiz}
                disabled={savingAttempt || (!isFaculty && !canTakeQuiz)}
              >
                {savingAttempt
                  ? "Submitting..."
                  : isFaculty
                  ? "Submit Preview"
                  : "Submit Quiz"}
              </Button>
            </div>
          ) : (
            <div className="border p-3 bg-light">
              <h5>Quiz Submitted</h5>
              <p className="mb-0">
                Score: <b>{lastAttempt?.score ?? calculateScore()}</b> /{" "}
                <b>{totalQuizPoints}</b>
              </p>
              {!isFaculty && lastAttempt && (
                <p className="small text-muted mt-2 mb-0">
                  Attempt {lastAttempt.attemptNumber}
                </p>
              )}
              {isFaculty && (
                <p className="small text-muted mt-2 mb-0">
                  Preview results are not stored.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}