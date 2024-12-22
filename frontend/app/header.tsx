'use client';
import Link from "next/link";
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { loggedIn, userInfo, updateAuth } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    await updateAuth();
    router.push('/');
  };

  return (
    <header className="flex justify-between items-center h-16 bg-gray-800 text-white px-4">
      <Link href="/">
        <span className="text-2xl pl-4">Test App</span>
      </Link>
      <div className="hamburger-menu">
        {loggedIn ? (
          <div className="flex items-center pr-4">
            <span className="mr-4">Welcome, {userInfo?.name ?? ""}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white rounded-full py-2 px-4 hover:bg-red-600">Logout</button>
          </div>
        ) : (
          <div className="flex items-center pr-4">
            <Link href="/login">
              <button className="bg-blue-500 text-white rounded-full py-2 px-4 mr-2 hover:bg-blue-600">Login</button>
            </Link>
            <Link href="/signup">
              <button className="bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600">Signup</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
