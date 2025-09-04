import { mockPagesAndGroups } from "@/data/mockPagesAndGroups";
import { PageGroupDetailsClient } from "./PageGroupDetailsClient";

export default async function PageGroupDetailsPage({ params }: { params: { id: string } }) {
   const { id } = await params;
   const pageDetails = mockPagesAndGroups.find(p => p.id === id);

   if (!pageDetails) {
      return <div className="p-8">Page or Group not found.</div>;
   }

   return <PageGroupDetailsClient pageDetails={pageDetails} />;
}
