import { BookOpen, FileText, Upload } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadDocument } from "./actions";
import { Input } from "@base-ui/react";

export default function KnowledgePage() {
  return (
    <main className='mx-auto w-full max-w-5xl space-y-8 py-6'>
      {/* Header */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Knowledge base
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Give Kaabe the information it needs to answer your customers.
          </p>
        </div>

        <Button className='bg-accent hover:bg-accent/80'>
          <Upload className='mr-2 size-4' />
          Upload document
        </Button>
      </div>

      {/* Empty state */}
      <form action={uploadDocument}>
        <Card className='border-dashed'>
          <CardContent className='flex min-h-[420px] flex-col items-center justify-center text-center'>
            <div className='mb-5 flex size-14 items-center justify-center rounded-xl bg-muted'>
              <BookOpen className='size-7 text-muted-foreground' />
            </div>

            <h2 className='text-lg font-semibold'>
              Upload your business knowledge
            </h2>

            <p className='mt-2 max-w-md text-sm leading-6 text-muted-foreground'>
              Upload a PDF containing your menu, services, policies, FAQs, or
              other business information.
            </p>
            
            <div className='mt-6'>
              <Input
                type='file'
                name='file'
                accept='application/pdf'
                required
                className="pl-28"
              />
            </div>

            <Button type='submit' className='mt-6'>
              <Upload className='mr-2 size-4' />
              Upload document
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* What can be uploaded */}
      <div>
        <h2 className='mb-4 text-sm font-medium'>What can you add?</h2>

        <div className='grid gap-4 sm:grid-cols-3'>
          <Card>
            <CardHeader>
              <FileText className='mb-2 size-5 text-accent' />
              <CardTitle className='text-base'>Menus & Prices</CardTitle>
              <CardDescription>
                Products, services, prices, and packages.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className='mb-2 size-5 text-accent' />
              <CardTitle className='text-base'>Business Information</CardTitle>
              <CardDescription>
                Opening hours, location, contact details, and policies.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className='mb-2 size-5 text-accent' />
              <CardTitle className='text-base'>FAQs</CardTitle>
              <CardDescription>
                Common questions and answers from your customers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}