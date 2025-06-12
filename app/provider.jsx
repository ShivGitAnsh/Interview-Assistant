"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabaseClient'
// import { User } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'

console.log('🛎️ Provider file loaded');


function Provider({ children }) {
    
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true); 

    useEffect(() => {
       CreateNewUser()
    },[])
    
    const CreateNewUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) return;

    const { data: Users, error } = await supabase
        .from('Users')
        .select("*")
        .eq('email', user.email);

    if (Users?.length === 0) {
        const { data, error } = await supabase.from('Users').insert([{
            name: user.user_metadata?.name,
            email: user.email,
            picture: user.user_metadata?.picture,
        }]);
        setUser(data);
    } else {
        setUser(Users[0]);
    }
};
    return (
        <UserDetailContext.Provider value={{user, setUser}} >
        <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider

export const useUser = () =>{
    const context = useContext(UserDetailContext);
    return context;
}