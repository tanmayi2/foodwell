'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [supabase] = useState(() => createClient())
  const [redirectTo, setRedirectTo] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    // Set redirect URL on client side only
    setRedirectTo(`${window.location.origin}/auth/callback`)

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/')
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amaranth-pink/10 to-bright-pink-crayola/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome to FoodWell
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to access your personalized meal planning
          </p>
        </CardHeader>
        <CardContent>
          {redirectTo && (
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                    },
                  },
                },
              }}
              providers={['google', 'github']}
              redirectTo={redirectTo}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
