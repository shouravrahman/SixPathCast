'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { useState } from 'react';
import {
   Brain,
   Upload,
   FileText,
   Download,
   Trash2,
   Eye,
   RefreshCw,
   Zap,
   Target,
   TrendingUp,
   Users,
   BarChart3,
   CheckCircle,
   AlertCircle,
   Clock,
   Plus,
   X,
   ExternalLink,
   Sparkles,
   Settings,
   Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import GuidedSetup from '@/components/ai-training/GuidedSetup';
import ConnectedAccounts from '@/components/accounts/ConnectedAccounts';

const trainingData = [
   {
      id: 1,
      type: 'pdf',
      name: 'Personal Brand Guide.pdf',
      size: '2.4 MB',
      pages: 25,
      uploadDate: '2024-01-15',
      status: 'processed',
      insights: 147,
      category: 'Brand Guidelines'
   },
   {
      id: 2,
      type: 'posts',
      name: 'LinkedIn Posts (Last 6 months)',
      size: '890 KB',
      items: 156,
      uploadDate: '2024-01-14',
      status: 'processing',
      insights: 89,
      category: 'Social Media Content'
   },
   {
      id: 3,
      type: 'url',
      name: 'Blog Articles',
      size: '1.2 MB',
      items: 23,
      uploadDate: '2024-01-13',
      status: 'processed',
      insights: 234,
      category: 'Written Content'
   },
   {
      id: 4,
      type: 'text',
      name: 'Speaking Topics & Presentations',
      size: '456 KB',
      items: 12,
      uploadDate: '2024-01-12',
      status: 'failed',
      insights: 0,
      category: 'Speaking Content'
   }
];

const initialAccounts = [
   {
      id: 1,
      platform: 'linkedin',
      name: 'LinkedIn',
      username: 'John Doe',
      followers: 8900,
      status: 'connected',
      lastSync: '2024-01-15T09:45:00Z',
      autoPost: true,
      permissions: ['read', 'write', 'analytics']
   },
   {
      id: 2,
      platform: 'twitter',
      name: 'Twitter',
      username: '@johndoe',
      followers: 12500,
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      autoPost: true,
      permissions: ['read', 'write', 'analytics']
   },
   {
      id: 3,
      platform: 'instagram',
      name: 'Instagram',
      username: '@john.doe',
      followers: 5600,
      status: 'error',
      lastSync: '2024-01-14T15:20:00Z',
      autoPost: false,
      permissions: ['read'],
      error: 'Token expired'
   }
];

const aiInsights = {
   writingStyle: {
      tone: 'Professional yet approachable',
      complexity: 'Medium',
      personality: ['Innovative', 'Helpful', 'Authentic'],
      commonPhrases: ['game-changer', 'cutting-edge', 'practical approach'],
      avoidWords: ['amazing', 'incredible', 'revolutionary']
   },
   contentPatterns: {
      preferredTopics: ['AI in Business', 'Personal Branding', 'Productivity'],
      contentTypes: ['Educational threads', 'Case studies', 'Tips & tricks'],
      engagementTriggers: ['Questions', 'Personal stories', 'Actionable advice'],
      optimalLength: { twitter: 180, linkedin: 1200, instagram: 150 }
   },
   audienceInsights: {
      demographics: 'Entrepreneurs, 25-45, Tech-savvy',
      interests: ['AI', 'Business Growth', 'Personal Development'],
      engagementTimes: ['9 AM', '2 PM', '6 PM'],
      responseStyle: 'Detailed but concise'
   }
};

export default function AITraining() {
   const router = useRouter();
   const [activeTab, setActiveTab] = useState('training-data');
   const [showUploadDialog, setShowUploadDialog] = useState(false);
   const [showUrlDialog, setShowUrlDialog] = useState(false);
   const [uploadType, setUploadType] = useState('pdf');
   const [urlInput, setUrlInput] = useState('');
   const [textInput, setTextInput] = useState('');
   const [isTraining, setIsTraining] = useState(false);
   const [trainingProgress, setTrainingProgress] = useState(0);
   const [accounts, setAccounts] = useState(initialAccounts);

   const getStatusIcon = (status: string) => {
      switch (status) {
         case 'processed':
            return <CheckCircle className="h-4 w-4 text-green-400" />;
         case 'processing':
            return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
         case 'failed':
            return <AlertCircle className="h-4 w-4 text-red-400" />;
         default:
            return <Clock className="h-4 w-4    " />;
      }
   };

   const getTypeIcon = (type: string) => {
      switch (type) {
         case 'pdf':
            return FileText;
         case 'posts':
            return Users;
         case 'url':
            return ExternalLink;
         case 'text':
            return FileText;
         default:
            return FileText;
      }
   };

   const startTraining = () => {
      setIsTraining(true);
      setTrainingProgress(0);

      // Simulate training progress
      const interval = setInterval(() => {
         setTrainingProgress(prev => {
            if (prev >= 100) {
               clearInterval(interval);
               setIsTraining(false);
               return 100;
            }
            return prev + 10;
         });
      }, 500);
   };

   return (
      <div className="dashboard-page-container">
         <div className="mb-8">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="dashboard-header-title flex items-center space-x-3">
                     <Brain className="h-8 w-8 text-purple-400" />
                     <span>AI Training Center</span>
                  </h1>
                  <p className="dashboard-header-description">
                     Train your AI assistant with your content, style, and brand voice for personalized content generation
                  </p>
               </div>
               <div className="flex space-x-3">
                  <Button
                     onClick={startTraining}
                     disabled={isTraining}
                     className="btn-gradient"
                  >
                     {isTraining ? (
                        <>
                           <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                           Training...
                        </>
                     ) : (
                        <>
                           <Zap className="h-4 w-4 mr-2" />
                           Start Training
                        </>
                     )}
                  </Button>
               </div>
            </div>
         </div>

         <GuidedSetup />

         {/* Training Progress */}
         {isTraining && (
            <Card className="  mb-8">
               <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-medium    ">Training AI Model</h3>
                     <span className="text-sm    ">{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} className="mb-2" />
                  <p className="text-sm    ">
                     Processing your content and learning your writing style...
                  </p>
               </CardContent>
            </Card>
         )}

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Training Sources</p>
                        <p className="text-2xl font-bold    ">{trainingData.length}</p>
                     </div>
                     <Database className="h-8 w-8 text-purple-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">AI Insights</p>
                        <p className="text-2xl font-bold    ">
                           {trainingData.reduce((sum, item) => sum + item.insights, 0)}
                        </p>
                     </div>
                     <Sparkles className="h-8 w-8 text-blue-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Connected Accounts</p>
                        <p className="text-2xl font-bold    ">
                           {accounts.filter(acc => acc.status === 'connected').length}
                        </p>
                     </div>
                     <Users className="h-8 w-8 text-green-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Training Status</p>
                        <p className="text-2xl font-bold    ">92%</p>
                     </div>
                     <Target className="h-8 w-8 text-orange-400" />
                  </div>
               </CardContent>
            </Card>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="  border-border">
               <TabsTrigger value="training-data"  >Training Data</TabsTrigger>
               <TabsTrigger value="social-sync"  >Social Sync</TabsTrigger>
               <TabsTrigger value="insights"  >AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="training-data" className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold    ">Training Data Sources</h2>
                  <div className="flex space-x-2">
                     <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
                        <DialogTrigger asChild>
                           <Button variant="outline" className=" border-border    ">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Add URL
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="  border-border">
                           <DialogHeader>
                              <DialogTitle  >Add Content from URL</DialogTitle>
                              <DialogDescription>
                                 Import content from your blog, articles, or other online sources
                              </DialogDescription>
                           </DialogHeader>
                           <div className="space-y-4">
                              <div>
                                 <Label htmlFor="url"  >URL</Label>
                                 <Input
                                    id="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://your-blog.com/article"
                                    className="   border-border    "
                                 />
                              </div>
                              <div>
                                 <Label htmlFor="category"  >Category</Label>
                                 <Select>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select content type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="blog">Blog Articles</SelectItem>
                                       <SelectItem value="case-studies">Case Studies</SelectItem>
                                       <SelectItem value="speaking">Speaking Content</SelectItem>
                                       <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <Button className="w-full     hover:bg-purple-700">
                                 Import Content
                              </Button>
                           </div>
                        </DialogContent>
                     </Dialog>

                     <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                        <DialogTrigger asChild>
                           <Button className="    hover:bg-purple-700">
                              <Plus className="h-4 w-4 mr-2" />
                              Upload Content
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="  border-border max-w-2xl">
                           <DialogHeader>
                              <DialogTitle  >Upload Training Content</DialogTitle>
                              <DialogDescription>
                                 Upload documents, text, or other content to train your AI
                              </DialogDescription>
                           </DialogHeader>
                           <Tabs value={uploadType} onValueChange={setUploadType}>
                              <TabsList className="grid w-full grid-cols-3">
                                 <TabsTrigger value="pdf">Documents</TabsTrigger>
                                 <TabsTrigger value="text">Text</TabsTrigger>
                                 <TabsTrigger value="posts">Social Posts</TabsTrigger>
                              </TabsList>

                              <TabsContent value="pdf" className="space-y-4">
                                 <div className="border-2 border-dashed  border-border rounded-lg p-8 text-center">
                                    <Upload className="h-12 w-12     mx-auto mb-4" />
                                    <p className="text-muted-foreground mb-2">Upload PDFs, Word docs, or text files</p>
                                    <p className="text-sm text-muted-foreground">Supports: PDF, DOCX, TXT up to 50MB</p>
                                    <Button variant="outline" className="mt-4">
                                       Choose Files
                                    </Button>
                                 </div>
                              </TabsContent>

                              <TabsContent value="text" className="space-y-4">
                                 <Textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Paste your content here..."
                                    className="   border-border     min-h-[200px]"
                                 />
                                 <Button className="w-full     hover:bg-purple-700">
                                    Add Text Content
                                 </Button>
                              </TabsContent>

                              <TabsContent value="posts" className="space-y-4">
                                 <div className="p-4 rounded-lg  ">
                                    <p className="text-sm text-muted-foreground mb-3">
                                       Import your existing social media posts to help AI learn your style
                                    </p>
                                    <div className="space-y-2">
                                       <Button variant="outline" className="w-full justify-start">
                                          <FileText className="h-4 w-4 mr-2" />
                                          Import from CSV file
                                       </Button>
                                       <Button variant="outline" className="w-full justify-start">
                                          <Download className="h-4 w-4 mr-2" />
                                          Connect social accounts (recommended)
                                       </Button>
                                    </div>
                                 </div>
                              </TabsContent>
                           </Tabs>
                        </DialogContent>
                     </Dialog>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {trainingData.map((item) => {
                     const TypeIcon = getTypeIcon(item.type);
                     return (
                        <Card key={item.id}  >
                           <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12   rounded-lg flex items-center justify-center">
                                       <TypeIcon className="h-4 w-4    " />
                                    </div>
                                    <div>
                                       <h3 className="text-sm font-medium    ">{item.name}</h3>
                                       <div className="flex items-center space-x-4 mt-1 text-xs    ">
                                          <span>{item.size}</span>
                                          {item.pages && <span>{item.pages} pages</span>}
                                          {item.items && <span>{item.items} items</span>}
                                          <span>Uploaded {item.uploadDate}</span>
                                       </div>
                                       <Badge variant="outline" className="mt-2 text-xs">
                                          {item.category}
                                       </Badge>
                                    </div>
                                 </div>

                                 <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                       <div className="flex items-center space-x-2">
                                          {getStatusIcon(item.status)}
                                          <span className="text-sm     capitalize">{item.status}</span>
                                       </div>
                                       <p className="text-xs     mt-1">
                                          {item.insights} insights generated
                                       </p>
                                    </div>

                                    <div className="flex space-x-2">
                                       <Button size="sm" variant="ghost">
                                          <Eye className="h-4 w-4" />
                                       </Button>
                                       <Button size="sm" variant="ghost" className="text-red-400">
                                          <Trash2 className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     );
                  })}
               </div>
            </TabsContent>

            <TabsContent value="social-sync" className="space-y-6">
               <ConnectedAccounts accounts={accounts} setAccounts={setAccounts} />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card  >
                     <CardHeader>
                        <CardTitle  >Writing Style Analysis</CardTitle>
                        <CardDescription>AI's understanding of your writing patterns</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div>
                              <Label  >Tone</Label>
                              <p className="text-sm text-muted-foreground">{aiInsights.writingStyle.tone}</p>
                           </div>
                           <div>
                              <Label  >Complexity Level</Label>
                              <p className="text-sm text-muted-foreground">{aiInsights.writingStyle.complexity}</p>
                           </div>
                           <div>
                              <Label  >Personality Traits</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                 {aiInsights.writingStyle.personality.map((trait) => (
                                    <Badge key={trait} variant="secondary" className="text-xs">
                                       {trait}
                                    </Badge>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <Label  >Common Phrases</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                 {aiInsights.writingStyle.commonPhrases.map((phrase) => (
                                    <Badge key={phrase} variant="outline" className="text-xs">
                                       "{phrase}"
                                    </Badge>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card  >
                     <CardHeader>
                        <CardTitle  >Content Patterns</CardTitle>
                        <CardDescription>What works best for your audience</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div>
                              <Label  >Top Topics</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                 {aiInsights.contentPatterns.preferredTopics.map((topic) => (
                                    <Badge key={topic} className="    text-xs">
                                       {topic}
                                    </Badge>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <Label  >Best Content Types</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                 {aiInsights.contentPatterns.contentTypes.map((type) => (
                                    <Badge key={type} variant="secondary" className="text-xs">
                                       {type}
                                    </Badge>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <Label  >Engagement Triggers</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                 {aiInsights.contentPatterns.engagementTriggers.map((trigger) => (
                                    <Badge key={trigger} className="bg-green-600 text-xs">
                                       {trigger}
                                    </Badge>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
