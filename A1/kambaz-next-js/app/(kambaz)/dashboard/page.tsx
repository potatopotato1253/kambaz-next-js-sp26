"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  FormControl,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addNewCourse, deleteCourse, updateCourse } from "../courses/reducer";
import { enroll, unenroll } from "../enrollments/reducer";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { courses } = useSelector((state: RootState) => state.coursesReducer) as {
    courses: any[];
  };

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as { currentUser: any };

  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer
  ) as { enrollments: any[] };

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const [showAllCourses, setShowAllCourses] = useState(false);

  if (!currentUser) {
    return <div className="p-4">Please sign in.</div>;
  }

  const isFacultyOrAdmin =
    currentUser.role === "FACULTY" || currentUser.role === "ADMIN";

  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (e: any) => e.user === currentUser._id && e.course === courseId
    );

  const visibleCourses = showAllCourses
    ? courses
    : courses.filter((c: any) => isEnrolled(c._id));

  return (
    <div className="p-4" id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title" className="mb-0">
          Dashboard
        </h1>

        <button
          className="btn btn-primary"
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-enrollments-toggle"
        >
          Enrollments
        </button>
      </div>

      <hr />

      <h2 id="wd-dashboard-published">
        Published Courses ({visibleCourses.length})
      </h2>

      {isFacultyOrAdmin && (
        <>
          <h5 className="mt-3">
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => dispatch(addNewCourse(course))}
            >
              Add
            </button>

            <button
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={() => dispatch(updateCourse(course))}
            >
              Update
            </button>
          </h5>

          <FormControl
            className="mb-2"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />

          <FormControl
            as="textarea"
            rows={3}
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />

          <hr />
        </>
      )}

      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} className="g-4">
          {visibleCourses.map((c: any) => {
            const enrolled = isEnrolled(c._id);

            return (
              <Col key={c._id} style={{ width: "300px" }}>
                <Card className="h-100">
                  <CardImg
                    variant="top"
                    src={c.image || "/images/reactjs.jpg"}
                    height={160}
                  />

                  <CardBody>
                    <Link
                      href={`/courses/${c._id}/home`}
                      className="text-decoration-none text-dark"
                      onClick={(e) => {
                        if (!enrolled) e.preventDefault();
                      }}
                    >
                      <CardTitle className="text-nowrap overflow-hidden">
                        {c.number} {c.name}
                      </CardTitle>
                      <CardText
                        style={{ height: "100px" }}
                        className="overflow-hidden"
                      >
                        {c.description}
                      </CardText>
                    </Link>

                    {/* UPDATED: buttons wrap + stay inside the card */}
                    <div className="d-flex flex-wrap gap-2 mt-2 align-items-center">
                      <Link
                        className="btn btn-primary btn-sm"
                        href={`/courses/${c._id}/home`}
                        onClick={(e) => {
                          if (!enrolled) e.preventDefault();
                        }}
                      >
                        Go
                      </Link>

                      {showAllCourses &&
                        (enrolled ? (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(
                                unenroll({
                                  user: currentUser._id,
                                  course: c._id,
                                })
                              );
                            }}
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(
                                enroll({
                                  user: currentUser._id,
                                  course: c._id,
                                })
                              );
                            }}
                          >
                            Enroll
                          </button>
                        ))}

                      {isFacultyOrAdmin && (
                        <>
                          <button
                            className="btn btn-warning btn-sm"
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(c);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            id="wd-delete-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              dispatch(deleteCourse(c._id));
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}