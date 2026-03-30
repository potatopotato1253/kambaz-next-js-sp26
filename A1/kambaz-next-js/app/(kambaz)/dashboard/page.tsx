"use client";

import { useState, useEffect } from "react";
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

import * as client from "../courses/client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setCourses } from "../courses/reducer";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as { currentUser: any };

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
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);

  const fetchAllData = async () => {
    try {
      const [all, mine] = await Promise.all([
        client.fetchAllCourses(),
        client.findMyCourses(),
      ]);
      setAllCourses(all);
      setMyCourses(mine);
      dispatch(setCourses(showAllCourses ? all : mine));
    } catch (error) {
      console.error(error);
    }
  };

  const onAddNewCourse = async () => {
    try {
      await client.createCourse(course);
      await fetchAllData();
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    try {
      await client.deleteCourse(courseId);
      await fetchAllData();
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateCourse = async () => {
    try {
      await client.updateCourse(course);
      await fetchAllData();
    } catch (error) {
      console.error(error);
    }
  };

  const onEnroll = async (courseId: string) => {
  try {
    await client.enrollInCourse("current", courseId);
    await fetchAllData();
  } catch (error) {
    console.error(error);
  }
};

const onUnenroll = async (courseId: string) => {
  try {
    await client.unenrollFromCourse("current", courseId);
    await fetchAllData();
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div className="p-4">Please sign in.</div>;
  }

  const isFacultyOrAdmin =
    currentUser.role === "FACULTY" || currentUser.role === "ADMIN";

  const myCourseIds = new Set(myCourses.map((c: any) => c._id));
  const visibleCourses = showAllCourses ? allCourses : myCourses;

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
              onClick={onAddNewCourse}
            >
              Add
            </button>

            <button
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={onUpdateCourse}
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
            const enrolled = myCourseIds.has(c._id);

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
                              onUnenroll(c._id);
                            }}
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              onEnroll(c._id);
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
                              onDeleteCourse(c._id);
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