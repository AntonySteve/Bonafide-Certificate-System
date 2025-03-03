'use client'

import React from 'react'
import { useRouter } from 'next/navigation';

export default function Header() {
const handleClick = (e) => {
    e.preventDefault();
    router.push('/login');
}
  const router = useRouter();
  return (
    <div>
        
          <button className='px-4 py-2 bg-white' onClick={handleClick}>
                Login
         </button>
    </div>
  )
}
