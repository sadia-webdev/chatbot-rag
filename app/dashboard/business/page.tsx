import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createBusiness } from "./actions";

export default function BusinessPage() {
  return (
    <main className='flex min-h-[calc(100vh-2rem)] items-center justify-center py-10'>
      <Card className='w-lg'>
        <CardHeader>
          <CardTitle className='text-2xl'>Set up your business</CardTitle>
          <CardDescription>
            Tell Kaabe about your business. This information helps your AI
            assistant understand who it represents.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={createBusiness} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Business name</Label>
              <Input
                id='name'
                name='name'
                placeholder='e.g. Sahal Restaurant'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Tell us briefly about your business...'
                rows={5}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone</Label>
              <Input
                id='phone'
                name='phone'
                type='tel'
                placeholder='+252 63 XXX XXXX'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Business email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='hello@business.com'
              />
            </div>

            <Button type='submit' className='w-full bg-accent hover:bg-accent/80 cursor-pointer'>
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
