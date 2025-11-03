"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import FormField from '@/components/FormField'

const page = () => {
  return (
    <>
      <h3 className='text-primary text-2xl font-bold mb-5 text-center' >Generate Your Access Key</h3>

      {/* Form Fields */}
      <form className='w-full flex flex-col items-center gap-4'>
        <div className='flex flex-col gap-4 w-full'>
          <FormField 
            id="anonymousId"
            label="Anonymous ID"
            value="user_1234567890 (test value)"
            type='text'
            isReadOnly={true}
          />
          <FormField 
            id="password"
            label="Password"
            value="passuser_987654321 (test value)"
            type='text'
            isReadOnly={true}
          />
          
        </div>

        <div className='w-full'>
          <Button variant="secondary" type='button' className='w-full mt-5 cursor-pointer'>Save Credentials</Button>
          <Button type='submit' className='w-full mt-2 cursor-pointer'>Sign Up</Button>
        </div>
      </form>

      <div className='flex items-center justify-center gap-2 w-full text-sm mt-10'>
        <span>{"Already have an account?"}</span>
        <Link href="/login" className='text-primary font-semibold hover:underline'>
          Sign in
        </Link>        
      </div>
    </>
  )
}

export default page
