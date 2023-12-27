import { format } from "date-fns";

export const TODO_FILTERS = {
  all: (todos) => {
    return todos;
  },
  pending: (todos) => {
    return todos.filter((todo) => todo.status === "pending");
  },
  completed: (todos) => {
    return todos.filter((todo) => todo.status === "completed");
  },
  overDue: (todos) => {
    return todos.filter(
      (todo) =>
        todo.status === "pending" &&
        new Date(todo.dueDate) < new Date(format(new Date(), "yyyy-MM-dd"))
    );
  },
};

export const STATUS_LABEL = {
  pending: "Pending",
  completed: "Completed",
  overDue: "Over due",
};
