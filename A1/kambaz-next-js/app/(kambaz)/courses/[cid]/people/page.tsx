"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "./Tables";
import * as client from "../../client";

export default function PeoplePage() {
  const { cid } = useParams<{ cid: string }>();
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const users = await client.findUsersForCourse(cid);
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  return (
    <div id="wd-people">
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}