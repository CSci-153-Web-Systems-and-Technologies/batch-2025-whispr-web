"use client"

import { useEffect, useState }from 'react'
import { Button } from './ui/button'
import { useParams, usePathname } from 'next/navigation';
import { House, User } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';

const Navbar = () => {
  const [isInHome, setIsInHome] = useState(false);
  const [isInProfile, setIsInProfile] = useState(false);
  const pathname = usePathname();
  const params = useParams();

  // Profile Owner
  const anonId = Array.isArray(params.anonId) ? params.anonId[0] : params.anonId; 

  // Profile Visitor (Currently logged in user)
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if(!currentUser) return;
    
    if(pathname.startsWith('/home')) {
      setIsInHome(true);
      setIsInProfile(false);
    } else if(pathname.startsWith(`/profile`) && currentUser && anonId === currentUser.name) {
      setIsInHome(false);
      setIsInProfile(true);
    } else {
      setIsInHome(false);
      setIsInProfile(false); 
    }
  }, [pathname, anonId, currentUser]);

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
