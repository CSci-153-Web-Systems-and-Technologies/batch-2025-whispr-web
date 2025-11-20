"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import FormField from '@/components/FormField'
import { generateAnonId, generatePassword } from '@/lib/generateCredential'
import { Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

const page = () => {
  const [credentials, setCredentials] = useState<{anonId: string, password: string}>({
    anonId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const newAnonId = generateAnonId();
    const newPassword = generatePassword();
    setCredentials({
      anonId: newAnonId,
      password: newPassword
    });
  }, []);

  const handleSave = () => {
    const content = `Your Whispr Credentials\n\nAnonymous ID: ${credentials.anonId}\nPassword: ${credentials.password}\n\nKeep this file private and secure.`

    const blob = new Blob([content], { type: "text/plain" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "whispr_credentials.txt"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          anonId: credentials.anonId,
          password: credentials.password
        })
      });

      const data = await response.json();

      if(!response.ok) {
        toast.error(data.error || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");
      router.push('/login')
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Error during sign up:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h3 className='text-primary text-2xl font-bold mb-5 text-center' >Generate Your Access Key</h3>

      {/* Form Fields */}
      <form onSubmit={handleSignUp} className='w-full flex flex-col items-center gap-4'>
        <div className='flex flex-col gap-4 w-full'>
          <FormField 
            id="anonymousId"
            label="Anonymous ID"
            value={credentials.anonId}
            type='text'
            isReadOnly={true}
          />
          <FormField 
            id="password"
            label="Password"
            value={credentials.password}
            type='text'
            isReadOnly={true}
          />  
        </div>

        <div className='w-full'>
          <Button variant="secondary" type='button' className='w-full mt-5 cursor-pointer'
            onClick={handleSave}
          >
            <Download />
            Save Credentials
          </Button>
          <Button 
            type='submit'
            disabled={isLoading} 
            className='w-full mt-2 cursor-pointer'>
              {
                isLoading ? 
                <>
                  <Spinner /> 
                  Creating Account...
                </> :
                "Sign Up"
              }
          </Button>
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
