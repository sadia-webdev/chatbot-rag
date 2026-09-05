"use client"
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'

const page = () => {
  return (
    <div>
        <Button onClick={() => signIn.social({provider: "google"})}>Sign in with google</Button>
    </div>
  )
}

export default page