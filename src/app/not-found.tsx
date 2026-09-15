import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
      <div className="text-center space-y-8 max-w-lg">
        <h1 className="text-9xl font-bold text-[#0a1628] opacity-10">404</h1>
        
        <div className="-mt-16 space-y-4">
          <h2 className="text-3xl font-bold text-[#0a1628]">Page Not Found</h2>
          <p className="text-gray-600 text-lg">
            We couldn't find the page you were looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-[#0a1628] text-white">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact-us">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
