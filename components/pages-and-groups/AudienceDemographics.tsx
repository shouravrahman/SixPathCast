'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { mockAudienceDemographics } from "@/data/mockPageDetailsData";

const chartConfig = { value: { label: "Value" } };
const COLORS = ["hsl(var(--primary))", "#hsl(var(--secondary))", "#hsl(var(--accent))", "#hsl(var(--info))", "#hsl(var(--warning))"];

export function AudienceDemographics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Audience Demographics</CardTitle>
        <CardDescription className="text-xs">A glimpse into your audience.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1">Gender</h4>
          <ChartContainer config={chartConfig} className="w-full h-[150px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="value" />} />
              <Pie data={mockAudienceDemographics.gender} dataKey="value" nameKey="type" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={5}>
                {mockAudienceDemographics.gender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-1">Age Distribution</h4>
          <ChartContainer config={chartConfig} className="w-full h-[150px]">
            <BarChart data={mockAudienceDemographics.age} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="range" tickLine={false} tickMargin={5} axisLine={false} fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
