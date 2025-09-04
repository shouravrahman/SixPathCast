'use client';

import { useState } from 'react';
import {
   Heart,
   MessageCircle,
   Share,
   Bookmark,
   Play,
   Eye,
   ThumbsUp,
   Repeat2,
   TrendingUp,
   Filter,
   Search,
   Copy,
   ExternalLink,
   MoreHorizontal
} from 'lucide-react';

import {
   FaTwitter,
   FaLinkedinIn,
   FaInstagram,
   FaYoutube,
   FaFacebook,
   FaTiktok,
   FaPinterest,
} from 'react-icons/fa';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const PlatformIcons = {
   twitter: FaTwitter,
   linkedin: FaLinkedinIn,
   instagram: FaInstagram,
   youtube: FaYoutube,
   facebook: FaFacebook,
   tiktok: FaTiktok,
   pinterest: FaPinterest,
};

// Sample data
const samplePosts = [
   {
      id: 1,
      platform: 'instagram',
      type: 'image',
      author: 'design_inspiration',
      authorAvatar: '🎨',
      content: 'Minimalist workspace setup for maximum productivity. Less is more! ✨',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      stats: {
         likes: 2847,
         comments: 156,
         shares: 89,
         views: null
      },
      trending: true,
      hashtags: ['#minimalism', '#workspace', '#productivity']
   },
   {
      id: 2,
      platform: 'tiktok',
      type: 'video',
      author: 'tech_tips_daily',
      authorAvatar: '💻',
      content: 'Quick Photoshop hack that will save you hours! Try this amazing technique.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop',
      duration: '0:45',
      stats: {
         likes: 45200,
         comments: 892,
         shares: 1250,
         views: 125000
      },
      trending: true,
      hashtags: ['#photoshop', '#design', '#tutorial']
   },
   {
      id: 3,
      platform: 'twitter',
      type: 'text',
      author: 'startup_wisdom',
      authorAvatar: '🚀',
      content: 'The best marketing strategy is to create something people actually want to talk about. Stop interrupting what people are interested in and BE what people are interested in.',
      stats: {
         likes: 1847,
         comments: 234,
         shares: 567,
         views: 28500
      },
      trending: false,
      hashtags: ['#marketing', '#startup', '#wisdom']
   },
   {
      id: 4,
      platform: 'linkedin',
      type: 'article',
      author: 'Sarah Johnson',
      authorAvatar: '👩‍💼',
      content: '5 Content Marketing Trends That Will Dominate 2024',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      stats: {
         likes: 892,
         comments: 45,
         shares: 156,
         views: 5600
      },
      trending: false,
      hashtags: ['#contentmarketing', '#trends2024', '#marketing']
   },
   {
      id: 5,
      platform: 'youtube',
      type: 'video',
      author: 'CreativeChannel',
      authorAvatar: '🎬',
      content: 'How to Create Viral Content: 7 Proven Strategies',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
      duration: '12:34',
      stats: {
         likes: 8900,
         comments: 456,
         shares: 234,
         views: 67800
      },
      trending: true,
      hashtags: ['#viral', '#contentcreation', '#youtube']
   },
   {
      id: 6,
      platform: 'pinterest',
      type: 'image',
      author: 'DesignInspo',
      authorAvatar: '📌',
      content: 'Color Palette Inspiration for Brand Design',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=600&fit=crop',
      stats: {
         likes: 1200,
         comments: 67,
         shares: 890,
         views: null
      },
      trending: false,
      hashtags: ['#colorpalette', '#branding', '#design']
   },
   {
      id: 7,
      platform: 'facebook',
      type: 'image',
      author: 'Marketing Mastery',
      authorAvatar: '📈',
      content: 'Behind the scenes of our latest campaign. The results speak for themselves! 📊',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      stats: {
         likes: 567,
         comments: 89,
         shares: 134,
         views: null
      },
      trending: false,
      hashtags: ['#marketing', '#campaign', '#results']
   },
   {
      id: 8,
      platform: 'instagram',
      type: 'image',
      author: 'brand_stories',
      authorAvatar: '✨',
      content: 'Brand storytelling that converts. Here are 5 key elements every story needs.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
      stats: {
         likes: 3200,
         comments: 180,
         shares: 95,
         views: null
      },
      trending: true,
      hashtags: ['#branding', '#storytelling', '#marketing']
   }
];

const PostCard = ({ post, onRecreate }) => {
   const PlatformIcon = PlatformIcons[post.platform];

   const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
   };

   return (
      <div className="  rounded-lg overflow-hidden    transition-all duration-200">
         {/* Header */}
         <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <span className="text-2xl">{post.authorAvatar}</span>
               <div>
                  <div className="flex items-center space-x-2">
                     <span className="font-medium    dark:    text-sm">{post.author}</span>
                     <PlatformIcon className="w-4 h-4 text-muted-foreground dark:   " />
                     {post.trending && (
                        <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                           <TrendingUp className="w-3 h-3" />
                           <span className="text-xs font-medium">Trending</span>
                        </div>
                     )}
                  </div>
                  <span className="text-xs text-muted-foreground dark:    capitalize">{post.platform}</span>
               </div>
            </div>
            <button className="p-2    rounded-full transition-colors">
               <MoreHorizontal className="w-4 h-4 text-muted-foreground dark:   " />
            </button>
         </div>

         {/* Content */}
         <div className="px-4 pb-3">
            <p className="   dark:text-muted-foreground text-sm leading-relaxed mb-3">
               {post.content}
            </p>
         </div>

         {/* Media */}
         {(post.image || post.thumbnail) && (
            <div className="relative">
               <img
                  src={post.image || post.thumbnail}
                  alt="Post content"
                  className="w-full h-64 object-cover"
               />
               {post.type === 'video' && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                     <div className="  rounded-full p-3">
                        <Play className="w-5 h-5    fill-slate-800" />
                     </div>
                     {post.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/80     text-sm px-2 py-1 rounded">
                           {post.duration}
                        </div>
                     )}
                  </div>
               )}
            </div>
         )}

         {/* Engagement Stats */}
         <div className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground dark:    mb-4">
               <div className="flex items-center space-x-6">
                  <span className="flex items-center space-x-2 hover:text-red-500 text-red-400 transition-colors cursor-pointer">
                     <Heart className="w-4 h-4" />
                     <span>{formatNumber(post.stats.likes)}</span>
                  </span>
                  <span className="flex items-center space-x-2 hover:text-blue-500 text-blue-400 transition-colors cursor-pointer">
                     <MessageCircle className="w-4 h-4" />
                     <span>{formatNumber(post.stats.comments)}</span>
                  </span>
                  <span className="flex items-center space-x-2 hover:text-green-500 text-green-400 transition-colors cursor-pointer">
                     <Share className="w-4 h-4" />
                     <span>{formatNumber(post.stats.shares)}</span>
                  </span>
               </div>
               {post.stats.views && (
                  <span className="flex items-center space-x-2">
                     <Eye className="w-4 h-4" />
                     <span>{formatNumber(post.stats.views)} views</span>
                  </span>
               )}
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2 mb-4">
               {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-blue-500 dark:text-blue-400 text-sm hover:text-blue-600   cursor-pointer">
                     {tag}
                  </span>
               ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t  border-border dark: ">
               <div className="flex space-x-2">
                  <button className="p-2    rounded-lg transition-colors group">
                     <Bookmark className="w-4 h-4     dark:    group-hover:text-muted-foreground dark:group-hover:   " />
                  </button>
                  <button className="p-2    rounded-lg transition-colors group">
                     <ExternalLink className="w-4 h-4     dark:    group-hover:text-muted-foreground dark:group-hover:   " />
                  </button>
               </div>

               <button
                  onClick={() => onRecreate(post)}
                  className="   hover:bg-blue-700     px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
               >
                  <Copy className="w-4 h-4" />
                  <span>Recreate</span>
               </button>
            </div>
         </div>
      </div>
   );
};

export default function InspirationView() {
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedPlatform, setSelectedPlatform] = useState('all');
   const [sortBy, setSortBy] = useState('trending');

   const platforms = [
      { id: 'all', name: 'All' },
      { id: 'instagram', name: 'Instagram' },
      { id: 'tiktok', name: 'TikTok' },
      { id: 'youtube', name: 'YouTube' },
      { id: 'twitter', name: 'Twitter' },
      { id: 'linkedin', name: 'LinkedIn' },
      { id: 'facebook', name: 'Facebook' },
      { id: 'pinterest', name: 'Pinterest' }
   ];

   const sortOptions = [
      { id: 'trending', name: 'Trending' },
      { id: 'engagement', name: 'Top Engagement' },
      { id: 'recent', name: 'Recent' }
   ];

   const filteredPosts = samplePosts
      .filter(post => {
         if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) return false;
         if (searchTerm && !post.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
         return true;
      })
      .sort((a, b) => {
         if (sortBy === 'trending') return b.trending - a.trending;
         if (sortBy === 'engagement') {
            const aEngagement = a.stats.likes + a.stats.comments + a.stats.shares;
            const bEngagement = b.stats.likes + b.stats.comments + b.stats.shares;
            return bEngagement - aEngagement;
         }
         return 0;
      });

   const handleRecreate = (post) => {
      console.log('Recreating post:', post);
   };

   return (
      <div className="h-full flex flex-col ">
         {/* Minimal Filter Header */}
         <div className="p-4 border-b  border-border dark: ">
            <div className="flex items-center justify-between">
               {/* Search */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4    " />
                  <Input
                     type="text"
                     placeholder="Search content..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-64 pl-10 pr-4 py-2 text-sm "
                  />
               </div>

               <div className="flex items-center space-x-3">
                  {/* Platform Filter */}
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                     </SelectTrigger>
                     <SelectContent>
                        {platforms.map((platform) => (
                           <SelectItem key={platform.id} value={platform.id}>
                              {platform.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  {/* Sort Filter */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                     <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                     </SelectTrigger>
                     <SelectContent>
                        {sortOptions.map((option) => (
                           <SelectItem key={option.id} value={option.id}>
                              {option.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>
         </div>

         {/* Grid Layout */}
         <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} onRecreate={handleRecreate} />
               ))}
            </div>

            {filteredPosts.length === 0 && (
               <div className="text-center py-12">
                  <div className="text-muted-foreground dark:    text-lg mb-2">No posts found</div>
                  <p className="text-muted-foreground dark:text-muted-foreground text-sm">
                     Try adjusting your search or filter criteria
                  </p>
               </div>
            )}
         </div>
      </div>
   );
}
