'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

export default function FilterSidebar({ selectedDate, setSelectedDate, filterPlatform, setFilterPlatform, platforms }) {
   return (
      <div className="space-y-6">
         <Card  >
            <CardHeader>
               <CardTitle  >Calendar</CardTitle>
            </CardHeader>
            <CardContent>
               <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
               />
            </CardContent>
         </Card>

         <Card  >
            <CardHeader>
               <CardTitle  >Quick Filters</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  <div>
                     <Label >Platform</Label>
                     <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Platforms</SelectItem>
                           {platforms.map((platform) => (
                              <SelectItem key={platform.id} value={platform.id}>
                                 {platform.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label >Status</Label>
                     <Select>
                        <SelectTrigger>
                           <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Status</SelectItem>
                           <SelectItem value="scheduled">Scheduled</SelectItem>
                           <SelectItem value="published">Published</SelectItem>
                           <SelectItem value="draft">Draft</SelectItem>
                           <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
