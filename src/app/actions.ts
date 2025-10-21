// src/app/actions.ts
"use server";

import { z } from "zod";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

export type FormState = {
  error: string | null;
  success: string | null;
};

// Rename the schema
const SaveVideoSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    startTime: z.coerce.number().min(0, "Start time must be positive."),
    endTime: z.coerce.number().gt(0, "End time must be greater than 0."),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"], // Specify which field the error belongs to
  });

// Rename the function
export async function saveVideo(prevState: FormState, formData: FormData) {
  const session = await auth();
  console.log(session);

  if (!session?.user?.id) {
    return { error: "You must be logged in to save a video.", success: null };
  }

  // Use the new schema
  const validatedFields = SaveVideoSchema.safeParse({
    title: formData.get("title"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });

  if (!validatedFields.success) {
    // Find the first error message to display
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return {
      error: firstError || "Invalid input.",
      success: null,
    };
  }
  const { title, startTime, endTime } = validatedFields.data;
  try {
    await prisma.videoInfo.create({
      data: {
        title: title,
        userId: session.user.id,
        // Save the editing data into the JSON field
        videoData: {
          trim: {
            start: startTime,
            end: endTime,
          },
        },
      },
    });
  } catch (dbError) {
    return { error: "Database error: Failed to save video.", success: null };
  }

  revalidatePath("/dashboard");

  return { success: "Video saved successfully!", error: null };
}
