import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { orpc } from "#/orpc/client";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(orpc.listTodos.queryOptions());
  },
  component: App,
});

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <Link to="/terminal" className="inline-block mb-4 text-sm text-blue-600 hover:text-blue-800 underline">
        Terminal
      </Link>
      <h1 className="text-2xl font-bold mb-6">oRPC Todo Demo</h1>
      <TodoList />
    </main>
  );
}

function TodoList() {
  const [name, setName] = useState("");

  const { data: todos, refetch: refetchTodos } = useSuspenseQuery(orpc.listTodos.queryOptions());
  const { data: health } = useSuspenseQuery(orpc.health.queryOptions());

  const addTodo = useMutation(
    orpc.addTodo.mutationOptions({
      onSuccess: () => {
        refetchTodos();
        setName("");
      },
    }),
  );

  const deleteTodo = useMutation(
    orpc.deleteTodo.mutationOptions({
      onSuccess: () => {
        refetchTodos();
      },
    }),
  );

  return (
    <div className="max-w-md">
      <div className="mb-4">
        <p className="text-sm text-gray-500">Server: {health.server}</p>
      </div>
      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) addTodo.mutate({ name: name.trim() });
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a todo..."
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={addTodo.isPending || !name.trim()}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {addTodo.isPending ? "Adding..." : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between rounded border border-gray-200 px-3 py-2 text-sm"
          >
            <span>{todo.name}</span>
            <button
              type="button"
              onClick={() => deleteTodo.mutate({ id: todo.id })}
              className="ml-2 text-red-500 hover:text-red-700 text-xs font-medium"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
