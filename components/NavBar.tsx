import React from 'react';
import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-lg font-medium text-zinc-200 hover:text-white transition-colors"
          >
            anki
            <span className="text-blue-500">helper</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex items-center space-x-2 text-zinc-400 hover:text-white"
          >
            <Github className="h-4 w-4" />
            <span className="text-sm">Star on GitHub</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;