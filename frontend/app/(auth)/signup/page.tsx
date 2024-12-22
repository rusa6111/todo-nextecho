'use client';
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

type SignupForm = {
    name: string;
    password: string;
};

export default function Signup() {
    const { register, handleSubmit } = useForm<SignupForm>();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { updateAuth } = useAuth();

    // Handle form submission
    const onSubmit = async (data: SignupForm) => {
        setError(null); // Clear previous error
        try {
            const response = await axios.post("/api/signup", data);
            console.log("サインアップ成功:", response.data);

            await updateAuth(); // Update authentication state
            router.push("/"); // Redirect to home page
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "サインアップに失敗しました。もう一度試してください。");
            } else {
                setError("サインアップに失敗しました。もう一度試してください。");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-black">サインアップ</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-black">ユーザー名:</label>
                    <input
                        type="text"
                        {...register("name", { required: true })}
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black">パスワード:</label>
                    <input
                        type="password"
                        {...register("password", { required: true })}
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    サインアップ
                </button>
            </form>
        </div>
    );
}
