"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Form, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../store";
import * as client from "../../../../../client";

type QuestionType = "Multiple Choice" | "True/False" | "Fill in the Blank";

type Choice = {
  text: string;
  correct: boolean;
};

type Question = {
  _id: string;
  type: QuestionType;
  title: string;
  points: number;
  question: string;
  choices?: Choice[];
  answer?: boolean;
  answers?: string[];
};

const blankNewQuestion = (): Question => ({
  _id: `QQ${Date.now()}`,
  type: "Multiple Choice",
  title: "New Question",
  points: 0,
  question: "",
  choices: [
    { text: "Choice 1", correct: true },
    { text: "Choice 2", correct: false },
  ],
  answer: false,
  answers: [""],
});

export default function QuizQuestionsEditorPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as { currentUser: any };

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Question | null>(null);

  const totalPoints = useMemo(
    () => questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0),
    [questions]
  );

  const loadQuiz = async () => {
    if (!qid) return;
    setLoading(true);
    try {
      const data = await client.findQuizById(qid);
      setQuiz(data);
      setQuestions(data.questions || []);
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
        <p>Only faculty can edit quiz questions.</p>
      </div>
    );
  }

  if (loading) return <div className="p-3">Loading...</div>;
  if (!quiz) return <div className="p-3">Quiz not found.</div>;

  const beginNewQuestion = () => {
    const q = blankNewQuestion();
    setEditingId(q._id);
    setDraft(q);
  };

  const beginEditQuestion = (question: Question) => {
    setEditingId(question._id);
    setDraft(JSON.parse(JSON.stringify(question)));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveDraftIntoLocalQuestions = () => {
    if (!draft) return;

    const normalizedDraft = {
      ...draft,
      points: Number(draft.points) || 0,
    };

    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q._id === normalizedDraft._id);
      if (idx === -1) return [...prev, normalizedDraft];

      const copy = [...prev];
      copy[idx] = normalizedDraft;
      return copy;
    });

    setEditingId(null);
    setDraft(null);
  };

  const deleteQuestion = (questionId: string) => {
    const ok = window.confirm("Delete this question?");
    if (!ok) return;
    setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    if (editingId === questionId) {
      setEditingId(null);
      setDraft(null);
    }
  };

  const saveAllQuestions = async () => {
    const cleanedQuestions = questions.map((q) => ({
      ...q,
      points: Number(q.points) || 0,
    }));

    const totalPoints = cleanedQuestions.reduce(
      (sum, q) => sum + (Number(q.points) || 0),
      0
    );

    const updatedQuiz = {
      ...quiz,
      questions: cleanedQuestions,
      points: totalPoints,
    };

    const savedQuiz = await client.updateQuiz(updatedQuiz);
    setQuiz(savedQuiz);
    setQuestions(savedQuiz.questions || []);
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const updateDraftField = (field: keyof Question, value: any) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const changeType = (type: QuestionType) => {
    if (!draft) return;
    if (type === "Multiple Choice") {
      setDraft({
        ...draft,
        type,
        choices:
          draft.choices && draft.choices.length > 0
            ? draft.choices
            : [
                { text: "Choice 1", correct: true },
                { text: "Choice 2", correct: false },
              ],
      });
    } else if (type === "True/False") {
      setDraft({
        ...draft,
        type,
        answer: draft.answer ?? false,
      });
    } else {
      setDraft({
        ...draft,
        type,
        answers: draft.answers && draft.answers.length > 0 ? draft.answers : [""],
      });
    }
  };

  const updateChoice = (index: number, text: string) => {
    if (!draft) return;
    const choices = [...(draft.choices || [])];
    choices[index] = { ...choices[index], text };
    setDraft({ ...draft, choices });
  };

  const setCorrectChoice = (index: number) => {
    if (!draft) return;
    const choices = (draft.choices || []).map((c, i) => ({
      ...c,
      correct: i === index,
    }));
    setDraft({ ...draft, choices });
  };

  const addChoice = () => {
    if (!draft) return;
    setDraft({
      ...draft,
      choices: [...(draft.choices || []), { text: "", correct: false }],
    });
  };

  const removeChoice = (index: number) => {
    if (!draft) return;
    const choices = [...(draft.choices || [])];
    choices.splice(index, 1);
    if (choices.length > 0 && !choices.some((c) => c.correct)) {
      choices[0].correct = true;
    }
    setDraft({ ...draft, choices });
  };

  const updateBlankAnswer = (index: number, value: string) => {
    if (!draft) return;
    const answers = [...(draft.answers || [])];
    answers[index] = value;
    setDraft({ ...draft, answers });
  };

  const addBlankAnswer = () => {
    if (!draft) return;
    setDraft({
      ...draft,
      answers: [...(draft.answers || []), ""],
    });
  };

  const removeBlankAnswer = (index: number) => {
    if (!draft) return;
    const answers = [...(draft.answers || [])];
    answers.splice(index, 1);
    setDraft({ ...draft, answers: answers.length ? answers : [""] });
  };

  return (
    <div className="p-3">
      <Nav className="mb-4 nav nav-tabs">
        <Nav.Item>
          <Nav.Link as={Link} href={`/courses/${cid}/quizzes/${qid}/editor`}>
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active>Questions</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Questions</h4>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">Points {totalPoints}</span>
          <Button variant="light" className="border" onClick={beginNewQuestion}>
            + New Question
          </Button>
        </div>
      </div>

      {questions.length === 0 && !draft && (
        <div className="alert alert-secondary">
          No questions yet. Click <strong>+ New Question</strong> to add one.
        </div>
      )}

      {questions.map((question, index) => {
        const isEditingThis = editingId === question._id && draft;

        if (isEditingThis) {
          return (
            <div key={question._id} className="border p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Control
                  value={draft.title}
                  onChange={(e) => updateDraftField("title", e.target.value)}
                  style={{ maxWidth: 260 }}
                />
                <div className="d-flex align-items-center gap-2">
                  <Form.Select
                    value={draft.type}
                    onChange={(e) => changeType(e.target.value as QuestionType)}
                    style={{ width: 180 }}
                  >
                    <option>Multiple Choice</option>
                    <option>True/False</option>
                    <option>Fill in the Blank</option>
                  </Form.Select>
                  <span>pts:</span>
                  <Form.Control
                    type="number"
                    value={draft.points}
                    onChange={(e) =>
                      updateDraftField("points", Number(e.target.value))
                    }
                    style={{ width: 80 }}
                  />
                </div>
              </div>

              <div className="small text-muted mb-3">
                {draft.type === "Multiple Choice" &&
                  "Enter your question and multiple answers, then select the one correct answer."}
                {draft.type === "True/False" &&
                  "Enter your question text, then select if True or False is the correct answer."}
                {draft.type === "Fill in the Blank" &&
                  "Enter your question text, then define all possible correct answers for the blank."}
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={draft.question}
                  onChange={(e) => updateDraftField("question", e.target.value)}
                />
              </Form.Group>

              {draft.type === "Multiple Choice" && (
                <div className="mb-3">
                  <Form.Label>Answers</Form.Label>
                  {(draft.choices || []).map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      className="d-flex align-items-center gap-2 mb-2"
                    >
                      <Form.Check
                        type="radio"
                        name={`correct-${draft._id}`}
                        checked={choice.correct}
                        onChange={() => setCorrectChoice(choiceIndex)}
                        label=""
                      />
                      <Form.Control
                        value={choice.text}
                        onChange={(e) =>
                          updateChoice(choiceIndex, e.target.value)
                        }
                        placeholder="Possible Answer"
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => removeChoice(choiceIndex)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  <div className="text-end">
                    <Button variant="link" onClick={addChoice}>
                      + Add Another Answer
                    </Button>
                  </div>
                </div>
              )}

              {draft.type === "True/False" && (
                <div className="mb-3">
                  <Form.Label>Answers</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      label="True"
                      name={`tf-${draft._id}`}
                      checked={draft.answer === true}
                      onChange={() => updateDraftField("answer", true)}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      label="False"
                      name={`tf-${draft._id}`}
                      checked={draft.answer === false}
                      onChange={() => updateDraftField("answer", false)}
                    />
                  </div>
                </div>
              )}

              {draft.type === "Fill in the Blank" && (
                <div className="mb-3">
                  <Form.Label>Answers</Form.Label>
                  {(draft.answers || []).map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className="d-flex align-items-center gap-2 mb-2"
                    >
                      <Form.Control
                        value={answer}
                        onChange={(e) =>
                          updateBlankAnswer(answerIndex, e.target.value)
                        }
                        placeholder="Possible Answer"
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => removeBlankAnswer(answerIndex)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  <div className="text-end">
                    <Button variant="link" onClick={addBlankAnswer}>
                      + Add Another Answer
                    </Button>
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <Button variant="light" className="border" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={saveDraftIntoLocalQuestions}>
                  Update Question
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div key={question._id} className="border p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h5 className="mb-1">
                  Question {index + 1}: {question.title}
                </h5>
                <div className="small text-muted">
                  {question.type} | {question.points || 0} pts
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => beginEditQuestion(question)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteQuestion(question._id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <div>{question.question}</div>
          </div>
        );
      })}

      {draft && !questions.some((q) => q._id === draft._id) && (
        <div className="border p-3 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control
              value={draft.title}
              onChange={(e) => updateDraftField("title", e.target.value)}
              style={{ maxWidth: 260 }}
            />
            <div className="d-flex align-items-center gap-2">
              <Form.Select
                value={draft.type}
                onChange={(e) => changeType(e.target.value as QuestionType)}
                style={{ width: 180 }}
              >
                <option>Multiple Choice</option>
                <option>True/False</option>
                <option>Fill in the Blank</option>
              </Form.Select>
              <span>pts:</span>
              <Form.Control
                type="number"
                value={draft.points}
                onChange={(e) =>
                  updateDraftField("points", Number(e.target.value))
                }
                style={{ width: 80 }}
              />
            </div>
          </div>

          <div className="small text-muted mb-3">
            {draft.type === "Multiple Choice" &&
              "Enter your question and multiple answers, then select the one correct answer."}
            {draft.type === "True/False" &&
              "Enter your question text, then select if True or False is the correct answer."}
            {draft.type === "Fill in the Blank" &&
              "Enter your question text, then define all possible correct answers for the blank."}
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={draft.question}
              onChange={(e) => updateDraftField("question", e.target.value)}
            />
          </Form.Group>

          {draft.type === "Multiple Choice" && (
            <div className="mb-3">
              <Form.Label>Answers</Form.Label>
              {(draft.choices || []).map((choice, choiceIndex) => (
                <div key={choiceIndex} className="d-flex align-items-center gap-2 mb-2">
                  <Form.Check
                    type="radio"
                    name={`correct-${draft._id}`}
                    checked={choice.correct}
                    onChange={() => setCorrectChoice(choiceIndex)}
                  />
                  <Form.Control
                    value={choice.text}
                    onChange={(e) => updateChoice(choiceIndex, e.target.value)}
                    placeholder="Possible Answer"
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => removeChoice(choiceIndex)}
                  >
                    X
                  </Button>
                </div>
              ))}
              <div className="text-end">
                <Button variant="link" onClick={addChoice}>
                  + Add Another Answer
                </Button>
              </div>
            </div>
          )}

          {draft.type === "True/False" && (
            <div className="mb-3">
              <Form.Label>Answers</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="True"
                  name={`tf-${draft._id}`}
                  checked={draft.answer === true}
                  onChange={() => updateDraftField("answer", true)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label="False"
                  name={`tf-${draft._id}`}
                  checked={draft.answer === false}
                  onChange={() => updateDraftField("answer", false)}
                />
              </div>
            </div>
          )}

          {draft.type === "Fill in the Blank" && (
            <div className="mb-3">
              <Form.Label>Answers</Form.Label>
              {(draft.answers || []).map((answer, answerIndex) => (
                <div key={answerIndex} className="d-flex align-items-center gap-2 mb-2">
                  <Form.Control
                    value={answer}
                    onChange={(e) => updateBlankAnswer(answerIndex, e.target.value)}
                    placeholder="Possible Answer"
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => removeBlankAnswer(answerIndex)}
                  >
                    X
                  </Button>
                </div>
              ))}
              <div className="text-end">
                <Button variant="link" onClick={addBlankAnswer}>
                  + Add Another Answer
                </Button>
              </div>
            </div>
          )}

          <div className="d-flex gap-2">
            <Button variant="light" className="border" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button variant="danger" onClick={saveDraftIntoLocalQuestions}>
              Save Question
            </Button>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          variant="secondary"
          onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/editor`)}
        >
          Back to Details
        </Button>
        <Button variant="danger" onClick={saveAllQuestions}>
          Save
        </Button>
      </div>
    </div>
  );
}