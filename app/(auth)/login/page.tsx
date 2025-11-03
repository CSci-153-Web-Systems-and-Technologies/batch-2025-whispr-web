"use client"

import React, { useState } from 'react'
import FormField from '@/components/FormField'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AuthErrorTypes{
  anonIdError?: string,
  passwordError?: string
}

const Login = () => {
  const [errors, setErrors] = useState<AuthErrorTypes>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const anonId = (formData.get("anonymousId") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    const newErrors: AuthErrorTypes = {};
    if(!anonId) newErrors.anonIdError = "Anonymous Id is required."
    if(!password) newErrors.passwordError = "Password is required."

    setErrors(newErrors);
    if(Object.keys(newErrors).length > 0) return;
  }

  const handleChange = (
    field: keyof AuthErrorTypes,
    value: string
  ) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      
      if (value.trim().length > 0) {
        newErrors[field] = undefined;
      } else {
        if (field === "anonIdError") newErrors[field] = "Anonymous ID is required."
        if (field === "passwordError") newErrors[field] = "Password is required."
      }
      
      return newErrors;
    });
  }

  return (
    <>
      <h3 className='text-primary text-3xl font-bold mb-5' >Welcome Back!</h3>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4'>
        <div className='flex flex-col gap-4 w-full'>
          <FormField
            id="anonymousId"
            type= "text"
            label="Anonymous ID"
            error={errors.anonIdError}
            onChange={(e) => handleChange("anonIdError", e.target.value)}
          />
          <FormField
            id="password"
            type= "password"
            label="Password"
            error={errors.passwordError}
            onChange={(e) => handleChange("passwordError", e.target.value)}
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 justify-start ml-0 w-full">
          <Checkbox id="rememberMe" />
          <Label htmlFor="rememberMe" className='text-sm'>Remember Me</Label>
        </div>
        <Button type='submit' className='w-full mt-5 cursor-pointer'>Sign In</Button>
      </form>

      <div className='flex items-center justify-center gap-2 w-full text-sm mt-10'>
        <span>{"Don't have an account yet?"}</span>
        <Link href="/register" className='text-primary font-semibold hover:underline'>
          Create an Account
        </Link>        
      </div>
    </>
  )
}

export default Login