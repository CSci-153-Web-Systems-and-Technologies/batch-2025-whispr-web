import React, { use } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar';

const CustomAvatar = ({children} : {children : React.ReactNode}) => {
  return (
    <Avatar className='w-10 h-10'>
      <AvatarFallback className='bg-secondary font-medium text-sm'>
        {children}
      </AvatarFallback>
    </Avatar>
  );
}

export default CustomAvatar
