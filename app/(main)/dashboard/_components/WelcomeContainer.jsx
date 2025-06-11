'use client';

import { useUser } from '@/app/provider';
import Image from 'next/image';
import React, { useState } from 'react';
import ProfileContainer from './ProfileContainer';

function WelcomeContainer() {
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  return (
    <div className='bg-white p-5 rounded-xl flex justify-between items-center relative'>
      <div>
        <h2 className='text-lg font-bold'>Welcome Back, {user?.name}</h2>
        <h2 className='text-gray-500'>
          AI-driven mock interviews designed to elevate your interview performance
        </h2>
      </div>

      {user && (
        <div className="relative">
          {user.picture ? (
            <Image
              src={user.picture}
              alt="userAvatar"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
              onClick={toggleMenu}
            />
          ) : (
            <div
              onClick={toggleMenu}
              className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center font-bold cursor-pointer"
            >
              P
            </div>
          )}
          {showMenu && <ProfileContainer onClose={closeMenu} />}
        </div>
      )}
    </div>
  );
}

export default WelcomeContainer;
