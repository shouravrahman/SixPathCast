'use client';

import BulkGenerate from '@/components/bulk/BulkGenerate';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function BulkGeneratePage() {
   return (
      <div className="dashboard-page-container">
         <div className="mb-8 flex items-center justify-between">
            <div>
               <h1 className="dashboard-header-title">Bulk Content Generation</h1>
               <p className="dashboard-header-description">
                  Generate large amounts of content from topics or a CSV file.
               </p>
            </div>
            <Link href="/dashboard/create">
               <Button className="btn-gradient    ">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
               </Button>
            </Link>
         </div>
         <BulkGenerate />
      </div>
   );
}
