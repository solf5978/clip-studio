// src/app/admin/admin-content.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function AdminContent() {
  // 1. Get the session on the server
  const session = await auth();

  // 2. Protect the page
  if (session?.user?.role !== "ADMIN") {
    // Redirect non-admins to the homepage
    redirect("/");
  }

  // 3. Fetch data for the admin
  const users = await prisma.user.findMany();

  return (
    <>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {session.user.name}.</p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">All Users</h2>
        <ul className="mt-4 list-disc pl-5">
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email}) - Role: {user.role}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
