import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {
  // Gets all assignments that belong to the selected course.
  function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  // Looks up one assignment by its unique assignment id.
  function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
  }

  // Creates a new assignment document with a generated UUID.
  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  }

  // Updates only the fields sent from the client for an assignment.
  function updateAssignment(assignmentId, assignmentUpdates) {
    return model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  }

  // Removes the assignment document matching the provided id.
  function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
