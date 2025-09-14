import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amaranth-pink/10 to-bright-pink-crayola/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            There was an error during the authentication process. Please try signing in again.
          </p>
          <Button asChild>
            <Link href="/login">
              Back to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
