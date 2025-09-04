'use client';

import { useState } from 'react';
import {
   Settings,
   Trash2,
   RefreshCw,
   CheckCircle,
   XCircle,
   AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaPinterest, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';

const PlatformIcons = {
   twitter: FaTwitter,
   linkedin: FaLinkedinIn,
   instagram: FaInstagram,
   youtube: FaYoutube,
   facebook: FaFacebook,
   tiktok: FaTiktok,
   pinterest: FaPinterest,
};
export default function ConnectedAccounts({ accounts, setAccounts }) {
   const getStatusIcon = (status) => {
      switch (status) {
         case 'connected':
            return <CheckCircle className="h-5 w-5 text-green-400" />;
         case 'error':
            return <XCircle className="h-5 w-5 text-red-400" />;
         case 'warning':
            return <AlertCircle className="h-5 w-5 text-yellow-400" />;
         default:
            return <XCircle className="h-5 w-5    " />;
      }
   };

   const getPlatformColor = (platform) => {
      const colors = {
         twitter: 'bg-black',
         linkedin: 'bg-blue-700',
         instagram: '  ',
         facebook: '  ',
         tiktok: 'bg-black',
         youtube: 'bg-red-600',
         pinterest: 'bg-red-500'
      };
      return colors[platform] || 'bg-slate-600';
   };

   const handleToggleAutoPost = (accountId) => {
      setAccounts(prev => prev.map(account =>
         account.id === accountId
            ? { ...account, autoPost: !account.autoPost }
            : account
      ));
   };

   const handleReconnect = (accountId) => {
      setAccounts(prev => prev.map(account =>
         account.id === accountId
            ? { ...account, status: 'connected', error: null, lastSync: new Date().toISOString() }
            : account
      ));
   };

   const handleDisconnect = (accountId) => {
      setAccounts(prev => prev.filter(account => account.id !== accountId));
   };

   return (
      <Card  >
         <CardHeader>
            <CardTitle  >Connected Accounts</CardTitle>
            <CardDescription>Manage your connected social media accounts</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {accounts.map((account) => {
                  const PlatformIcon = PlatformIcons[account.platform];
                  return (
                     <div key={account.id} className="flex items-center justify-between p-4 rounded-lg   border  border-border">
                        <div className="flex items-center space-x-4">
                           <div className={`w-12 h-12 rounded-lg flex items-center justify-center     ${getPlatformColor(account.platform)}`}>
                              <PlatformIcon />
                           </div>
                           <div>
                              <div className="flex items-center space-x-2">
                                 <h3 className="text-sm font-medium    ">{account.name}</h3>
                                 {getStatusIcon(account.status)}
                              </div>
                              <p className="text-sm    ">{account.username}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                 <span className="text-xs text-muted-foreground">
                                    {account.followers.toLocaleString()} followers
                                 </span>
                                 <span className="text-xs text-muted-foreground">
                                    Last sync: {new Date(account.lastSync).toLocaleDateString()}
                                 </span>
                              </div>
                              {account.error && (
                                 <p className="text-xs text-red-400 mt-1">{account.error}</p>
                              )}
                           </div>
                        </div>

                        <div className="flex items-center space-x-4">
                           <div className="flex items-center space-x-2">
                              <span className="text-xs    ">Auto-post</span>
                              <Switch
                                 checked={account.autoPost}
                                 onCheckedChange={() => handleToggleAutoPost(account.id)}
                                 disabled={account.status !== 'connected'}
                              />
                           </div>

                           <div className="flex space-x-2">
                              {account.status === 'error' ? (
                                 <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReconnect(account.id)}
                                 >
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Reconnect
                                 </Button>
                              ) : (
                                 <Button size="sm" variant="outline">
                                    <Settings className="h-4 w-4 mr-1" />
                                    Settings
                                 </Button>
                              )}
                              <Button
                                 size="sm"
                                 variant="outline"
                                 className="text-red-400 hover:text-red-300"
                                 onClick={() => handleDisconnect(account.id)}
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
}
