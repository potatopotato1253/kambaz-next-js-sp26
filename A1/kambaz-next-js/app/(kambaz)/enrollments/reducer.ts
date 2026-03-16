import { createSlice } from "@reduxjs/toolkit";
import * as db from "../database";

const initialState = {
  enrollments: db.enrollments as any[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (
      state,
      { payload }: { payload: { user: string; course: string } }
    ) => {
      const exists = state.enrollments.some(
        (e: any) => e.user === payload.user && e.course === payload.course
      );
      if (exists) return;

      state.enrollments.push(payload as any);
    },

    unenroll: (
      state,
      { payload }: { payload: { user: string; course: string } }
    ) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === payload.user && e.course === payload.course)
      );
    },
  },
});

export const { enroll, unenroll } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;


