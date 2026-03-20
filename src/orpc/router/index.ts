import { os } from "../orpc";
import { addTodo, deleteTodo, listTodos } from "./todos";

export default {
  health: os.handler(({ context }) => {
    return {
      healthy: true,
      server: context.server,
    };
  }),
  listTodos,
  addTodo,
  deleteTodo,
};
