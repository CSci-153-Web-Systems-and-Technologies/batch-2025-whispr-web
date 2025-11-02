import React from 'react'
import FormField from '@/components/FormField'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-separator'
import Link from 'next/link'

const Login = () => {
  return (
    <>
      <h3 className='text-primary text-3xl font-bold mb-5' >Welcome Back!</h3>

      {/* Form Fields */}
      <div className='flex flex-col gap-4 w-full'>
        <FormField
          id="anonymousId"
          type= "text"
          label="Anonymous ID"
        />
        <FormField
          id="password"
          type= "password"
          label="Password"
        />
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center gap-2 justify-start ml-0 w-full">
        <Checkbox id="rememberMe" />
        <Label htmlFor="rememberMe" className='text-sm'>Remember Me</Label>
      </div>
      <Button className='w-full mt-5 cursor-pointer'>Sign In</Button>

      <div className='flex items-center justify-center gap-2 w-full text-sm mt-10'>
        <span>Don't have an account yet?</span>
        <Link href="/register" className='text-primary font-semibold hover:underline'>
          Create an Account
        </Link>        
      </div>
    </>
  )
}

export default Login