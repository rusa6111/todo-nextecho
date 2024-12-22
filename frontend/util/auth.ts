'use server';
import { cookies } from 'next/headers';

export interface UserInfo {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export async function isLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('Authorization')?.value;
  return !!token;
}

export async function getUserInfo(): Promise<UserInfo | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('Authorization')?.value;

  if (!token) return null;

  try {
    const response = await fetch('http://nginx/api/mydata', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `Authorization=${token}`
      }
    });

    if (!response.ok) {
      console.error(response);
      throw new Error('Failed to fetch user info');
    }

    const userInfo: UserInfo = await response.json();
    return userInfo;
  } catch (err) {
    console.error(err);
    return null;
  }
}
