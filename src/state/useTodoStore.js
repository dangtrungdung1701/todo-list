import { create } from "zustand";
import { produce } from "immer";
import { generateUniqueId } from "@/utils/utils";
const useTodoStore = create((set) => ({
  todos: [],
  actions: {
    loadTodos: () =>
      set(
        produce((state) => {
          state.todos = JSON.parse(localStorage.getItem("todos") || "[]");
        })
      ),
    addTodo: (newTodo) =>
      set(
        produce((state) => {
          const uniqueId = generateUniqueId(state.todos);
          localStorage.setItem(
            "todos",
            JSON.stringify([{ ...newTodo, id: uniqueId }, ...state.todos])
          );
          state.todos.unshift({ ...newTodo, id: uniqueId });
        })
      ),
    editTodo: (newTodo) =>
      set(
        produce((state) => {
          const newTodos = state.todos.map((todo) => {
            if (todo.id === newTodo.id) {
              return newTodo;
            }
            return todo;
          });
          localStorage.setItem("todos", JSON.stringify(newTodos));
          state.todos = newTodos;
        })
      ),
    deleteTodo: (todoId) =>
      set(
        produce((state) => {
          const newTodos = state.todos.filter((todo) => todo.id !== todoId);
          localStorage.setItem("todos", JSON.stringify(newTodos));
          state.todos = newTodos;
        })
      ),
    toggleStatus: (todoId) =>
      set(
        produce((state) => {
          const newTodos = state.todos.map((todo) => {
            if (todo.id === todoId) {
              return {
                ...todo,
                status: todo.status === "pending" ? "completed" : "pending",
              };
            }
            return todo;
          });
          localStorage.setItem("todos", JSON.stringify(newTodos));
          state.todos = newTodos;
        })
      ),
    reorderTodos: (newTodos) =>
      set(
        produce((state) => {
          localStorage.setItem("todos", JSON.stringify(newTodos));
          state.todos = newTodos;
        })
      ),
  },
}));

export default useTodoStore;
