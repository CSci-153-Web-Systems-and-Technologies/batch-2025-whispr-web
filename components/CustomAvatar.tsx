import React, { use } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar';
import { getInitials } from '@/lib/get-initials';

interface CustomAvatarProps {
  name: string | undefined;
  isOwner?: boolean;
}

const CustomAvatar = ({name, isOwner} : CustomAvatarProps) => {
  return (
    <Avatar className='w-10 h-10'>
      <AvatarFallback className={`${isOwner && isOwner === true ? 'bg-primary text-white' : 'bg-secondary'} font-medium text-sm`}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export default CustomAvatar
