
'use client';

import { useState } from 'react';
import {
   Lightbulb,
   Wand2,
   Save,
   RefreshCw,
   Copy,
   Star,
   Trash2,
   Plus,
   Search,
   Filter,
   Sparkles,
   Target,
   TrendingUp,
   Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { SourceUpload } from '@/components/source/SourceUpload';

const brainstormCategories = [
   { id: 'content', name: 'Content Ideas', icon: Lightbulb, color: 'bg-yellow-500' },
   { id: 'strategy', name: 'Strategy', icon: Target, color: '  ' },
   { id: 'trending', name: 'Trending Topics', icon: TrendingUp, color: 'bg-green-500' },
   { id: 'audience', name: 'Audience Engagement', icon: Users, color: '   ' }
];

const savedIdeas = [
   {
      id: 1,
      title: 'AI Productivity Thread Series',
      description: 'Create a 10-part thread series about AI tools that boost productivity',
      category: 'content',
      platforms: ['Twitter', 'LinkedIn'],
      priority: 'high',
      saved_date: '2024-01-15',
      tags: ['AI', 'productivity', 'thread'],
      favorite: true
   },
   {
      id: 2,
      title: 'Behind the Scenes Content',
      description: 'Show the daily routine and workspace setup for personal branding',
      category: 'content',
      platforms: ['Instagram', 'TikTok'],
      priority: 'medium',
      saved_date: '2024-01-14',
      tags: ['lifestyle', 'personal', 'authentic'],
      favorite: false
   },
   {
      id: 3,
      title: 'Engagement Strategy for Q2',
      description: 'Develop a comprehensive engagement strategy focusing on community building',
      category: 'strategy',
      platforms: ['All'],
      priority: 'high',
      saved_date: '2024-01-13',
      tags: ['strategy', 'engagement', 'community'],
      favorite: true
   }
];

const trendingTopics = [
   { topic: 'AI Automation', engagement: '+45%', platforms: ['Twitter', 'LinkedIn'] },
   { topic: 'Remote Work Tools', engagement: '+32%', platforms: ['LinkedIn', 'Instagram'] },
   { topic: 'Personal Productivity', engagement: '+28%', platforms: ['Twitter', 'TikTok'] },
   { topic: 'Digital Minimalism', engagement: '+23%', platforms: ['Instagram', 'YouTube'] }
];
interface Idea {
   id: number;
   title: string;
   description: string;
   category: string;
   platforms: string[];
   priority: string;
   saved_date: string;
   tags: string[];
   favorite: boolean;
}


export default function BrainstormView() {
   const [activeTab, setActiveTab] = useState('generate');
   const [selectedCategory, setSelectedCategory] = useState('content');
   const [prompt, setPrompt] = useState('');
   const [context, setContext] = useState('');
   const [generatedIdeas, setGeneratedIdeas] = useState([]);
   const [isGenerating, setIsGenerating] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [savedIdeasState, setSavedIdeas] = useState(savedIdeas);


   const generateIdeas = async () => {
      setIsGenerating(true);

      // Simulate AI generation
      setTimeout(() => {
         const mockIdeas = [
            {
               id: Date.now() + 1,
               title: 'AI Tools Comparison Series',
               description: 'Create detailed comparisons between popular AI tools, highlighting pros, cons, and use cases for different audiences.',
               platforms: ['Twitter', 'LinkedIn', 'YouTube'],
               engagement_potential: 'High',
               difficulty: 'Medium',
               time_investment: '2-3 hours per post'
            },
            {
               id: Date.now() + 2,
               title: 'Personal Brand Transformation Story',
               description: 'Share your journey of building a personal brand, including failures, lessons learned, and key milestones.',
               platforms: ['LinkedIn', 'Instagram', 'Blog'],
               engagement_potential: 'Very High',
               difficulty: 'Low',
               time_investment: '1-2 hours per post'
            },
            {
               id: Date.now() + 3,
               title: 'Interactive Q&A Sessions',
               description: 'Host regular Q&A sessions about AI, productivity, and personal branding to build community engagement.',
               platforms: ['Twitter Spaces', 'LinkedIn Live', 'Instagram Live'],
               engagement_potential: 'High',
               difficulty: 'High',
               time_investment: '1 hour per session'
            },
            {
               id: Date.now() + 4,
               title: 'Myth-Busting Content',
               description: 'Address common misconceptions about AI, productivity tools, or personal branding with fact-based content.',
               platforms: ['Twitter', 'LinkedIn', 'TikTok'],
               engagement_potential: 'Medium',
               difficulty: 'Medium',
               time_investment: '1-2 hours per post'
            }
         ];

         setGeneratedIdeas(mockIdeas);
         setIsGenerating(false);
      }, 2000);
   };

   const saveIdea = (idea: Idea) => {
      const newIdea = {
         id: Date.now(),
         title: idea.title,
         description: idea.description,
         category: selectedCategory,
         platforms: idea.platforms,
         priority: 'medium',
         saved_date: new Date().toISOString().split('T')[0],
         tags: [selectedCategory, 'ai-generated'],
         favorite: false,
         scheduled: false,
         published: false
      };

      setSavedIdeas(prev => [newIdea, ...prev]);
   };

   const addToBulk = (idea: Idea) => {
      const bulkIdeas = JSON.parse(localStorage.getItem('bulkIdeas') || '[]');
      localStorage.setItem('bulkIdeas', JSON.stringify([...bulkIdeas, idea]));
   };

   const getPriorityColor = (priority: string) => {
      switch (priority) {
         case 'high': return 'bg-red-600';
         case 'medium': return 'bg-yellow-600';
         case 'low': return 'bg-green-600';
         default: return 'bg-slate-600';
      }
   };

   const getEngagementColor = (potential: string) => {
      switch (potential) {
         case 'Very High': return 'text-green-400';
         case 'High': return 'text-blue-400';
         case 'Medium': return 'text-yellow-400';
         case 'Low': return '   ';
         default: return '   ';
      }
   };

   const filteredIdeas = savedIdeasState.filter(idea =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
   );



   return (
      <div className="px-4 sm:px-6 lg:px-8 py-4 mx-auto">
         <div className="mb-8">
            <h1 className="text-3xl font-bold   mb-2">AI Brainstorm</h1>
            <p className="   ">
               Generate fresh content ideas and strategies with AI assistance
            </p>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className=" border-border">
               <TabsTrigger value="generate"  >Generate Ideas</TabsTrigger>
               <TabsTrigger value="saved"  >Saved Ideas</TabsTrigger>
               <TabsTrigger value="trending"  >Trending Topics</TabsTrigger>
               <TabsTrigger value="strategy"  >Content Strategy</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
               <div className="mb-6">
                  <SourceUpload />
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Generation Form */}
                  <div className="lg:col-span-2 space-y-6">
                     <Card  >
                        <CardHeader>
                           <CardTitle className=" flex items-center space-x-2">
                              <Wand2 className="h-5 w-5" />
                              <span>AI Idea Generator</span>
                           </CardTitle>
                           <CardDescription>
                              Describe what you want to create and let AI generate personalized ideas
                           </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                              <Label htmlFor="category"  >Category</Label>
                              <div className="grid grid-cols-2 gap-3 mt-2">
                                 {brainstormCategories.map((category) => (
                                    <button
                                       key={category.id}
                                       onClick={() => setSelectedCategory(category.id)}
                                       className={`p-3 rounded-lg border-2 transition-all text-left ${selectedCategory === category.id
                                          ? 'border-purple-500    '
                                          : ' border-border   hover: border-border'
                                          }`}
                                    >
                                       <category.icon className="h-5 w-5 text-purple-400 mb-2" />
                                       <div className="text-sm font-medium  ">{category.name}</div>
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div>
                              <Label htmlFor="prompt"  >What do you want to create?</Label>
                              <Textarea
                                 id="prompt"
                                 value={prompt}
                                 onChange={(e) => setPrompt(e.target.value)}
                                 placeholder="e.g., I want to create engaging content about AI productivity tools for entrepreneurs..."
                                 rows={3}

                              />
                           </div>

                           <div>
                              <Label htmlFor="context"  >Additional Context (Optional)</Label>
                              <Textarea
                                 id="context"
                                 value={context}
                                 onChange={(e) => setContext(e.target.value)}
                                 placeholder="Target audience, specific goals, current trends you want to leverage..."
                                 rows={2}

                              />
                           </div>

                           <Button
                              onClick={generateIdeas}
                              disabled={!prompt || isGenerating}
                              className="w-full btn-gradient hover:from-purple-700 hover:to-blue-700"
                           >
                              {isGenerating ? (
                                 <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Generating Ideas...
                                 </>
                              ) : (
                                 <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Ideas
                                 </>
                              )}
                           </Button>
                        </CardContent>
                     </Card>

                     {/* Generated Ideas */}
                     {generatedIdeas.length > 0 && (
                        <Card  >
                           <CardHeader>
                              <CardTitle  >Generated Ideas</CardTitle>
                              <CardDescription>AI-generated content ideas based on your input</CardDescription>
                           </CardHeader>
                           <CardContent>
                              <div className="space-y-4">
                                 {generatedIdeas.map((idea) => (
                                    <div key={idea.id} className="p-4 rounded-lg dark: /30 border border-border  ">
                                       <div className="flex items-start justify-between mb-3">
                                          <h3 className="text-lg font-medium  ">{idea.title}</h3>
                                          <div className="flex space-x-2">
                                             <Button size="sm" variant="ghost" onClick={() => saveIdea(idea)}>
                                                <Save className="h-4 w-4" />
                                             </Button>
                                             <Button size="sm" variant="ghost">
                                                <Copy className="h-4 w-4" />
                                             </Button>
                                          </div>
                                       </div>

                                       <p className="    mb-3">{idea.description}</p>

                                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                          <div>
                                             <span className="text-xs    ">Platforms:</span>
                                             <div className="flex flex-wrap gap-1 mt-1">
                                                {idea.platforms.map((platform) => (
                                                   <Badge key={platform} variant="outline" className="text-xs">
                                                      {platform}
                                                   </Badge>
                                                ))}
                                             </div>
                                          </div>
                                          <div>
                                             <span className="text-xs    ">Engagement Potential:</span>
                                             <p className={`text-sm font-medium ${getEngagementColor(idea.engagement_potential)}`}>
                                                {idea.engagement_potential}
                                             </p>
                                          </div>
                                          <div>
                                             <span className="text-xs    ">Time Investment:</span>
                                             <p className="text-sm  ">{idea.time_investment}</p>
                                          </div>
                                       </div>

                                       <div className="flex items-center justify-between">
                                          <Badge variant="outline" className="text-xs">
                                             {idea.difficulty} difficulty
                                          </Badge>
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() => addToBulk(idea)}
                                          >
                                             <Plus className="h-4 w-4 mr-2" />
                                             Add to Bulk
                                          </Button>
                                          <Button
                                             size="sm"
                                             className="    hover:bg-purple-700"
                                             onClick={() => {
                                                const params = new URLSearchParams({
                                                   topic: idea.title,
                                                   brief: idea.description
                                                });
                                                window.location.href = `/dashboard/create?${params.toString()}`;
                                             }}
                                          >
                                             Create Content
                                          </Button>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </CardContent>
                        </Card>
                     )}
                  </div>

                  {/* Quick Actions Sidebar */}
                  <div className="space-y-6">
                     <Card  >
                        <CardHeader>
                           <CardTitle  >Quick Prompts</CardTitle>
                           <CardDescription>Popular idea generation prompts</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                              {[
                                 'Content for beginners in my niche',
                                 'Trending topics to comment on',
                                 'Behind-the-scenes content ideas',
                                 'Educational thread topics',
                                 'Controversial but respectful takes',
                                 'Personal story content'
                              ].map((quickPrompt) => (
                                 <button
                                    key={quickPrompt}
                                    onClick={() => setPrompt(quickPrompt)}
                                    className="w-full text-left p-2 rounded-lg dark: /30 hover: /50 transition-colors text-sm    "
                                 >
                                    {quickPrompt}
                                 </button>
                              ))}
                           </div>
                        </CardContent>
                     </Card>

                     <Card  >
                        <CardHeader>
                           <CardTitle  >Generation Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-3 text-sm    ">
                              <div className="flex items-start space-x-2">
                                 <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                                 <p>Be specific about your target audience</p>
                              </div>
                              <div className="flex items-start space-x-2">
                                 <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                                 <p>Include your current goals or challenges</p>
                              </div>
                              <div className="flex items-start space-x-2">
                                 <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                                 <p>Mention platforms you want to focus on</p>
                              </div>
                              <div className="flex items-start space-x-2">
                                 <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                                 <p>Reference current trends or events</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex-1 relative max-w-md">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4    " />
                     <Input
                        placeholder="Search saved ideas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10   "
                     />
                  </div>
                  <div className="flex items-center space-x-2">
                     <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                     </Button>
                     <Button size="sm" className="    hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Idea
                     </Button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIdeas.map((idea) => (
                     <Card key={idea.id}  >
                        <CardContent className="p-6">
                           <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-medium  ">{idea.title}</h3>
                              <div className="flex items-center space-x-1">
                                 {idea.favorite && (
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 )}
                                 <Button size="sm" variant="ghost">
                                    <Trash2 className="h-4 w-4    " />
                                 </Button>
                              </div>
                           </div>

                           <p className="    text-sm mb-4">{idea.description}</p>

                           <div className="space-y-3">
                              <div>
                                 <span className="text-xs    ">Platforms:</span>
                                 <div className="flex flex-wrap gap-1 mt-1">
                                    {idea.platforms.map((platform) => (
                                       <Badge key={platform} variant="outline" className="text-xs">
                                          {platform}
                                       </Badge>
                                    ))}
                                 </div>
                              </div>

                              <div>
                                 <span className="text-xs    ">Tags:</span>
                                 <div className="flex flex-wrap gap-1 mt-1">
                                    {idea.tags.map((tag) => (
                                       <Badge key={tag} variant="secondary" className="text-xs">
                                          #{tag}
                                       </Badge>
                                    ))}
                                 </div>
                              </div>

                              <div className="flex items-center justify-between">
                                 <Badge className={getPriorityColor(idea.priority)}>
                                    {idea.priority} priority
                                 </Badge>
                                 <span className="text-xs    ">{idea.saved_date}</span>
                              </div>
                           </div>

                           <Button
                              className="w-full mt-4     hover:bg-purple-700"
                              onClick={() => {
                                 const params = new URLSearchParams({
                                    topic: idea.title,
                                    brief: idea.description
                                 });
                                 window.location.href = `/dashboard/create?${params.toString()}`;
                              }}
                           >
                              Create Content
                           </Button>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="trending" className="space-y-6">
               <Card  >
                  <CardHeader>
                     <CardTitle  >Trending Topics</CardTitle>
                     <CardDescription>Hot topics in your niche with high engagement potential</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {trendingTopics.map((topic, index) => (
                           <div key={index} className="flex items-center justify-between p-4 rounded-lg dark: /30">
                              <div>
                                 <h3 className="text-lg font-medium  ">{topic.topic}</h3>
                                 <div className="flex flex-wrap gap-1 mt-1">
                                    {topic.platforms.map((platform) => (
                                       <Badge key={platform} variant="outline" className="text-xs">
                                          {platform}
                                       </Badge>
                                    ))}
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="flex items-center dark:text-green-400 mb-2">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    <span className="font-medium">{topic.engagement}</span>
                                 </div>
                                 <Button
                                    size="sm"
                                    className="    hover:bg-purple-700"
                                    onClick={() => {
                                       const params = new URLSearchParams({
                                          topic: topic.topic,
                                          brief: `Create content about ${topic.topic} - currently trending with ${topic.engagement} engagement increase`
                                       });
                                       window.location.href = `/dashboard/create?${params.toString()}`;
                                    }}
                                 >
                                    Create Content
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="strategy" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card  >
                     <CardHeader>
                        <CardTitle  >Content Pillars</CardTitle>
                        <CardDescription>Define your main content themes</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           {[
                              { pillar: 'Educational', percentage: 40, color: '  ' },
                              { pillar: 'Personal', percentage: 30, color: 'bg-green-500' },
                              { pillar: 'Industry News', percentage: 20, color: 'bg-yellow-500' },
                              { pillar: 'Behind the Scenes', percentage: 10, color: '   ' }
                           ].map((pillar) => (
                              <div key={pillar.pillar} className="space-y-2">
                                 <div className="flex justify-between text-sm">
                                    <span  >{pillar.pillar}</span>
                                    <span className="   ">{pillar.percentage}%</span>
                                 </div>
                                 <div className="w-full dark:    rounded-full h-2">
                                    <div
                                       className={`${pillar.color} h-2 rounded-full`}
                                       style={{ width: `${pillar.percentage}%` }}
                                    ></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>

                  <Card  >
                     <CardHeader>
                        <CardTitle  >Content Calendar</CardTitle>
                        <CardDescription>Plan your content schedule</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           {[
                              { day: 'Monday', type: 'Educational Thread', platform: 'Twitter' },
                              { day: 'Tuesday', type: 'Industry Insight', platform: 'LinkedIn' },
                              { day: 'Wednesday', type: 'Behind the Scenes', platform: 'Instagram' },
                              { day: 'Thursday', type: 'Personal Story', platform: 'LinkedIn' },
                              { day: 'Friday', type: 'Weekly Roundup', platform: 'Twitter' },
                              { day: 'Saturday', type: 'Lifestyle Content', platform: 'Instagram' },
                              { day: 'Sunday', type: 'Reflection/Planning', platform: 'All' }
                           ].map((schedule) => (
                              <div key={schedule.day} className="flex items-center justify-between p-3 rounded-lg dark: /30  ">
                                 <div>
                                    <span className="  font-medium">{schedule.day}</span>
                                    <p className="text-sm    ">{schedule.type}</p>
                                 </div>
                                 <Badge variant="outline" className="text-xs">
                                    {schedule.platform}
                                 </Badge>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
