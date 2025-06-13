"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

export default function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    let listener;

    async function init() {
      // 1) Read the current session (will parse OAuth callback if present)
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.warn("Failed to load session:", error.message);

      await syncUserRow(session?.user);

      // 2) Listen for any future sign-in/sign-out
      listener = supabase.auth.onAuthStateChange((_, newSession) => {
        syncUserRow(newSession?.user);
      });
    }

    init();

    return () => {
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  // Sync the Supabase auth user → your Users table
  async function syncUserRow(authUser) {
    if (!authUser) {
      setUser(null);
      setUserLoading(false);
      return;
    }

    try {
      const email = authUser.email;
      const { data: rows } = await supabase
        .from("Users")
        .select("*")
        .eq("email", email)
        .limit(1);

      let current = rows?.[0];
      if (!current) {
        const { data: inserted, error: insertError } = await supabase
          .from("Users")
          .insert([{
            name: authUser.user_metadata?.name,
            email,
            picture: authUser.user_metadata?.picture,
          }])
          .select()
          .single();

        if (insertError) console.error("Insert error:", insertError.message);
        current = inserted;
      }

      setUser(current);
    } catch (err) {
      console.error("Error syncing user row:", err.message);
    } finally {
      setUserLoading(false);
    }
  }

  return (
    <UserDetailContext.Provider value={{ user, setUser, userLoading }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserDetailContext);
  if (!ctx) throw new Error("useUser must be used within Provider");
  return ctx;
};
