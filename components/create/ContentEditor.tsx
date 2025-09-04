'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, Link, Bold, Italic, Strikethrough, Code, List, ListOrdered } from 'lucide-react';
import MediaLibraryDialog from './MediaLibraryDialog';
import LeadMagnetDialog from './LeadMagnetDialog';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image'; // Import ImageExtension

export default function ContentEditor({
   content,
   platform,
   isEditing,
   onEdit,
   onSave,
   onChange,
   showActions = true
}) {
   const [showMediaDialog, setShowMediaDialog] = useState(false);
   const [showLeadMagnetDialog, setShowLeadMagnetDialog] = useState(false);

   const editor = useEditor({
      extensions: [
         StarterKit,
         ImageExtension.configure({ // Add ImageExtension
            inline: true,
            allowBase64: true,
         }),
      ],
      content: content,
      onUpdate: ({ editor }) => {
         onChange(editor.getHTML());
      },
      immediatelyRender: false
   });

   useEffect(() => {
      if (editor && content !== editor.getHTML()) {
         editor.commands.setContent(content, false);
      }
   }, [content, editor]);

   const handleSelectMedia = (media) => {
      if (editor && media.type === 'image') {
         editor.chain().focus().setImage({ src: media.url }).run();
      }
   };

   const MenuBar = () => {
      if (!editor) {
         return null;
      }

      return (
         <div className="flex flex-wrap gap-1 p-2 border-b border-border   rounded-t-lg">
            <Button
               size="sm"
               variant="ghost"
               onClick={() => editor.chain().focus().toggleBold().run()}
               disabled={!editor.can().chain().focus().toggleBold().run()}
               className={editor.isActive('bold') ? 'is-active      ' : '   '}
            >
               <Bold className="h-4 w-4" />
            </Button>
            <Button
               size="sm"
               variant="ghost"
               onClick={() => editor.chain().focus().toggleItalic().run()}
               disabled={!editor.can().chain().focus().toggleItalic().run()}
               className={editor.isActive('italic') ? 'is-active      ' : '   '}
            >
               <Italic className="h-4 w-4" />
            </Button>
            <Button
               size="sm"
               variant="ghost"
               onClick={() => editor.chain().focus().toggleStrike().run()}
               disabled={!editor.can().chain().focus().toggleStrike().run()}
               className={editor.isActive('strike') ? 'is-active      ' : '   '}
            >
               <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
               size="sm"
               variant="ghost"
               onClick={() => editor.chain().focus().toggleCode().run()}
               disabled={!editor.can().chain().focus().toggleCode().run()}
               className={editor.isActive('code') ? 'is-active      ' : '   '}
            >
               <Code className="h-4 w-4" />
            </Button>
            <Button
               size="sm"
               variant="ghost"
               onClick={() => editor.chain().focus().toggleBulletList().run()}
               disabled={!editor.can().chain().focus().toggleBulletList().run()}
               className={editor.isActive('bulletList') ? 'is-active      ' : '   '}
            >
               <List className="h-4 w-4" />
            </Button>
            <Button
               size="sm"
               variant="ghost"
               onClick={() => editor.chain().focus().toggleOrderedList().run()}
               disabled={!editor.can().chain().focus().toggleOrderedList().run()}
               className={editor.isActive('orderedList') ? 'is-active      ' : '   '}
            >
               <ListOrdered className="h-4 w-4" />
            </Button>
         </div>
      );
   };

   return (
      <Card  >
         <CardContent className="p-0">
            {isEditing ? (
               <div className="space-y-3">
                  <MenuBar />
                  <EditorContent editor={editor} className="min-h-[200px] p-3     prose prose-invert max-w-none" />
                  <div className="flex items-center justify-between p-3">
                     <Badge variant="outline" className="text-xs">
                        {content.length}/{platform.limit} chars
                     </Badge>
                     {showActions && <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setShowMediaDialog(true)}>
                           <ImageIcon className="h-4 w-4 mr-2" />
                           Media
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowLeadMagnetDialog(true)}>
                           <Link className="h-4 w-4 mr-2" />
                           Lead Magnet
                        </Button>
                        <div className="flex-grow" />
                        <Button size="sm" variant="outline" onClick={onEdit}>
                           Cancel
                        </Button>
                        <Button size="sm" onClick={onSave}>
                           Save Changes
                        </Button>
                     </div>}
                  </div>
               </div>
            ) : (
               <div className="space-y-3 p-4">
                  <div className="  rounded-lg p-3 min-h-[200px]">
                     <div className="    text-sm prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                  <div className="flex items-center justify-between">
                     <Badge variant="outline" className="text-xs">
                        {content.length}/{platform.limit} chars
                     </Badge>
                     {showActions && <Button size="sm" variant="outline" onClick={onEdit}>
                        Edit Content
                     </Button>}
                  </div>
               </div>
            )}
         </CardContent>
         <MediaLibraryDialog onSelectMedia={handleSelectMedia} open={showMediaDialog} onOpenChange={setShowMediaDialog} />
         <LeadMagnetDialog onSelectLeadMagnet={() => { }} open={showLeadMagnetDialog} onOpenChange={setShowLeadMagnetDialog} />
      </Card>
   );
}
