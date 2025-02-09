"use server";

import { prisma } from "@/lib/prisma";

export async function createShape(formData: FormData) {

  try {
    await prisma.shape.create({
      data: {
        stName: formData.get("stName") as string,
        stShortName: formData.get("stShortName") as string,
        inSerial: Number(formData.get("inSerial")),
      },
    });

    return {
      success: true,
      message: "Shape created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error creating shape",
    };
  }
}

export async function updateShape(id: number, formData: FormData) {
  try {
    await prisma.shape.update({
      where: { id },
      data: {
        stName: formData.get("stName") as string,
        stShortName: formData.get("stShortName") as string,
        inSerial: Number(formData.get("inSerial")),
      },
    });
    return {
      success: true,
      message: "Shape updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error updating shape",
    };
  }
}

export async function deleteShape(id: number) {
  try {
    await prisma.shape.delete({
      where: { id },
    });
    return {
      success: true,
      message: "Shape deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error deleting shape",
    };
  }
}
