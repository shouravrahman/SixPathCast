"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SourceUpload() {
   return (
      <Card>
         <CardHeader>
            <div className="flex justify-between items-start">
               <div>
                  <CardTitle>Add sources</CardTitle>
                  <CardDescription className="mt-2">
                     Sources let ContentRasengan base its responses on the information that matters most to you. (Examples: marketing plans, course reading, research notes, meeting transcripts, sales documents, etc.)
                  </CardDescription>
               </div>
               <Dialog>
                  <DialogTrigger asChild>
                     <Button variant="default">Discover Sources</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>What are you interested in?</DialogTitle>
                        <DialogDescription>
                           Describe something that you'd like to learn about or click 'I'm
                           feeling curious' to explore a new topic.
                        </DialogDescription>
                     </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <div className="grid w-full gap-1.5">
                           <Label htmlFor="interest">Your Interest</Label>
                           <Input id="interest" placeholder="e.g., The history of AI" />
                        </div>
                     </div>
                     <DialogFooter>
                        <Button type="submit">Submit</Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
               <p className="mb-2">Drag and drop or choose file to upload</p>
               <p className="text-sm text-gray-500">
                  Supported file types: PDF, .txt, Markdown, Audio (e.g. mp3)
               </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <Button variant="secondary">Google Drive</Button>
               <Button variant="secondary">Link</Button>
               <Button variant="secondary">Paste text</Button>
            </div>
            <div className="text-center text-sm text-gray-500">
               <span>Source limit: </span>
               <span>0/50</span>
            </div>
         </CardContent>
      </Card>
   );
}
