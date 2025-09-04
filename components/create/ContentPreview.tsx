'use client';

import { useState } from 'react';
import {
   Edit,
   Save,
   RefreshCw,
   Calendar,
   Send,
   Plus,
   Copy,
   Share2,
   Eye,
   Image as ImageIcon,
   Video,
   Link,
   Wand2,
   X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaPinterest, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';

const PlatformIcons = {
   twitter: FaTwitter,
   linkedin: FaLinkedinIn,
   instagram: FaInstagram,
   youtube: FaYoutube,
   facebook: FaFacebook,
   tiktok: FaTiktok,
   pinterest: FaPinterest
};


const platforms = {
   twitter: { name: 'Twitter/X', color: 'bg-black', limit: 280 },
   linkedin: { name: 'LinkedIn', color: 'bg-blue-700', limit: 3000 },
   instagram: { name: 'Instagram', color: '  ', limit: 2200 },
   facebook: { name: 'Facebook', color: '  ', limit: 63206 },
   tiktok: { name: 'TikTok', color: 'bg-black', limit: 2200 },
   youtube: { name: 'YouTube', color: 'bg-red-600', limit: 5000 },
   pinterest: { name: 'Pinterest', color: 'bg-red-500', limit: 500 }
};

// Mock media library data
const mockMediaLibrary = [
   {
      id: 1,
      name: 'Hero Image',
      type: 'image',
      url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=200'
   },
   {
      id: 2,
      name: 'Team Video',
      type: 'video',
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200'
   },
   {
      id: 3,
      name: 'Brand Logo',
      type: 'image',
      url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200'
   }
];

const mockLeadMagnets = [
   { id: 1, title: 'AI Productivity Guide', url: 'https://example.com/guide' },
   { id: 2, title: 'Social Media Templates', url: 'https://example.com/templates' },
   { id: 3, title: 'Brand Building Checklist', url: 'https://example.com/checklist' }
];

export default function ContentPreview({
   platformId,
   postType,
   content,
   editingContent,
   setEditingContent,
   setGeneratedContent,
   onSchedule
}) {
   const [showMediaModal, setShowMediaModal] = useState(false);
   const [showAIImageModal, setShowAIImageModal] = useState(false);
   const [attachedMedia, setAttachedMedia] = useState([]);
   const [attachedLeadMagnets, setAttachedLeadMagnets] = useState([]);
   const [aiImagePrompt, setAiImagePrompt] = useState('');

   const platform = platforms[platformId];
   const PlatformIcon = PlatformIcons[platformId];
   const isEditing = editingContent[`${platformId}-${postType}`] !== undefined;

   const handleEdit = () => {
      if (isEditing) {
         // Save changes
         setGeneratedContent(prev => ({
            ...prev,
            [`${platformId}-${postType}`]: {
               ...prev[`${platformId}-${postType}`],
               text: editingContent[`${platformId}-${postType}`]
            }
         }));
         setEditingContent(prev => {
            const newState = { ...prev };
            delete newState[`${platformId}-${postType}`];
            return newState;
         });
      } else {
         // Start editing
         setEditingContent(prev => ({
            ...prev,
            [`${platformId}-${postType}`]: content.text
         }));
      }
   };

   const handleRegenerate = () => {
      // Regenerate content logic would go here
      setGeneratedContent(prev => ({
         ...prev,
         [`${platformId}-${postType}`]: {
            ...prev[`${platformId}-${postType}`],
            text: content.text + ' [Regenerated]',
            engagement_prediction: Math.floor(Math.random() * 100) + 50,
         }
      }));
   };

   const addMedia = (media) => {
      setAttachedMedia(prev => [...prev, media]);
      setShowMediaModal(false);
   };

   const addLeadMagnet = (leadMagnet) => {
      setAttachedLeadMagnets(prev => [...prev, leadMagnet]);
   };

   const removeMedia = (mediaId) => {
      setAttachedMedia(prev => prev.filter(m => m.id !== mediaId));
   };

   const removeLeadMagnet = (leadMagnetId) => {
      setAttachedLeadMagnets(prev => prev.filter(lm => lm.id !== leadMagnetId));
   };

   const generateAIImage = () => {
      // Mock AI image generation
      const newImage = {
         id: Date.now(),
         name: 'AI Generated Image',
         type: 'image',
         url: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg',
         thumbnail: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=200'
      };
      setAttachedMedia(prev => [...prev, newImage]);
      setShowAIImageModal(false);
      setAiImagePrompt('');
   };

   const renderPlatformPreview = () => {
      const currentText = isEditing ? editingContent[`${platformId}-${postType}`] : content.text;

      switch (platformId) {
         case 'twitter':
            if (postType === 'thread') {
               return (
                  <div className="  rounded-lg p-4 text-black max-w-md space-y-3">
                     {content.tweets?.map((tweet, index) => (
                        <div key={index} className="border-l-2    pl-3">
                           <div className="flex items-start space-x-3">
                              <div className="w-8 h-8   rounded-full"></div>
                              <div className="flex-1">
                                 <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold text-sm">Your Name</span>
                                    <span className="text-muted-foreground text-sm">@username</span>
                                    <span className="text-muted-foreground text-sm">·</span>
                                    <span className="text-muted-foreground text-sm">now</span>
                                 </div>
                                 <p className="text-sm">{tweet.content}</p>
                                 <div className="text-xs text-muted-foreground mt-1">{index + 1}/{content.tweets.length}</div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               );
            }
            return (
               <div className="  rounded-lg p-4 text-black max-w-md">
                  <div className="flex items-start space-x-3">
                     <div className="w-10 h-10   rounded-full"></div>
                     <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                           <span className="font-semibold">Your Name</span>
                           <span className="text-muted-foreground">@username</span>
                           <span className="text-muted-foreground">·</span>
                           <span className="text-muted-foreground">now</span>
                        </div>
                        <p className="text-sm">{currentText}</p>
                        {attachedMedia.length > 0 && (
                           <div className="mt-2 grid grid-cols-2 gap-1">
                              {attachedMedia.slice(0, 4).map((media) => (
                                 <img key={media.id} src={media.thumbnail} alt={media.name} className="w-full h-20 object-cover rounded" />
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            );

         case 'linkedin':
            if (postType === 'carousel') {
               return (
                  <div className="  rounded-lg p-4 text-black max-w-lg">
                     <div className="flex items-start space-x-3 mb-3">
                        <div className="w-12 h-12   rounded-full"></div>
                        <div>
                           <div className="font-semibold">Your Name</div>
                           <div className="text-sm text-muted-foreground">Your Title • 1st</div>
                           <div className="text-xs text-muted-foreground">now</div>
                        </div>
                     </div>
                     <p className="text-sm whitespace-pre-wrap mb-3">{currentText}</p>
                     <div className=" rounded-lg p-4">
                        <div className="text-center text-muted-foreground text-sm">Carousel Preview</div>
                        <div className="flex justify-center space-x-2 mt-2">
                           {content.slides?.slice(0, 3).map((_, index) => (
                              <div key={index} className="w-2 h-2    rounded-full"></div>
                           ))}
                        </div>
                     </div>
                  </div>
               );
            }
            return (
               <div className="  rounded-lg p-4 text-black max-w-lg">
                  <div className="flex items-start space-x-3 mb-3">
                     <div className="w-12 h-12   rounded-full"></div>
                     <div>
                        <div className="font-semibold">Your Name</div>
                        <div className="text-sm text-muted-foreground">Your Title • 1st</div>
                        <div className="text-xs text-muted-foreground">now</div>
                     </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{currentText}</p>
                  {attachedMedia.length > 0 && (
                     <div className="mt-3">
                        <img src={attachedMedia[0].thumbnail} alt={attachedMedia[0].name} className="w-full h-40 object-cover rounded" />
                     </div>
                  )}
               </div>
            );

         case 'instagram':
            if (postType === 'story') {
               return (
                  <div className="bg-gradient-to-b from-purple-500 to-pink-500 rounded-lg     max-w-xs mx-auto" style={{ aspectRatio: '9/16' }}>
                     <div className="p-4 h-full flex flex-col justify-between">
                        <div className="flex items-center space-x-2">
                           <div className="w-8 h-8   rounded-full"></div>
                           <span className="text-sm font-medium">username</span>
                        </div>
                        <div className="text-center">
                           <p className="text-sm">{currentText}</p>
                        </div>
                     </div>
                  </div>
               );
            }
            return (
               <div className="  rounded-lg text-black max-w-sm">
                  <div className="aspect-square   rounded-t-lg flex items-center justify-center relative">
                     {attachedMedia.length > 0 ? (
                        <img src={attachedMedia[0].thumbnail} alt={attachedMedia[0].name} className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-muted-foreground">Image/Video</span>
                     )}
                  </div>
                  <div className="p-4">
                     <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8   rounded-full"></div>
                        <span className="font-semibold text-sm">username</span>
                     </div>
                     <p className="text-sm">{currentText}</p>
                  </div>
               </div>
            );

         default:
            return (
               <div className="  rounded-lg p-4">
                  <p className="    text-sm whitespace-pre-wrap">{currentText}</p>
                  {attachedMedia.length > 0 && (
                     <div className="mt-3 grid grid-cols-2 gap-2">
                        {attachedMedia.map((media) => (
                           <img key={media.id} src={media.thumbnail} alt={media.name} className="w-full h-20 object-cover rounded" />
                        ))}
                     </div>
                  )}
               </div>
            );
      }
   };

   return (
      <>
         <Card  >
            <CardContent className="p-6">
               {/* Header */}
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                     <div className={`w-6 h-6 rounded flex items-center justify-center     ${platform.color}`}>
                        <PlatformIcon />
                     </div>
                     <span className="text-sm font-medium    ">{platform.name}</span>
                     <Badge variant="secondary" className="text-xs">
                        {postType}
                     </Badge>
                  </div>
                  <Badge variant="secondary" className="bg-green-600">
                     {content.engagement_prediction}% engagement
                  </Badge>
               </div>

               {/* Content Editor/Preview */}
               {isEditing ? (
                  <div className="mb-4">
                     <Textarea
                        value={editingContent[`${platformId}-${postType}`]}
                        onChange={(e) => setEditingContent(prev => ({
                           ...prev,
                           [`${platformId}-${postType}`]: e.target.value
                        }))}
                        className="   border-border     resize-none min-h-[120px]"
                        rows={6}
                     />
                     <div className="flex items-center justify-between mt-2 text-xs    ">
                        <span>Editing mode</span>
                        <span>{editingContent[`${platformId}-${postType}`]?.length || 0}/{platform.limit} chars</span>
                     </div>
                  </div>
               ) : (
                  <div className="mb-4">
                     <div className="  rounded-lg p-3 mb-3">
                        <pre className="    text-sm whitespace-pre-wrap">{content.text}</pre>
                     </div>

                     {/* Platform-specific preview */}
                     <div className="mb-3">
                        <div className="text-xs     mb-2 flex items-center">
                           <Eye className="h-3 w-3 mr-1" />
                           Live Preview
                        </div>
                        {renderPlatformPreview()}
                     </div>
                  </div>
               )}

               {/* Attached Media */}
               {attachedMedia.length > 0 && (
                  <div className="mb-4">
                     <div className="text-xs     mb-2">Attached Media:</div>
                     <div className="flex flex-wrap gap-2">
                        {attachedMedia.map((media) => (
                           <div key={media.id} className="relative">
                              <img src={media.thumbnail} alt={media.name} className="w-16 h-16 object-cover rounded" />
                              <button
                                 onClick={() => removeMedia(media.id)}
                                 className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                              >
                                 <X className="h-2 w-2    " />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Attached Lead Magnets */}
               {attachedLeadMagnets.length > 0 && (
                  <div className="mb-4">
                     <div className="text-xs     mb-2">Lead Magnets:</div>
                     <div className="space-y-1">
                        {attachedLeadMagnets.map((lm) => (
                           <div key={lm.id} className="flex items-center justify-between   rounded p-2">
                              <span className="text-xs    ">{lm.title}</span>
                              <button
                                 onClick={() => removeLeadMagnet(lm.id)}
                                 className="text-red-400 hover:text-red-300"
                              >
                                 <X className="h-3 w-3" />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Special content types */}
               {postType === 'video' && content.script && (
                  <div className="space-y-2 mb-4">
                     <h4 className="text-sm font-medium text-purple-300">Video Script:</h4>
                     <div className="  rounded-lg p-3">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{content.script}</pre>
                     </div>
                     {content.captions && (
                        <>
                           <h4 className="text-sm font-medium text-purple-300">Captions:</h4>
                           <div className="  rounded-lg p-3">
                              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{content.captions}</pre>
                           </div>
                        </>
                     )}
                  </div>
               )}

               {postType === 'carousel' && content.slides && (
                  <div className="space-y-2 mb-4">
                     <h4 className="text-sm font-medium text-purple-300">Carousel Slides:</h4>
                     <div className="grid grid-cols-1 gap-2">
                        {content.slides.map((slide, index) => (
                           <div key={index} className="  rounded-lg p-3">
                              <div className="text-xs text-purple-400 mb-1">Slide {slide.slide}</div>
                              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{slide.content}</pre>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {postType === 'thread' && content.tweets && (
                  <div className="space-y-2 mb-4">
                     <h4 className="text-sm font-medium text-purple-300">Thread Tweets:</h4>
                     <div className="space-y-2">
                        {content.tweets.map((tweet, index) => (
                           <div key={index} className="  rounded-lg p-3">
                              <div className="text-xs text-purple-400 mb-1">Tweet {tweet.tweet}</div>
                              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{tweet.content}</pre>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Stats */}
               <div className="flex items-center justify-between text-xs     mb-4">
                  <span>Best time: {content.best_time}</span>
                  <span>{content.text?.length}/{platform.limit} chars</span>
               </div>

               {/* Action Buttons */}
               <div className="grid grid-cols-4 gap-2">
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={handleEdit}
                     className="text-xs"
                  >
                     {isEditing ? (
                        <>
                           <Save className="h-3 w-3 mr-1" />
                           Save
                        </>
                     ) : (
                        <>
                           <Edit className="h-3 w-3 mr-1" />
                           Edit
                        </>
                     )}
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     onClick={handleRegenerate}
                     className="text-xs"
                  >
                     <RefreshCw className="h-3 w-3 mr-1" />
                     Regen
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() => setShowMediaModal(true)}
                     className="text-xs"
                  >
                     <Plus className="h-3 w-3 mr-1" />
                     Media
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() => setShowAIImageModal(true)}
                     className="text-xs"
                  >
                     <Wand2 className="h-3 w-3 mr-1" />
                     AI Image
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     className="text-xs"
                  >
                     <Copy className="h-3 w-3 mr-1" />
                     Copy
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     onClick={onSchedule}
                     className="text-xs"
                  >
                     <Calendar className="h-3 w-3 mr-1" />
                     Schedule
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     className="text-xs"
                  >
                     <Link className="h-3 w-3 mr-1" />
                     Lead Magnet
                  </Button>

                  <Button
                     size="sm"
                     className="    hover:bg-purple-700 text-xs"
                  >
                     <Send className="h-3 w-3 mr-1" />
                     Post
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Media Library Modal */}
         <Dialog open={showMediaModal} onOpenChange={setShowMediaModal}>
            <DialogContent className="  border-border max-w-4xl">
               <DialogHeader>
                  <DialogTitle  >Media Library</DialogTitle>
                  <DialogDescription>Select media to attach to your post</DialogDescription>
               </DialogHeader>
               <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {mockMediaLibrary.map((media) => (
                     <div key={media.id} className="cursor-pointer" onClick={() => addMedia(media)}>
                        <img src={media.thumbnail} alt={media.name} className="w-full h-24 object-cover rounded" />
                        <p className="text-xs     mt-1">{media.name}</p>
                     </div>
                  ))}
               </div>
            </DialogContent>
         </Dialog>

         {/* AI Image Generation Modal */}
         <Dialog open={showAIImageModal} onOpenChange={setShowAIImageModal}>
            <DialogContent className="  border-border">
               <DialogHeader>
                  <DialogTitle  >Generate AI Image</DialogTitle>
                  <DialogDescription>Create a custom image for your post</DialogDescription>
               </DialogHeader>
               <div className="space-y-4">
                  <Textarea
                     value={aiImagePrompt}
                     onChange={(e) => setAiImagePrompt(e.target.value)}
                     placeholder="Describe the image you want to generate..."
                     className="   border-border    "
                     rows={3}
                  />
                  <Button onClick={generateAIImage} className="w-full     hover:bg-purple-700">
                     <Wand2 className="h-4 w-4 mr-2" />
                     Generate Image
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
