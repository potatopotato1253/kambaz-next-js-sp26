import Link from "next/link";
import { Row, Col, Card, CardBody, CardTitle, CardText, CardImg } from "react-bootstrap";

export default function Dashboard() {
  const courses = [
    { id: "1234", img: "/images/reactjs.jpg", title: "CS1234 React JS", desc: "Full Stack Software Developer" },
    { id: "2345", img: "/images/nodejs.jpg", title: "CS2345 Node JS", desc: "Server Side Development" },
    { id: "3456", img: "/images/javascript.jpg", title: "CS3456 JavaScript", desc: "Modern JavaScript Programming" },
    { id: "4567", img: "/images/htmlcss.jpg", title: "CS4567 HTML & CSS", desc: "Frontend Web Development" },
    { id: "5678", img: "/images/python.jpg", title: "CS5678 Python", desc: "Programming with Python" },
    { id: "6789", img: "/images/mongodb.jpg", title: "CS6789 MongoDB", desc: "NoSQL Databases" },
    { id: "7890", img: "/images/devops.jpg", title: "CS7890 DevOps", desc: "Cloud & Deployment" },
  ];

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} className="g-4">
          {courses.map((c) => (
            <Col key={c.id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card className="h-100">
                <CardImg variant="top" src={c.img} height={160} />

                <CardBody>
                  <Link
                    href={`/courses/${c.id}/home`}
                    className="wd-dashboard-course-link"
                  >
                    <CardTitle className="wd-dashboard-course-title">
                      {c.title}
                    </CardTitle>

                    <CardText
                      className="wd-dashboard-course-description"
                      style={{ height: "100px" }}
                    >
                      {c.desc}
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
