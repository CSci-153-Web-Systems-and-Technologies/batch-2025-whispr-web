"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from '@/hooks/use-current-user';
import { House, LogOut, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


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
      <DropdownMenu>
        <DropdownMenuTrigger className='text-primary sm:hidden'>
          <Menu />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href="/home" aria-label='Go to Home Page'>
              <Button variant={isInHome ? 'default' : 'ghost'} className='rounded-md w-full'>
                <House fill={isInHome ? "white" : "none"} className={isInHome ? 'text-white' : 'text-black'}/>
                Home
              </Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" aria-label='Go to Home Page'>
              <Button variant={isInProfile ? 'default' : 'ghost'} className='rounded-md w-full'>
                <User strokeWidth={3} className={isInProfile ? 'text-white' : 'text-black'}/>
                Profile
              </Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/logout" aria-label='Go to Home Page'>
              <Button variant='ghost' className='rounded-md w-full text-destructive'>
                <LogOut className="text-inherit" strokeWidth={3}/>
                Logout
              </Button>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className='hidden sm:flex'>
        <Link href="/home" aria-label='Go to Home Page'>
          <Button variant={isInHome ? "default" : "outline"} className='mr-4 rounded-full hover:fill-'>
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
