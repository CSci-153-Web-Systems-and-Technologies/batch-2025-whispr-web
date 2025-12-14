"use client"

import FormField from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface AuthErrorTypes{
  anonIdError?: string,
  passwordError?: string
}

const Login = () => {
  const [errors, setErrors] = useState<AuthErrorTypes>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const anonId = (formData.get("anonymousId") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    const newErrors: AuthErrorTypes = {};
    if(!anonId) newErrors.anonIdError = "Anonymous Id is required."
    if(!password) newErrors.passwordError = "Password is required."

    setErrors(newErrors);
    if(Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ anonId, password })
      });

      const data = await response.json();

      if(!response.ok) {
        toast.error(data.error || "Login failed. Please try again.");
        return;
      }

      toast.success("Logged in successfully!");
      router.push('/home');

    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
    
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
      <form onSubmit={handleSubmit} className='w-full flex max-sm:flex-1 flex-col items-center gap-4'>
        <div className='flex flex-col gap-4 w-full'>
          <FormField
            id="anonymousId"
            type="text"
            label="Anonymous ID"
            autoComplete="username"
            error={errors.anonIdError}
            onChange={(e) => handleChange("anonIdError", e.target.value)}
          />
          <FormField
            id="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            error={errors.passwordError}
            onChange={(e) => handleChange("passwordError", e.target.value)}
          />
        </div>

        <Button type='submit' disabled={isLoading} className='w-full mt-5 cursor-pointer'>
          {isLoading ? (
            <>
              <Spinner />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
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