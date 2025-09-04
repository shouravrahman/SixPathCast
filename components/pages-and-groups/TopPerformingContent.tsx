'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTopPerformingContent } from "@/data/mockPageDetailsData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MousePointerClick, Clock } from 'lucide-react';

export function TopPerformingContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Content</CardTitle>
        <CardDescription>Your best posts by engagement and reach.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Content</TableHead>
                <TableHead className="text-center">Impressions</TableHead>
                <TableHead className="text-center">Engagement</TableHead>
                <TableHead className="text-center">CTR</TableHead>
                <TableHead className="text-center">Watch Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTopPerformingContent.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <p className="font-medium">{post.content}</p>
                    <Badge variant="secondary" className="mt-1">{post.type}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono">{post.impressions}</TableCell>
                  <TableCell className="text-center font-mono">{post.engagement}</TableCell>
                  <TableCell className="text-center font-mono">{post.ctr || 'N/A'}</TableCell>
                  <TableCell className="text-center font-mono">{post.watchTime || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
