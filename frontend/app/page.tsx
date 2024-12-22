import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-12">
      <h1 className="text-7xl mb-6">Todo App</h1>
      <p className="text-xl mb-8">
        Welcome to the Todo App. Manage your tasks efficiently and stay organized.
      </p>
      <div>
        <Link href="/login">
          <button className="bg-blue-500 text-white rounded-full py-3 px-8 m-2 text-xl hover:bg-blue-600">Login</button>
        </Link>
        <Link href="/signup">
          <button className="bg-blue-500 text-white rounded-full py-3 px-8 m-2 text-xl hover:bg-blue-600">Signup</button>
        </Link>
      </div>
    </div>
  );
};


