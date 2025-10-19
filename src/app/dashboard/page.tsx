// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  // If there's no user, redirect to the login page.
  // We will add Middleware later for a more robust solution.
  if (!user) {
    redirect("/");
  }

  if (session?.user?.role !== "ADMIN") {
    return (error: "Permission Denied");
  }

  // Fetch the user's videos from the database
  const videos = await prisma.videoInfo.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <Button asChild>
          <Link href="/">Create New Video</Link>
        </Button>
      </div>

      <div className="mt-8">
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/40 p-12 text-center">
            <h2 className="text-xl font-semibold">No videos yet!</h2>
            <p className="mt-2 text-muted-foreground">
              Start a new project to see it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* We will map over and display the videos here later */}
            {videos.map((video) => (
              <div
                key={video.id}
                className="rounded-lg border bg-card p-4 text-card-foreground"
              >
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Status: {video.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
