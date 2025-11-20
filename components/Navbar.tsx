"use client"

import React, { useEffect, useState }from 'react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { House, User } from 'lucide-react';


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
      setIsInProfile(false); 
    }
  }, []);

  return (
    <div className='flex items-center justify-between py-4 px-10 shadow-md fixed top-0 left-0 right-0 z-10 bg-white'>
      <span className='text-primary text-xl font-medium'>WHISPR</span>
      <div>
        <Button variant={isInHome ? "default" : "outline"} className='mr-4 rounded-full'>
          <House fill={isInHome ? "white" : "none"} strokeWidth={3}/>
          {isInHome ? "Home" : ""}
        </Button>
        <Button variant={isInProfile ? "default" : "outline"} className='mr-4 rounded-full hover:fill-'>
          <User fill={isInProfile ? "white" : "none"} strokeWidth={3}/>
          {isInProfile ? "Profile" : ""}
        </Button>
      </div>
    </div>
  )
}

export default Navbar
