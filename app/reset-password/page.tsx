'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const handleResetPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      // Handle password mismatch error
      return
    }
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, code }),
    })
    if (res.ok) {
      router.push('/login?message=Password updated successfully')
    } else {
      // Handle error
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 relative">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 relative">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(false)} />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(true)} />
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleResetPassword}>Reset Password</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
