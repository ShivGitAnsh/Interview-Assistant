"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignup = async () => {
    if (password !== confirm) {
      toast("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast("Signup failed: " + error.message);
    } else {
      toast("Verification email sent! Please check your inbox to confirm your email address.");;
      router.push("/auth");  
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4'>
      <div className='flex flex-col items-center border rounded-xl p-6 border-gray-400 w-full max-w-sm bg-white shadow-md'>
        <Image src={'/logo.png'} alt='logo' width={400} height={100} className='w-[140px] mb-4' />
        <Image src={'/login.png'} alt='signup' width={300} height={200} className='w-[250px] h-[160px] object-contain mb-4' />

        <h2 className='text-xl font-bold text-center mb-1'>Create an Account</h2>
        <p className='text-sm text-gray-600 text-center mb-4'>Register with your Email</p>

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
          className="mb-2 p-2 border rounded w-full text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="mb-3 p-2 border rounded w-full text-sm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button className='w-full text-sm mb-3' onClick={handleSignup}>
          Sign Up
        </Button>

        <p className="text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <a href="/auth" className="text-blue-600 underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
