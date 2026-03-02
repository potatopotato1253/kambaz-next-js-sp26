"use client";

import { ReactNode, useMemo, useState } from "react";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import type { RootState } from "../../store";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ cid: string }>();
  const cid = params?.cid;

  const courses = useSelector((state: RootState) => state.coursesReducer.courses);

  const course = useMemo(() => {
    return courses.find((c: any) => c._id === cid);
  }, [courses, cid]);

  const [showNav, setShowNav] = useState(true);

  return (
    <div id="wd-courses">
      <h2 id="wd-course-title" className="d-flex align-items-center">
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => setShowNav((s) => !s)}
          style={{ cursor: "pointer" }}
        />
        {course?.name}
      </h2>

      <hr />

      <div className="d-flex">
        {showNav && (
          <div className="d-none d-md-block">
            <CourseNavigation cid={cid} />
          </div>
        )}

        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}