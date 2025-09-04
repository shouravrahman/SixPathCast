'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
   Save,
   Upload,
   Palette, Target,
   MessageSquare,
   Hash, User, Heart, Sparkles,
   RefreshCw,
   Plus,
   X,
   Loader
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Define the structure of your settings based on the database schema
interface BrandSettings {
   id?: string;
   updated_at?: string;
   full_name?: string;
   bio?: string;
   industry?: string;
   target_audience?: string;
   website?: string;
   personality_traits?: string[];
   story?: string;
   projects?: Array<{ name: string; description: string; year: string }>;
   work_experiences?: Array<{ company: string; role: string; duration: string; description: string }>;
   achievements?: string[];
   tone?: string;
   writing_style?: string;
   content_style?: string;
   language_guidelines?: string;
   words_to_avoid?: string[];
   words_to_prefer?: string[];
   topics?: string[];
   hashtags?: string[];
   brand_colors?: { primary: string; secondary: string; accent: string; background: string; text: string };
   logo_url?: string;
   profile_image_url?: string;
   personal_photo_urls?: string[];
   has_completed_onboarding?: boolean;
}

const personalityOptions = [
   "Professional", "Casual", "Humorous", "Inspirational", "Educational",
   "Authentic", "Innovative", "Helpful", "Bold", "Thoughtful"
];

const industryOptions = [
   "Technology", "Marketing", "Finance", "Healthcare", "Education",
   "E-commerce", "Consulting", "Real Estate", "Entertainment", "Other"
];

const toneOptions = [
   "Professional yet approachable", "Casual and friendly", "Expert and authoritative",
   "Inspirational and motivating", "Educational and informative", "Conversational and personal"
];

const defaultSettings: BrandSettings = {
   full_name: "",
   bio: "",
   industry: "Technology",
   target_audience: "",
   website: "",
   personality_traits: [],
   story: "",
   projects: [],
   work_experiences: [],
   achievements: [],
   tone: "Professional yet approachable",
   writing_style: "conversational",
   content_style: "",
   language_guidelines: "",
   words_to_avoid: [],
   words_to_prefer: [],
   topics: [],
   hashtags: [],
   brand_colors: {
      primary: "#8B5CF6",
      secondary: "#3B82F6",
      accent: "#F59E0B",
      background: "#1E293B",
      text: "#F8FAFC"
   },
   logo_url: "",
   profile_image_url: "",
   personal_photo_urls: [],
   has_completed_onboarding: false,
};

export default function BrandSettings() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const { toast } = useToast();
   const [activeTab, setActiveTab] = useState('profile');
   const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

   const { data: fetchedSettings, isLoading: isFetchingSettings, isError: isErrorFetching } = useQuery<BrandSettings>({
      queryKey: ['brandSettings'],
      queryFn: async () => {
         const response = await fetch('/api/settings');
         if (!response.ok) {
            throw new Error('Failed to fetch settings');
         }
         const data = await response.json();
         return { ...defaultSettings, ...data }; // Merge with defaults to ensure all fields exist
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
   });

   const [settings, setSettings] = useState<BrandSettings>(defaultSettings);

   useEffect(() => {
      if (fetchedSettings) {
         setSettings(fetchedSettings);
      }
   }, [fetchedSettings]);

   const saveSettingsMutation = useMutation({
      mutationFn: async (updatedSettings: BrandSettings) => {
         const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSettings),
         });
         if (!response.ok) {
            throw new Error('Failed to save settings');
         }
         return response.json();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['brandSettings'] });
         toast({ title: 'Settings saved!', description: 'Your brand settings have been updated.' });
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to save settings: ${error.message}`, variant: 'destructive' });
      },
   });

   const handleSave = () => {
      saveSettingsMutation.mutate(settings);
   };

   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: keyof BrandSettings, folder: string, isArray: boolean = false) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(prev => ({ ...prev, [field]: true }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      try {
         const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
         });

         if (!response.ok) {
            throw new Error('Upload failed');
         }

         const data = await response.json();
         const newUrl = data.url;

         if (isArray) {
            setSettings(prev => ({
               ...prev,
               [field]: [...(prev[field] as string[] || []), newUrl]
            }));
         } else {
            setSettings(prev => ({
               ...prev,
               [field]: newUrl
            }));
         }
         toast({ title: 'Upload successful!', description: 'File uploaded and linked to your settings.' });
      } catch (error: any) {
         toast({ title: 'Upload Error', description: `Failed to upload file: ${error.message}`, variant: 'destructive' });
      } finally {
         setUploading(prev => ({ ...prev, [field]: false }));
      }
   };

   const updateField = (field: keyof BrandSettings, value: any) => {
      setSettings(prev => ({
         ...prev,
         [field]: value
      }));
   };

   const updateNestedField = (parentField: keyof BrandSettings, childField: string, value: any) => {
      setSettings(prev => ({
         ...prev,
         [parentField]: {
            ...(prev[parentField] as any),
            [childField]: value
         }
      }));
   };

   const togglePersonalityTrait = (trait: string) => {
      const currentTraits = settings.personality_traits || [];
      const newTraits = currentTraits.includes(trait)
         ? currentTraits.filter(t => t !== trait)
         : [...currentTraits, trait];
      updateField('personality_traits', newTraits);
   };

   const addProject = () => {
      const newProject = { name: '', description: '', year: new Date().getFullYear().toString() };
      updateField('projects', [...(settings.projects || []), newProject]);
   };

   const updateProject = (index: number, field: keyof (typeof defaultSettings.projects)[0], value: any) => {
      const newProjects = [...(settings.projects || [])];
      newProjects[index][field] = value;
      updateField('projects', newProjects);
   };

   const removeProject = (index: number) => {
      const newProjects = (settings.projects || []).filter((_, i) => i !== index);
      updateField('projects', newProjects);
   };

   const addWorkExperience = () => {
      const newExp = { company: '', role: '', duration: '', description: '' };
      updateField('work_experiences', [...(settings.work_experiences || []), newExp]);
   };

   const updateWorkExperience = (index: number, field: keyof (typeof defaultSettings.work_experiences)[0], value: any) => {
      const newExp = [...(settings.work_experiences || [])];
      newExp[index][field] = value;
      updateField('work_experiences', newExp);
   };

   const removeWorkExperience = (index: number) => {
      const newExp = (settings.work_experiences || []).filter((_, i) => i !== index);
      updateField('work_experiences', newExp);
   };

   const addAchievement = () => {
      updateField('achievements', [...(settings.achievements || []), '']);
   };

   const updateAchievement = (index: number, value: string) => {
      const newAchievements = [...(settings.achievements || [])];
      newAchievements[index] = value;
      updateField('achievements', newAchievements);
   };

   const removeAchievement = (index: number) => {
      const newAchievements = (settings.achievements || []).filter((_, i) => i !== index);
      updateField('achievements', newAchievements);
   };

   const addTopic = (topic: string) => {
      if (topic && !(settings.topics || []).includes(topic)) {
         updateField('topics', [...(settings.topics || []), topic]);
      }
   };

   const removeTopic = (topic: string) => {
      updateField('topics', (settings.topics || []).filter(t => t !== topic));
   };

   const addHashtag = (hashtag: string) => {
      if (hashtag && !(settings.hashtags || []).includes(hashtag)) {
         const formattedHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
         updateField('hashtags', [...(settings.hashtags || []), formattedHashtag]);
      }
   };

   const removeHashtag = (hashtag: string) => {
      updateField('hashtags', (settings.hashtags || []).filter(h => h !== hashtag));
   };
   const getInitials = (name: string) => {
      return name.split(' ').map(word => word[0]).join('');
   }

   if (isFetchingSettings) {
      return (
         <div className="p-6 max-w-7xl mx-auto flex justify-center items-center min-h-[calc(100vh-100px)]">
            <Loader className="h-12 w-12 animate-spin text-primary" />
         </div>
      );
   }

   if (isErrorFetching) {
      return (
         <div className="p-6 max-w-7xl mx-auto text-center text-red-500">
            <h2 className="text-2xl font-bold">Error loading settings</h2>
            <p>Please try again later.</p>
         </div>
      );
   }

   return (
      <div className="p-6 max-w-7xl mx-auto">
         <div className="mb-8">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-bold mb-2">Settings</h1>
                  <p>
                     Configure your identity and content preferences for AI-powered content generation
                  </p>
               </div>
               <Button
                  onClick={handleSave}
                  disabled={saveSettingsMutation.isLoading}
                  className="btn-gradient"
               >
                  {saveSettingsMutation.isLoading ? (
                     <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                     </>
                  ) : (
                     <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                     </>
                  )}
               </Button>
            </div>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="border-border">
               <TabsTrigger value="profile">Profile</TabsTrigger>
               <TabsTrigger value="story">Story & Experience</TabsTrigger>
               <TabsTrigger value="training">AI Training</TabsTrigger>
               <TabsTrigger value="voice">Voice & Tone</TabsTrigger>
               <TabsTrigger value="content">Content</TabsTrigger>
               <TabsTrigger value="visual">Visual Brand</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center space-x-2">
                              <User className="h-5 w-5" />
                              <span>Personal Information</span>
                           </CardTitle>
                           <CardDescription>Basic information about you and your brand</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <Label htmlFor="name">Full Name</Label>
                                 <Input
                                    id="name"
                                    value={settings.full_name || ''}
                                    onChange={(e) => updateField('full_name', e.target.value)}
                                 />
                              </div>
                              <div>
                                 <Label htmlFor="location">Location</Label>
                                 <Input
                                    id="location"
                                    value={settings.location || ''}
                                    onChange={(e) => updateField('location', e.target.value)}
                                 />
                              </div>
                           </div>

                           <div>
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                 id="bio"
                                 value={settings.bio || ''}
                                 onChange={(e) => updateField('bio', e.target.value)}
                                 rows={3}
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <Label htmlFor="industry">Industry</Label>
                                 <Select
                                    value={settings.industry}
                                    onValueChange={(value) => updateField("industry", value)}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select Industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {industryOptions.map((industry) => (
                                          <SelectItem key={industry} value={industry}>
                                             {industry}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div>
                                 <Label htmlFor="website">Website</Label>
                                 <Input
                                    id="website"
                                    value={settings.website || ''}
                                    onChange={(e) => updateField('website', e.target.value)}
                                 />
                              </div>
                           </div>

                           <div>
                              <Label htmlFor="audience">Target Audience</Label>
                              <Input
                                 id="audience"
                                 value={settings.target_audience || ''}
                                 onChange={(e) => updateField('target_audience', e.target.value)}
                              />
                           </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center space-x-2">
                              <Heart className="h-5 w-5" />
                              <span>Personality Traits</span>
                           </CardTitle>
                           <CardDescription>Select traits that best describe your brand personality</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="flex flex-wrap gap-2">
                              {personalityOptions.map((trait) => (
                                 <button
                                    key={trait}
                                    onClick={() => togglePersonalityTrait(trait)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${settings.personality_traits?.includes(trait)
                                       ? 'bg-primary text-primary-foreground'
                                       : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                       }`}
                                 >
                                    {trait}
                                 </button>
                              ))}
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  <div className="space-y-6">
                     <Card>
                        <CardHeader>
                           <CardTitle>Profile Preview</CardTitle>
                           <CardDescription>How your brand appears to others</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="text-center space-y-4">
                              <Avatar className="w-20 h-20 mx-auto">
                                 <AvatarImage src={settings.profile_image_url || ''} />
                                 <AvatarFallback>{settings.full_name ? getInitials(settings.full_name) : ''}</AvatarFallback>
                              </Avatar>
                              <div>
                                 <h3 className="text-lg font-semibold">{settings.full_name}</h3>
                                 <p className="text-sm">{settings.location}</p>
                                 <p className="text-sm text-muted-foreground mt-2">{settings.bio}</p>
                              </div>
                              <div className="flex flex-wrap gap-1 justify-center">
                                 {settings.personality_traits?.slice(0, 3).map((trait) => (
                                    <Badge key={trait} variant="secondary" className="text-xs">
                                       {trait}
                                    </Badge>
                                 ))}
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                           <CardTitle>Upload Photos</CardTitle>
                           <CardDescription>Add personal photos for AI content generation</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                 {settings.personal_photo_urls?.map((url, index) => (
                                    <div key={index} className="relative group">
                                       <img src={url} alt="Personal Photo" className="w-full h-24 object-cover rounded-md" />
                                       <Button
                                          variant="destructive"
                                          size="icon"
                                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => {
                                             const newPhotos = (settings.personal_photo_urls || []).filter((_, i) => i !== index);
                                             updateField('personal_photo_urls', newPhotos);
                                          }}
                                       >
                                          <X className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 ))}
                              </div>
                              <Label htmlFor="personal-photo-upload" className="block cursor-pointer">
                                 <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                                    {uploading.personal_photo_urls ? (
                                       <Loader className="h-8 w-8 mx-auto mb-2 animate-spin" />
                                    ) : (
                                       <Upload className="h-8 w-8 mx-auto mb-2" />
                                    )}
                                    <p className="text-muted-foreground mb-1">Upload new photo</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB each</p>
                                 </div>
                              </Label>
                              <Input
                                 id="personal-photo-upload"
                                 type="file"
                                 className="hidden"
                                 onChange={(e) => handleFileUpload(e, 'personal_photo_urls', 'personal_photos', true)}
                                 accept="image/jpeg,image/png"
                                 disabled={uploading.personal_photo_urls}
                              />
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="story" className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Your Story</CardTitle>
                     <CardDescription>Tell your professional journey and background</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Textarea
                        value={settings.story || ''}
                        onChange={(e) => updateField('story', e.target.value)}
                        placeholder="Share your professional journey, what drives you, and how you got to where you are today..."
                        rows={4}
                     />
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center justify-between">
                        <div>
                           <CardTitle>Projects</CardTitle>
                           <CardDescription>Showcase your key projects and accomplishments</CardDescription>
                        </div>
                        <Button onClick={addProject} size="sm">
                           <Plus className="h-4 w-4 mr-1" />
                           Add Project
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {settings.projects?.map((project, index) => (
                           <div key={index} className="p-4 rounded-lg border border-border">
                              <div className="flex items-start justify-between mb-3">
                                 <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                       <Input
                                          value={project.name}
                                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                                          placeholder="Project name"
                                       />
                                       <Input
                                          value={project.year}
                                          onChange={(e) => updateProject(index, 'year', e.target.value)}
                                          placeholder="Year"
                                       />
                                    </div>
                                    <Textarea
                                       value={project.description}
                                       onChange={(e) => updateProject(index, 'description', e.target.value)}
                                       placeholder="Project description"
                                       rows={2}
                                    />
                                 </div>
                                 <Button
                                    onClick={() => removeProject(index)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 ml-2"
                                 >
                                    <X className="h-4 w-4" />
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center justify-between">
                        <div>
                           <CardTitle>Work Experience</CardTitle>
                           <CardDescription>Your professional background and roles</CardDescription>
                        </div>
                        <Button onClick={addWorkExperience} size="sm">
                           <Plus className="h-4 w-4 mr-1" />
                           Add Experience
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {settings.work_experiences?.map((exp, index) => (
                           <div key={index} className="p-4 rounded-lg border border-border">
                              <div className="flex items-start justify-between mb-3">
                                 <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                       <Input
                                          value={exp.company}
                                          onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                          placeholder="Company name"
                                       />
                                       <Input
                                          value={exp.role}
                                          onChange={(e) => updateWorkExperience(index, 'role', e.target.value)}
                                          placeholder="Job title"
                                       />
                                    </div>
                                    <Input
                                       value={exp.duration}
                                       onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                                       placeholder="Duration (e.g., 2020-2022)"
                                    />
                                    <Textarea
                                       value={exp.description}
                                       onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                       placeholder="Job description and achievements"
                                       rows={2}
                                    />
                                 </div>
                                 <Button
                                    onClick={() => removeWorkExperience(index)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 ml-2"
                                 >
                                    <X className="h-4 w-4" />
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center justify-between">
                        <div>
                           <CardTitle>Achievements</CardTitle>
                           <CardDescription>Notable accomplishments and recognition</CardDescription>
                        </div>
                        <Button onClick={addAchievement} size="sm">
                           <Plus className="h-4 w-4 mr-1" />
                           Add Achievement
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                        {settings.achievements?.map((achievement, index) => (
                           <div key={index} className="flex items-center space-x-3">
                              <Input
                                 value={achievement}
                                 onChange={(e) => updateAchievement(index, e.target.value)}
                                 placeholder="Achievement description"
                              />
                              <Button
                                 onClick={() => removeAchievement(index)}
                                 size="sm"
                                 variant="ghost"
                                 className="text-red-400 hover:text-red-300"
                              >
                                 <X className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <span>AI Training Integration</span>
                     </CardTitle>
                     <CardDescription>
                        Your brand settings automatically train the AI for personalized content generation
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-purple-500/30">
                           <h4 className="font-medium text-purple-300 mb-2">Brand Voice Training</h4>
                           <p className="text-sm text-muted-foreground mb-3">
                              Your personality traits, tone preferences, and voice settings are automatically used to train the AI model.
                           </p>
                           <div className="flex items-center justify-between">
                              <span className="text-xs">Training Status: Active</span>
                              <Badge className="bg-green-600">Synced</Badge>
                           </div>
                        </div>

                        <div className="p-4 rounded-lg border">
                           <h4 className="font-medium mb-2">Content Preferences</h4>
                           <p className="text-sm text-muted-foreground mb-3">
                              Your topics, formats, and hashtag preferences guide AI content generation.
                           </p>
                           <div className="flex items-center justify-between">
                              <span className="text-xs">Last Updated: Just now</span>
                              <Badge className="bg-green-600">Synced</Badge>
                           </div>
                        </div>

                        <div className="p-4 rounded-lg bg-emerald-600/20 border border-emerald-500/30">
                           <h4 className="font-medium text-emerald-300 mb-2">Personal Context</h4>
                           <p className="text-sm text-muted-foreground mb-3">
                              Your story, projects, and work experience provide context for authentic content creation.
                           </p>
                           <div className="flex items-center justify-between">
                              <span className="text-xs">Context Richness: High</span>
                              <Badge className="bg-green-600">Synced</Badge>
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg">
                           <div>
                              <h4 className="font-medium">Advanced AI Training</h4>
                              <p className="text-sm">Upload documents and connect social accounts for deeper learning</p>
                           </div>
                           <Link href="/dashboard/ai-training">
                              <Button>
                                 <Sparkles className="h-4 w-4 mr-2" />
                                 Open AI Training
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="voice" className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>Voice & Tone Settings</span>
                     </CardTitle>
                     <CardDescription>Define how your brand communicates and sounds</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <Label>Overall Tone</Label>
                           <Select
                              value={settings.tone}
                              onValueChange={(value) => updateField("tone", value)}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select Tone" />
                              </SelectTrigger>
                              <SelectContent>
                                 {toneOptions.map((tone) => (
                                    <SelectItem key={tone} value={tone}>
                                       {tone}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>

                        <div>
                           <Label>Writing Style</Label>
                           <Select
                              value={settings.writing_style}
                              onValueChange={(value) => updateField("writing_style", value)}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select Writing Style" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="conversational">Conversational</SelectItem>
                                 <SelectItem value="formal">Formal</SelectItem>
                                 <SelectItem value="casual">Casual</SelectItem>
                                 <SelectItem value="technical">Technical</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>

                     <div>
                        <Label htmlFor="style">Content Style</Label>
                        <Textarea
                           id="style"
                           value={settings.content_style || ''}
                           onChange={(e) => updateField('content_style', e.target.value)}
                           rows={2}
                        />
                     </div>

                     <div>
                        <Label htmlFor="language">Language Guidelines</Label>
                        <Textarea
                           id="language"
                           value={settings.language_guidelines || ''}
                           onChange={(e) => updateField('language_guidelines', e.target.value)}
                           rows={2}
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <Label>Words to Avoid</Label>
                           <div className="mt-2 space-y-2">
                              <div className="flex flex-wrap gap-1">
                                 {settings.words_to_avoid?.map((word, index) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                       {word}
                                       <button
                                          onClick={() => {
                                             const newWords = (settings.words_to_avoid || []).filter((_, i) => i !== index);
                                             updateField('words_to_avoid', newWords);
                                          }}
                                          className="ml-1 hover:text-red-200"
                                       >
                                          ×
                                       </button>
                                    </Badge>
                                 ))}
                              </div>
                              <Input
                                 placeholder="Add word to avoid..."
                                 onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                       const word = e.currentTarget.value.trim();
                                       if (word) {
                                          updateField('words_to_avoid', [...(settings.words_to_avoid || []), word]);
                                          e.currentTarget.value = '';
                                       }
                                    }
                                 }}
                              />
                           </div>
                        </div>

                        <div>
                           <Label>Preferred Words</Label>
                           <div className="mt-2 space-y-2">
                              <div className="flex flex-wrap gap-1">
                                 {settings.words_to_prefer?.map((word, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs bg-green-600">
                                       {word}
                                       <button
                                          onClick={() => {
                                             const newWords = (settings.words_to_prefer || []).filter((_, i) => i !== index);
                                             updateField('words_to_prefer', newWords);
                                          }}
                                          className="ml-1 hover:text-green-200"
                                       >
                                          ×
                                       </button>
                                    </Badge>
                                 ))}
                              </div>
                              <Input
                                 placeholder="Add preferred word..."
                                 onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                       const word = e.currentTarget.value.trim();
                                       if (word) {
                                          updateField('words_to_prefer', [...(settings.words_to_prefer || []), word]);
                                          e.currentTarget.value = '';
                                       }
                                    }
                                 }}
                              />
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                           <Target className="h-5 w-5" />
                           <span>Content Topics</span>
                        </CardTitle>
                        <CardDescription>Topics you want to create content about</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-3">
                           <div className="flex flex-wrap gap-2">
                              {settings.topics?.map((topic, index) => (
                                 <Badge key={index} variant="outline" className="text-sm">
                                    {topic}
                                    <button
                                       onClick={() => removeTopic(topic)}
                                       className="ml-1 hover:text-red-400"
                                    >
                                       ×
                                    </button>
                                 </Badge>
                              ))}
                           </div>
                           <Input
                              placeholder="Add new topic..."
                              onKeyPress={(e) => {
                                 if (e.key === 'Enter') {
                                    addTopic(e.currentTarget.value.trim());
                                    e.currentTarget.value = '';
                                 }
                              }}
                           />
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                           <Hash className="h-5 w-5" />
                           <span>Hashtags</span>
                        </CardTitle>
                        <CardDescription>Your go-to hashtags for content</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-3">
                           <div className="flex flex-wrap gap-2">
                              {settings.hashtags?.map((hashtag, index) => (
                                 <Badge key={index} variant="secondary" className="text-sm">
                                    {hashtag}
                                    <button
                                       onClick={() => removeHashtag(hashtag)}
                                       className="ml-1 hover:text-blue-200"
                                    >
                                       ×
                                    </button>
                                 </Badge>
                              ))}
                           </div>
                           <Input
                              placeholder="Add hashtag..."
                              onKeyPress={(e) => {
                                 if (e.key === 'Enter') {
                                    addHashtag(e.currentTarget.value.trim());
                                    e.currentTarget.value = '';
                                 }
                              }}
                           />
                        </div>
                     </CardContent>
                  </Card>
               </div>

               <Card>
                  <CardHeader>
                     <CardTitle>Content Formats & Scheduling</CardTitle>
                     <CardDescription>Preferred content types and posting schedule</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div>
                        <Label>Preferred Content Formats</Label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                           {settings.content_formats?.map((format, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 rounded">
                                 <span className="text-sm">{format}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <Label>Posting Frequency</Label>
                           <Select
                              value={settings.posting_frequency}
                              onValueChange={(value) => updateField("posting_frequency", value)}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select Posting Frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="daily">Daily</SelectItem>
                                 <SelectItem value="weekly">Weekly</SelectItem>
                                 <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                                 <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div>
                           <Label>Best Posting Times</Label>
                           <div className="mt-1 flex flex-wrap gap-1">
                              {settings.best_posting_times?.map((time, index) => (
                                 <Badge key={index} variant="outline" className="text-xs">
                                    {time}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="visual" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                           <Palette className="h-5 w-5" />
                           <span>Brand Colors</span>
                        </CardTitle>
                        <CardDescription>Your brand color palette</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <Label>Primary Color</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                 <Input
                                    type="color"
                                    value={settings.brand_colors?.primary || ''}
                                    onChange={(e) => updateNestedField('brand_colors', 'primary', e.target.value)}
                                    className="w-12 h-8"
                                 />
                                 <Input
                                    value={settings.brand_colors?.primary || ''}
                                    onChange={(e) => updateNestedField('brand_colors', 'primary', e.target.value)}
                                 />
                              </div>
                           </div>

                           <div>
                              <Label>Secondary Color</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                 <Input
                                    type="color"
                                    value={settings.brand_colors?.secondary || ''}
                                    onChange={(e) => updateNestedField('brand_colors', 'secondary', e.target.value)}
                                    className="w-12 h-8"
                                 />
                                 <Input
                                    value={settings.brand_colors?.secondary || ''}
                                    onChange={(e) => updateNestedField('brand_colors', 'secondary', e.target.value)}
                                 />
                              </div>
                           </div>

                           <div>
                              <Label>Accent Color</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                 <Input
                                    type="color"
                                    value={settings.brand_colors?.accent || ''}
                                    onChange={(e) => updateNestedField('brand_colors', 'accent', e.target.value)}
                                    className="w-12 h-8 rounded border border-border"
                                 />
                                 <Input
                                    value={settings.brand_colors?.accent || ''}
                                    onChange={(e) => updateNestedField('brand_colors', 'accent', e.target.value)}
                                 />
                              </div>
                           </div>

                           <div>
                              <Label>Text Color</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                 <Input
                                    type="color"
                                    value={settings.brand_colors?.text || ''}
                                    onChange={(e) => updateNestedField('brand_colors', 'text', e.target.value)}
                                    className="w-12 h-8 rounded border border-border"
                                 />
                                 <Input
                                    value={settings.brand_colors?.text || ''}
                                    onChange={(e) => updateNestedField('brand_colors', 'text', e.target.value)}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="p-4 rounded-lg border border-border" style={{ backgroundColor: settings.brand_colors?.background }}>
                           <h4 className="font-medium mb-2" style={{ color: settings.brand_colors?.text }}>Color Preview</h4>
                           <div className="flex space-x-2">
                              <div className="w-8 h-8 rounded" style={{ backgroundColor: settings.brand_colors?.primary }}></div>
                              <div className="w-8 h-8 rounded" style={{ backgroundColor: settings.brand_colors?.secondary }}></div>
                              <div className="w-8 h-8 rounded" style={{ backgroundColor: settings.brand_colors?.accent }}></div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                           <Upload className="h-5 w-5" />
                           <span>Brand Assets</span>
                        </CardTitle>
                        <CardDescription>Upload your brand assets</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div>
                           <Label htmlFor="profile-image-upload">Profile Image</Label>
                           <div className="mt-2 flex items-center space-x-4">
                              <Avatar className="w-16 h-16">
                                 <AvatarImage src={settings.profile_image_url || ''} />
                                 <AvatarFallback>{settings.full_name ? getInitials(settings.full_name) : ''}</AvatarFallback>
                              </Avatar>
                              <Button variant="outline" size="sm" asChild>
                                 <Label htmlFor="profile-image-upload">
                                    {uploading.profile_image_url ? (
                                       <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                       <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    Upload New
                                 </Label>
                              </Button>
                              <Input
                                 id="profile-image-upload"
                                 type="file"
                                 className="hidden"
                                 onChange={(e) => handleFileUpload(e, 'profile_image_url', 'profile_images')}
                                 accept="image/jpeg,image/png"
                                 disabled={uploading.profile_image_url}
                              />
                           </div>
                        </div>

                        <div>
                           <Label htmlFor="logo-upload">Logo</Label>
                           <div className="mt-2 p-4 border-2 border-dashed border-border rounded-lg text-center">
                              {settings.logo_url && (
                                 <img src={settings.logo_url} alt="Logo Preview" className="max-h-24 mx-auto mb-2" />
                              )}
                              <Label htmlFor="logo-upload" className="block cursor-pointer">
                                 {uploading.logo_url ? (
                                    <Loader className="h-8 w-8 mx-auto mb-2 animate-spin" />
                                 ) : (
                                    <Upload className="h-8 w-8 mx-auto mb-2" />
                                 )}
                                 <p className="text-sm">Upload your logo</p>
                                 <Button variant="outline" size="sm" className="mt-2" asChild>
                                    <Label htmlFor="logo-upload">
                                       Choose File
                                    </Label>
                                 </Button>
                              </Label>
                              <Input
                                 id="logo-upload"
                                 type="file"
                                 className="hidden"
                                 onChange={(e) => handleFileUpload(e, 'logo_url', 'logos')}
                                 accept="image/jpeg,image/png"
                                 disabled={uploading.logo_url}
                              />
                           </div>
                        </div>

                        <div>
                           <Label htmlFor="watermark-upload">Watermark</Label>
                           <div className="mt-2 p-4 border-2 border-dashed border-border rounded-lg text-center">
                              {settings.watermark_url && (
                                 <img src={settings.watermark_url} alt="Watermark Preview" className="max-h-24 mx-auto mb-2" />
                              )}
                              <Label htmlFor="watermark-upload" className="block cursor-pointer">
                                 {uploading.watermark_url ? (
                                    <Loader className="h-8 w-8 mx-auto mb-2 animate-spin" />
                                 ) : (
                                    <Upload className="h-8 w-8 mx-auto mb-2" />
                                 )}
                                 <p className="text-sm">Upload watermark for images</p>
                                 <Button variant="outline" size="sm" className="mt-2" asChild>
                                    <Label htmlFor="watermark-upload">
                                       Choose File
                                    </Label>
                                 </Button>
                              </Label>
                              <Input
                                 id="watermark-upload"
                                 type="file"
                                 className="hidden"
                                 onChange={(e) => handleFileUpload(e, 'watermark_url', 'watermarks')}
                                 accept="image/jpeg,image/png"
                                 disabled={uploading.watermark_url}
                              />
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
