"use client";
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaGoogle } from "react-icons/fa";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/dashboard` // Redirects after Google login
      }
    });
    if (error) {
      toast.error('Google sign-in failed: ' + error.message);
    }
  };

  const signInWithEmail = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error('Login failed: ' + error.message);
    } else {
      toast.success('Login successful!');
      router.push('/dashboard');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4'>
      <div className='flex flex-col items-center border rounded-xl p-6 border-gray-400 w-full max-w-sm bg-white shadow-md'>
        <Image src={'/logo.png'} alt='logo' width={400} height={100} className='w-[140px] mb-4' />

        <Image src={'/login.png'} alt='login' width={300} height={200} className='w-[250px] h-[160px] object-contain mb-4' />

        <h2 className='text-xl font-bold text-center mb-1'>Welcome to AiCruiter</h2>
        <p className='text-sm text-gray-600 text-center mb-4'>Sign in with Google or Email</p>

        <input
          type="email"
          placeholder="Email"
          className="mb-2 p-2 border rounded w-full text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-3 p-2 border rounded w-full text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className='w-full text-sm mb-3' onClick={signInWithEmail}>
          Login with Email
        </Button>

        <div className="text-gray-400 text-sm mb-3">or</div>

        <Button className='w-full text-sm flex items-center justify-center gap-2' onClick={signInWithGoogle}>
          <FaGoogle className='text-base' /> Login with Google
        </Button>

        <p className="text-sm text-gray-500 mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
