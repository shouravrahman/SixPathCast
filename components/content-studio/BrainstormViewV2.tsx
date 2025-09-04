
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SourceUpload } from "@/components/source/SourceUpload";


// Let's assume lucide-react is used for icons, a common choice with shadcn/ui.
import { Plus, Send, Mic, Clipboard, Bot, User } from "lucide-react";

const BrainstormViewV2 = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full p-4 font-sans">
      {/* Left Panel: Tools */}
      <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Prompt Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="cursor-pointer hover:text-primary">Generate 10 blog post ideas about...</li>
              <li className="cursor-pointer hover:text-primary">Write a video script outline for...</li>
              <li className="cursor-pointer hover:text-primary">Create a list of questions for a podcast about...</li>
              <li className="cursor-pointer hover:text-primary">Draft 5 email subject lines for a product launch...</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Source
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[80vw]">
                <SourceUpload />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

         {/* Center Panel: Chat */}
         <div className="col-span-1 lg:col-span-2 flex flex-col h-[85vh]">
            <Card className="flex-grow flex flex-col">
               <CardHeader>
                  <CardTitle className="text-lg font-semibold">Brainstorm Chat</CardTitle>
               </CardHeader>
               <ScrollArea className="flex-grow p-4">
                  <div className="space-y-4">
                     {/* Chat Messages */}
                     <div className="flex items-start gap-3">
                        <Bot className="h-6 w-6 text-primary" />
                        <div className="bg-muted p-3 rounded-lg max-w-xs">
                           <p className="text-sm">Hello! How can I help you brainstorm today?</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3 justify-end">
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                           <p className="text-sm">I need some ideas for a new marketing campaign for my SaaS product.</p>
                        </div>
                        <User className="h-6 w-6 text-primary" />
                     </div>
                  </div>
               </ScrollArea>
               <Separator />
               <div className="p-4">
                  <div className="relative">
                     <Textarea
                        placeholder="Type your message here... or use the microphone to speak."
                        className="pr-20"
                     />
                     <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex gap-2">
                        <Button variant="ghost" size="icon">
                           <Mic className="h-5 w-5" />
                        </Button>
                        <Button size="icon">
                           <Send className="h-5 w-5" />
                        </Button>
                     </div>
                  </div>
               </div>
            </Card>
         </div>

         {/* Right Panel: Generated Content */}
         <div className="col-span-1 lg:col-span-1 flex flex-col">
            <Card className="flex-grow">
               <CardHeader>
                  <CardTitle className="text-lg font-semibold">Generated Content</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="border p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                           <h4 className="font-semibold">Blog Post Ideas</h4>
                           <Button variant="ghost" size="icon">
                              <Clipboard className="h-4 w-4" />
                           </Button>
                        </div>
                        <ul className="list-disc list-inside text-sm space-y-1">
                           <li>10 Ways to Boost Productivity with Our SaaS</li>
                           <li>The Ultimate Guide to Choosing the Right SaaS</li>
                           <li>From Startup to Scale: A Growth Story</li>
                        </ul>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default BrainstormViewV2;
