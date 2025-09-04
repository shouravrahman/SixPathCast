'use client';

import { LineChart, Line, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { mockGrowthInsights } from "@/data/mockPageDetailsData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartConfig = {
  new: { label: "New", color: "hsl(var(--primary))" },
  unfollows: { label: "Unfollows", color: "hsl(var(--destructive))" },
};

export function GrowthInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Insights</CardTitle>
        <CardDescription>Follower growth over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
                <LineChart data={mockGrowthInsights.daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line dataKey="new" type="monotone" stroke="var(--color-new)" strokeWidth={2} dot={false} />
                    <Line dataKey="unfollows" type="monotone" stroke="var(--color-unfollows)" strokeWidth={2} dot={false} />
                </LineChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="weekly">
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
                <LineChart data={mockGrowthInsights.weekly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line dataKey="new" type="monotone" stroke="var(--color-new)" strokeWidth={2} dot={false} />
                    <Line dataKey="unfollows" type="monotone" stroke="var(--color-unfollows)" strokeWidth={2} dot={false} />
                </LineChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
