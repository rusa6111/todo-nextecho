'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Todo {
  id: number;
  title: string;
  content: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

const TodoDetail = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    if (id) {
      const fetchTodo = async () => {
        try {
          const response = await axios.get(`/api/todo/${id}`);
          setTodo(response.data);
          setEditTitle(response.data.title);
          setEditContent(response.data.content);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch todo');
        } finally {
          setLoading(false);
        }
      };

      const fetchComments = async () => {
        try {
          const response = await axios.get(`/api/todo/${id}/comment`);
          setComments(response.data);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch comments');
        }
      };

      fetchTodo();
      fetchComments();
    }
  }, [id]);

  const toggleTodoStatus = async () => {
    if (todo) {
      try {
        await axios.put(`/api/todo/${todo.id}`, { done: !todo.done });
        setTodo({ ...todo, done: !todo.done });
      } catch (err) {
        console.error('Failed to update todo status', err);
      }
    }
  };

  const handleSave = async () => {
    if (todo) {
      try {
        await axios.put(`/api/todo/${todo.id}`, { title: editTitle, content: editContent });
        setTodo({ ...todo, title: editTitle, content: editContent });
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update todo', err);
      }
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    try {
      const response = await axios.post(`/api/todo/${id}/comment`, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!todo) return <div className="text-center text-white">Todo not found</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg m-10">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
          />
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Save</button>
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{todo.title}</h1>
          <p className="mb-2">
            Status: <span
              className={`px-3 py-2 ml-1 rounded cursor-pointer ${todo.done ? 'bg-green-400' : 'bg-yellow-300'} text-black`}
              onClick={toggleTodoStatus}
            >
              {todo.done ? 'Completed' : 'Pending'}
            </span>
          </p>
          <p className="mb-4">{todo.content}</p>
          <button onClick={() => setIsEditing(true)} className="px-4 py-1.5 my-2 bg-blue-500 text-white rounded">Edit</button>
          <div className="text-sm text-gray-400 my-2">
            <p>Created at: {new Date(todo.created_at).toLocaleString()}</p>
            <p>Updated at: {new Date(todo.updated_at).toLocaleString()}</p>
          </div>
        </>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
          />
          <button onClick={handleAddComment} className="px-4 py-2 bg-green-500 text-white rounded">Add Comment</button>
        </div>
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
              <p className="mb-2">{comment.content}</p>
              <div className="text-sm text-gray-400">
                <p>Created at: {new Date(comment.created_at).toLocaleString()}</p>
                <p>Updated at: {new Date(comment.updated_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link href="/todo/">
        <span className="text-blue-400 hover:underline block mt-4">Back to List</span>
      </Link>
    </div>
  );
};

export default TodoDetail;
