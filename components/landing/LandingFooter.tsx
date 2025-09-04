export function LandingFooter() {
   return (
      <footer className="border-t">
         <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SixPathCast. All Rights Reserved.</p>
         </div>
      </footer>
   );
}
