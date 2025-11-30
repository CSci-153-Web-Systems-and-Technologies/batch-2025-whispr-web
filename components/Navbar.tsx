"use client"

import React, { useEffect, useState }from 'react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation';
import { House, User } from 'lucide-react';
import Link from 'next/link';


const Navbar = () => {
  const [isInHome, setIsInHome] = useState(false);
  const [isInProfile, setIsInProfile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if(pathname.startsWith('/home')) {
      setIsInHome(true);
      setIsInProfile(false);
    } else {
      setIsInHome(false);
      setIsInProfile(true); 
    }
  }, [pathname]);

  if (pathname.startsWith('/chat')) return null;

  return (
    <div className='flex items-center justify-between py-4 px-10 shadow-md fixed top-0 left-0 right-0 z-10 bg-white'>
      <span className='text-primary text-xl font-medium'>WHISPR</span>
      <div>
        <Link href="/home" aria-label='Go to Home Page'>
          <Button variant={isInHome ? "default" : "outline"} className='mr-4 rounded-full'>
            <House fill={isInHome ? "white" : "none"} strokeWidth={3}/>
            {isInHome ? "Home" : ""}
          </Button>
        </Link>
        <Link href="/profile" aria-label='Go to Profile Page'>
          <Button variant={isInProfile ? "default" : "outline"} className='mr-4 rounded-full hover:fill-'>
            <User fill={isInProfile ? "white" : "none"} strokeWidth={3}/>
            {isInProfile ? "Profile" : ""}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
