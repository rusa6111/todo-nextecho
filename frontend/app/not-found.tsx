import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-12">
      <h1 className="text-7xl mb-6">404</h1>
      <p className="text-xl mb-8">
        The page you are looking for could not be found.
      </p>
      <Link href="/">
        <button className="bg-blue-500 text-white rounded-full py-3 px-8 m-2 text-xl hover:bg-blue-600">Back to Home</button>
      </Link>
    </div>
  );
}
