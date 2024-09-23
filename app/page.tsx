// I put "use client" because I want to use the use-session.ts hook
"use client";

import { Navbar } from "@/components/navbar";
import { useSession } from "@/hooks/use-session";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  const { status, session } = useSession();

  if (status === "pending") {
    return (
      <div className="min-h-scren flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
    </div>
  );
}
