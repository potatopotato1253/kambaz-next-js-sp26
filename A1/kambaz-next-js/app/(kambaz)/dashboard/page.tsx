import Link from "next/link";
import * as db from "../database";
import { Row, Col, Card, CardBody, CardTitle, CardText, CardImg } from "react-bootstrap";

export default function Dashboard() {
  const courses = db.courses;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} className="g-4">
          {courses.map((course: any) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card className="h-100">
                <CardImg variant="top" src="/images/reactjs.jpg" height={160} />

                <CardBody>
                  <Link
                    href={`/courses/${course._id}/home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.number} {course.name}
                    </CardTitle>

                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
