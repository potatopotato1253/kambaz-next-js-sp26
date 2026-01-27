import { Button, ButtonGroup, ListGroup, ListGroupItem } from "react-bootstrap";

export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>

      <ButtonGroup className="w-100 mb-3">
        <Button variant="secondary" className="w-50">
          Unpublish
        </Button>
        <Button variant="success" className="w-50">
          Publish
        </Button>
      </ButtonGroup>

      <ListGroup className="rounded-0">
        <ListGroupItem className="rounded-0">Import Existing Content</ListGroupItem>
        <ListGroupItem className="rounded-0">Import from Commons</ListGroupItem>
        <ListGroupItem className="rounded-0">Choose Home Page</ListGroupItem>
        <ListGroupItem className="rounded-0">View Course Stream</ListGroupItem>
        <ListGroupItem className="rounded-0">New Announcement</ListGroupItem>
        <ListGroupItem className="rounded-0">New Analytics</ListGroupItem>
        <ListGroupItem className="rounded-0">View Course Notifications</ListGroupItem>
      </ListGroup>
    </div>
  );
}
