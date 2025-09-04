'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Icons } from '@/components/shared/Icons';
import { signInWithGoogle } from '@/utils/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export default function LoginPage() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const router = useRouter();
   //   const { toast } = useToast();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
         });

         if (response.ok) {
            toast.success('Logged in successfully!');
            router.push('/dashboard');
         } else {
            const errorData = await response.json();
            toast.error(errorData.error);
         }
      } catch (error) {
         toast.error('An unexpected error occurred.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <AuthLayout
         title="Welcome back"
         description="Enter your email to sign in to your account"
      >
         <Card>
            <form onSubmit={handleSubmit}>
               <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Sign in</CardTitle>
               </CardHeader>
               <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 gap-2">
                     <Button variant="outline" onClick={signInWithGoogle} type="button" disabled={isLoading}>
                        <Icons.google className="mr-2 h-4 w-4" />
                        Google
                     </Button>
                  </div>
                  <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                     </div>
                     <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                           Or continue with
                        </span>
                     </div>
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="email">Email</Label>
                     <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="grid gap-2 relative">
                     <Label htmlFor="password">Password</Label>
                     <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                     <Button variant="ghost" type="button" size="icon" className="absolute right-1 top-7 h-7 w-7" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                        {showPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                     </Button>
                  </div>
               </CardContent>
               <CardFooter className="flex flex-col gap-4">
                  <Button onSubmit={handleSubmit} className="w-full" type="submit" disabled={isLoading}>
                     {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                     Sign In
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                     Don't have an account?{' '}
                     <Link href="/signup" className="underline hover:text-primary">
                        Sign up
                     </Link>
                  </p>
               </CardFooter>
            </form>
         </Card>
      </AuthLayout>
   );
}
