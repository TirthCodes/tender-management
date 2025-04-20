"use server";

import { prisma } from "@/lib/prisma";

export async function createClarity(formData: FormData) {
  try {
    await prisma.clarity.create({
      data: {
        stName: formData.get("stName") as string,
        stShortName: formData.get("stShortName") as string,
        inSerial: Number(formData.get("inSerial")),
      },
    });
    return {
      success: true,
      message: "Clarity created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error creating clarity",
    };
  }
}

export async function updateClarity(id: number, formData: FormData) {
  try {
    await prisma.clarity.update({
      where: { id },
      data: {
        stName: formData.get("stName") as string,
        stShortName: formData.get("stShortName") as string,
        inSerial: Number(formData.get("inSerial")),
      },
    });

    return {
      success: true,
      message: "Clarity updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error updating clarity",
    };
  }
}

export async function deleteClarity(id: number) {
  try {
    await prisma.clarity.delete({
      where: { id },
    });
    return {
      success: true,
      message: "Clarity deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error deleting clarity",
    };
  }
}