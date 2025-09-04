'use client';

import { useState } from 'react';
import {
   Plus,
   Users,
   TrendingUp,
   Calendar,
   Link as LinkIcon,
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

const PlatformIcons = {
   twitter: FaTwitter,
   linkedin: FaLinkedinIn,
   instagram: FaInstagram,
   youtube: FaYoutube,
   facebook: FaFacebook,
   tiktok: FaTiktok,
   pinterest: FaPinterest,
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ConnectedAccounts from '@/components/accounts/ConnectedAccounts';

const initialAccounts = [
   {
      id: 1,
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
      id: 2,
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
   },
   {
      id: 4,
      platform: 'youtube',
      name: 'YouTube',
      username: 'John Doe Channel',
      followers: 2300,
      status: 'connected',
      lastSync: '2024-01-15T08:15:00Z',
      autoPost: false,
      permissions: ['read', 'write']
   }
];

const availablePlatforms = [
   { id: 'facebook', name: 'Facebook', description: 'Connect your Facebook page or profile' },
   { id: 'tiktok', name: 'TikTok', description: 'Share videos and engage with TikTok audience' },
   { id: 'pinterest', name: 'Pinterest', description: 'Pin your content and reach visual audiences' }
];




export default function SocialAccounts() {
   const [accounts, setAccounts] = useState(initialAccounts);
   const [showConnectDialog, setShowConnectDialog] = useState(false);
   const [selectedPlatform, setSelectedPlatform] = useState(null);

   const connectPlatform = (platform) => {
      setSelectedPlatform(platform);
      setShowConnectDialog(true);
   };

   return (
      <div className="dashboard-page-container">
         <div className="mb-8">
            <h1 className="dashboard-header-title">Social Accounts</h1>
            <p className="dashboard-header-description">
               Connect and manage your social media accounts for seamless content publishing
            </p>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Connected Accounts</p>
                        <p className="text-2xl font-bold    ">{accounts.length}</p>
                     </div>
                     <LinkIcon className="h-8 w-8 text-blue-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Total Followers</p>
                        <p className="text-2xl font-bold    ">
                           {accounts.reduce((sum, acc) => sum + acc.followers, 0).toLocaleString()}
                        </p>
                     </div>
                     <Users className="h-8 w-8 text-purple-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Auto-Post Enabled</p>
                        <p className="text-2xl font-bold    ">
                           {accounts.filter(acc => acc.autoPost).length}
                        </p>
                     </div>
                     <Calendar className="h-8 w-8 text-green-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Health Status</p>
                        <p className="text-2xl font-bold    ">
                           {accounts.filter(acc => acc.status === 'connected').length}/{accounts.length}
                        </p>
                     </div>
                     <TrendingUp className="h-8 w-8 text-orange-400" />
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <ConnectedAccounts accounts={accounts} setAccounts={setAccounts} />
            </div>

            {/* Add New Account */}
            <div className="space-y-6">
               <Card  >
                  <CardHeader>
                     <CardTitle  >Add New Account</CardTitle>
                     <CardDescription>Connect additional social media platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                        {availablePlatforms.map((platform) => {
                           const PlatformIcon = PlatformIcons[platform.id];
                           return (
                              <button
                                 key={platform.id}
                                 onClick={() => connectPlatform(platform)}
                                 className="w-full flex items-center space-x-3 p-3 rounded-lg   hover: /50 transition-colors border  border-border"
                              >
                                 <div className={`w-8 h-8 rounded flex items-center justify-center    `}>
                                    <PlatformIcon />
                                 </div>
                                 <div className="text-left">
                                    <div className="text-sm font-medium    ">{platform.name}</div>
                                    <div className="text-xs    ">{platform.description}</div>
                                 </div>
                                 <Plus className="h-4 w-4     ml-auto" />
                              </button>
                           );
                        })}
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Connect Platform Dialog */}
         <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogContent className="  border-border">
               <DialogHeader>
                  <DialogTitle  >
                     Connect {selectedPlatform?.name}
                  </DialogTitle>
                  <DialogDescription>
                     Authorize SocialAI to access your {selectedPlatform?.name} account
                  </DialogDescription>
               </DialogHeader>
               <div className="space-y-4">
                  <div className="p-4 rounded-lg   border  border-border">
                     <h4 className="text-sm font-medium     mb-2">Permissions Required:</h4>
                     <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Read your profile information</li>
                        <li>• Post content on your behalf</li>
                        <li>• Access analytics data</li>
                        <li>• Manage scheduled posts</li>
                     </ul>
                  </div>

                  <div className="p-4 rounded-lg    border   ">
                     <p className="text-sm  ">
                        Your account credentials are securely encrypted and never stored on our servers.
                     </p>
                  </div>

                  <div className="flex space-x-3">
                     <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowConnectDialog(false)}
                     >
                        Cancel
                     </Button>
                     <Button className="flex-1">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Connect Account
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}
