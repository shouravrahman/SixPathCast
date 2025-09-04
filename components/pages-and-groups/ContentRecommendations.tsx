'use client';

import { Lightbulb } from "lucide-react";
import {
  Card,  CardContent,  CardDescription,  CardHeader,  CardTitle,
} from "@/components/ui/card";
import { mockContentRecommendations } from "@/data/mockPageDetailsData";

export function ContentRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Recommendations</CardTitle>
        <CardDescription>AI-driven suggestions for your content strategy.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {mockContentRecommendations.map((rec) => (
            <li key={rec.id} className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400 mt-1" />
              <p>{rec.suggestion}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
