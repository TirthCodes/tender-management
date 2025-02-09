"use server";

import { prisma } from "@/lib/prisma";

export async function createColor(formData: FormData) {
  try {
    await prisma.color.create({
      data: {
        stName: formData.get("stName") as string,
        stShortName: formData.get("stShortName") as string,
        inSerial: Number(formData.get("inSerial")),
      },
    });
    // return redirect("/tenders/colors");
    return {
      success: true,
      message: "Color created successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error creating color",
    }
  }
}

export async function updateColor(id: number, formData: FormData) {
  try {
    
    await prisma.color.update({
      where: { id },
      data: {
        stName: formData.get("stName") as string,
        stShortName: formData.get("stShortName") as string,
        inSerial: Number(formData.get("inSerial")),
      },
    });

    return {
      success: true,
      message: "Color updated successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error updating color",
    }
  }
}

export async function deleteColor(id: number) {
  try {
    await prisma.color.delete({
      where: { id },
    });
    return {
      success: true,
      message: "Color deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error deleting color",
    };
  }
}
