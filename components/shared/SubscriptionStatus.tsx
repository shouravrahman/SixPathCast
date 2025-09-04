"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

// Mock subscription hook for demonstration
const useSubscription = () => ({
  plan: 'Free',
  wordsUsed: 8200,
  wordsAvailable: 10000,
});

export const SubscriptionStatus = () => {
  const { plan, wordsUsed, wordsAvailable } = useSubscription();
  const usagePercentage = (wordsUsed / wordsAvailable) * 100;

  return (
    <Card className="mt-4">
      <CardHeader className="p-4">
        <CardDescription>Your Plan: {plan}</CardDescription>
        <CardTitle className="text-base">{wordsUsed.toLocaleString()} / {wordsAvailable.toLocaleString()} words</CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Button className="w-full">
          <Zap className="mr-2 h-4 w-4" /> Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
};
