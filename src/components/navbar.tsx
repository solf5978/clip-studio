"use client";
import { useState } from "react";
import type { Session } from "next-auth";
import { UserNav } from "./user-nav";
import { SignInDialogContent } from "./sign-in-dialog";
import { LucideMenu, LucideX } from "lucide-react";
import { Button } from "./ui/button";
import NavItem from "./nav-item";
import Link from "next/link";
import { Dialog, DialogTrigger } from "./ui/dialog";

const Navbar = ({ session }: { session: Session | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <span className="text-xl font-bold text-gray-900">
                ClipStudio <b>Pro</b>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-end space-x-8">
            <NavItem href="#about" title="About" />
            <NavItem href="#features" title="Features" />
            <NavItem href="#pricing" title="Pricing" />
            <NavItem href="/faq" title="FAQ" />
          </div>
          <div className="hidden md:flex items-center justify-between space-x-2 gap-2">
            {session ? (
              <UserNav session={session} />
            ) : (
              // Wrap both triggers in one Dialog component
              <Dialog>
                {/* Trigger 1: Sign In Button */}
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Button>
                </DialogTrigger>

                {/* Trigger 2: Sign Up Button */}
                <DialogTrigger asChild>
                  <Button className="hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Button>
                </DialogTrigger>

                {/* This is the content that will pop up */}
                <SignInDialogContent />
              </Dialog>
            )}
          </div>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <LucideX className="w-6 h-6" />
            ) : (
              <LucideMenu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col w-full space-y-4">
              <NavItem href="/about" title="How It Works" />
              <NavItem href="/features" title="Features" />
              <NavItem href="/pricing" title="Pricing" />
              <NavItem href="/faq" title="FAQ" />
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {session ? (
                  <UserNav session={session} />
                ) : (
                  // Wrap both triggers in one Dialog component
                  <Dialog>
                    {/* Trigger 1: Sign In Button */}
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hover:text-blue-600 transition-colors"
                      >
                        Sign In
                      </Button>
                    </DialogTrigger>

                    {/* Trigger 2: Sign Up Button */}
                    <DialogTrigger asChild>
                      <Button className="hover:bg-blue-700 transition-colors">
                        Sign Up
                      </Button>
                    </DialogTrigger>

                    {/* This is the content that will pop up */}
                    <SignInDialogContent />
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
