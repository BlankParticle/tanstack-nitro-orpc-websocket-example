import { os } from "../orpc";
import * as z from "zod";

const todos = [
  { id: 1, name: "Get groceries" },
  { id: 2, name: "Buy a new phone" },
  { id: 3, name: "Finish the project" },
];

export const listTodos = os.handler(() => {
  return todos;
});

export const addTodo = os.input(z.object({ name: z.string() })).handler(({ input }) => {
  const newTodo = { id: todos.length + 1, name: input.name };
  todos.push(newTodo);
  return newTodo;
});

export const deleteTodo = os.input(z.object({ id: z.number() })).handler(({ input }) => {
  const index = todos.findIndex((t) => t.id === input.id);
  if (index !== -1) todos.splice(index, 1);
  return { id: input.id };
});
