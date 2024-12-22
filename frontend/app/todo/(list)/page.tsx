'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Todo {
  id: number;
  title: string;
  content: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('/api/todo');
        setTodos(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const toggleTodoStatus = async (id: number, done: boolean) => {
    try {
      await axios.put(`/api/todo/${id}`, { done: !done });
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, done: !done } : todo)));
    } catch (err) {
      console.error('Failed to update todo status', err);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('/api/todo', { title: newTitle, content: newContent });
      setTodos([...todos, response.data]);
      setNewTitle('');
      setNewContent('');
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create todo', err);
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg m-10">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">Create New Todo</button>
      {isCreating && (
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Content"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          />
          <button onClick={handleCreate} className="px-4 py-2 bg-green-500 text-white rounded mr-2">Save</button>
          <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
        </div>
      )}
      <div className="space-y-4">
        {todos.map(todo => (
          <div key={todo.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <span
                className={`px-3 py-1.5 rounded cursor-pointer ${todo.done ? 'bg-green-400' : 'bg-yellow-300'} text-black`}
                onClick={() => toggleTodoStatus(todo.id, todo.done)}
              >
                {todo.done ? 'Completed' : 'Pending'}
              </span>
              <Link href={`/todo/${todo.id}`}>
                <span className="text-xl font-bold text-blue-400 hover:underline ml-4">{todo.title}</span>
              </Link>
            </div>
            <p className="mb-2">{todo.content}</p>
            <div className="text-sm text-gray-400">
              <p>Created at: {new Date(todo.created_at).toLocaleString()}</p>
              <p>Updated at: {new Date(todo.updated_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
