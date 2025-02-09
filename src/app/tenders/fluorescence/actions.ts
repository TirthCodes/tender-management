"use server";

import { prisma } from "@/lib/prisma";

export async function createFluorescence(formData: FormData) {
  try {
    await prisma.fluorescence.create({
      data: {
        stName: formData.get("stName") as string,
        stShortName: formData.get("stShortName") as string,
        inSerial: Number(formData.get("inSerial")),
      },
    });
    return {
      success: true,
      message: "Fluorescence created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error creating fluorescence",
    };
  }
}

export async function updateFluorescence(id: number, formData: FormData) {
  try {
    await prisma.fluorescence.update({
      where: { id },
      data: {
        stName: formData.get("stName") as string,
        stShortName: formData.get("stShortName") as string,
        inSerial: Number(formData.get("inSerial")),
      },
    });

    return {
      success: true,
      message: "Fluorescence updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error updating fluorescence",
    };
  }
}

export async function deleteFluorescence(id: number) {
  try {
    await prisma.fluorescence.delete({
      where: { id },
    });
    return {
      success: true,
      message: "Fluorescence deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error deleting fluorescence",
    };
  }
}
