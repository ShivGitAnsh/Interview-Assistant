'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false)
        router.replace('/auth'); // redirect if no session
      } else {
        setLoading(false); // session is valid
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return children;
}
