'use client';
import React from 'react';
import Link from 'next/link';

function Error({ statusCode }: { statusCode: number }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-12">
      <h1 className="text-7xl mb-6">Error {statusCode}</h1>
      <p className="text-xl mb-8">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
      <Link href="/">
        <button className="bg-blue-500 text-white rounded-full py-3 px-8 m-2 text-xl hover:bg-blue-600">Back to Home</button>
      </Link>
    </div>
  );
}

import { NextPageContext } from 'next';

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
