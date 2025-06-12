"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabaseClient';
import React, { useState, useEffect, useContext } from 'react';

console.log('🛎️ Provider file loaded');

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // Add userLoading state

  useEffect(() => {
    const CreateNewUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          // Check if the user already exists
          let { data: Users, error } = await supabase
            .from('Users')
            .select("*")
            .eq('email', authUser?.email);

          if (error) {
            console.error("Error fetching user:", error);
            setUserLoading(false); 
            return;
          }

          // If not, create a new user
          if (Users?.length === 0) {
            const { data, error } = await supabase.from('Users').insert([
              {
                name: authUser?.user_metadata?.name,
                email: authUser?.email,
                picture: authUser?.user_metadata?.picture,
              },
            ]).select(); // Select the inserted data to return it

            if (error) {
              console.error("Error creating user:", error);
              setUserLoading(false); // Ensure loading is set to false even on error
              return;
            }
            setUser(data ? data[0] : null); // Set the new user
          } else {
            setUser(Users[0]); // Set the existing user
          }
        } else {
          setUser(null); // No user logged in
        }
      } catch (error) {
        console.error("Error in CreateNewUser:", error);
      } finally {
        setUserLoading(false); // Ensure loading is always set to false
      }
    };

    CreateNewUser();
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser, userLoading }}> {/* Include userLoading in the context */}
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () =>{
    const context = useContext(UserDetailContext);
    return context;
}