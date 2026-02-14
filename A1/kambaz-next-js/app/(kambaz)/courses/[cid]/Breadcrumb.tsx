"use client";

import { usePathname } from "next/navigation";

export default function Breadcrumb(
  { course }: { course: { name: string } | undefined }
) {
  const pathname = usePathname();
  const last = pathname.split("/").pop() || "";
  const section = last.charAt(0).toUpperCase() + last.slice(1);

  return (
    <span className="text-danger">
      {course?.name} &gt; {section}
    </span>
  );
}
