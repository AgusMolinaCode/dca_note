import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const totalValueId = await prisma.totalValue.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!totalValueId) {
      return NextResponse.json(
        { message: "TotalValue not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(totalValueId);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { total, userId } = await request.json();

    const updatedTotalValue = await prisma.totalValue.update({
      where: {
        id: Number(params.id),
      },
      data: {
        total,
        userId
      },
    });

    if (!updatedTotalValue) {
      return NextResponse.json(
        { message: "TotalValue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTotalValue);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "TotalValue not found" },
            { status: 404 }
          );
        }
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deletedTotalValue = await prisma.totalValue.delete({
      where: {
        id: Number(params.id),
      },
    });

    if (!deletedTotalValue) {
      return NextResponse.json(
        { message: "TotalValue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedTotalValue);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "TotalValue not found" },
            { status: 404 }
          );
        }
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}