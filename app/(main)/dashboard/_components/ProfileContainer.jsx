'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import React, { useEffect, useRef } from 'react';

function ProfileContainer({ onClose }) {
  const router = useRouter();
  const containerRef = useRef();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-12 bg-white shadow-md border rounded-md w-36 z-50"
    >
      <button
        onClick={() => router.push('/profile')}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
      >
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-500 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileContainer;
