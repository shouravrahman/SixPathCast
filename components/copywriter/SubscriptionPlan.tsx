"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

// Mock subscription status hook
const useSubscription = () => ({
  status: "free", // can be 'free', 'pro', or 'business'
});

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["10,000 words/month", "Basic AI models", "1 Brand Voice", "Community support"],
    cta: "Current Plan",
    planId: "free",
  },
  {
    name: "Pro",
    price: "$29",
    features: [
      "100,000 words/month",
      "Advanced AI models",
      "Unlimited Brand Voices",
      "Priority email support",
    ],
    cta: "Upgrade to Pro",
    planId: "pro",
  },
  {
    name: "Business",
    price: "$99",
    features: [
      "Unlimited words",
      "All AI models",
      "Team collaboration",
      "Dedicated account manager",
    ],
    cta: "Upgrade to Business",
    planId: "business",
  },
];

export const SubscriptionPlan = () => {
  const { status } = useSubscription();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-8">Find the perfect plan</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={status === plan.planId ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.price}<span className="text-muted-foreground">/month</span></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={status === plan.planId}>
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};