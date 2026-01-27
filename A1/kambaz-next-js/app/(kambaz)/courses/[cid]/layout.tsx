import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { BsList } from "react-icons/bs";

export default async function CoursesLayout(
  { children, params }: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>
) {
  const { cid } = await params;

  return (
    <div id="wd-courses">
      <h2 id="wd-course-title" className="d-flex align-items-center">
        <BsList className="me-2 fs-3" />
        Course {cid}
      </h2>
      <hr />

      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill">
          {children}
        </div>
      </div>
    </div>
  );
}
