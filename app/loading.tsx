"use client"

import React from 'react'
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );
}

export default Loading
