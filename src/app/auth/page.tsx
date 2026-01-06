'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AuthBranding from './components/AuthBranding'
import LoginForm from './components/LoginForm'
import SignupForm from './components/signup/SignupForm'


const Auth = () => {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'login'
  const isLogin = (mode === 'login')

  return (
    <div className="flex h-screen w-screen bg-white">      
    <AuthBranding />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full overflow-y-scroll max-h-screen">
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm/>
          )}
        </div>
      </div>
    </div>
  )
}

const AuthPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Auth />
  </Suspense>
)

export default AuthPage