'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import posthog from 'posthog-js'
import { useEffect } from 'react'
import { useUser } from '@/hooks/useUserStore'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false // We're handling this manually to get route changes in Next.js
  })
}

function PostHogPageview(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const { user } = useUser()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        '$current_url': url,
      })
    }
  }, [pathname, searchParams, posthog])

  useEffect(() => {
    if (user && posthog) {
      posthog.identify(user.id, {
        email: user.email,
        ...user.profile,
      })
    } else if (!user && posthog) {
      posthog.reset()
    }
  }, [user, posthog])


  return null
}


export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== 'production') {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <PostHogPageview />
      {children}
    </PHProvider>
  )
}
