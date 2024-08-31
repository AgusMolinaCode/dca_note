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
    const totalNoteId = await prisma.totalNotes.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!totalNoteId) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(totalNoteId);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { title, description, userId } = await request.json();

    const updatedTotalNote = await prisma.totalNotes.update({
      where: {
        id: Number(params.id),
      },
      data: {
        title,
        description,
        userId,
      },
    });

    if (!updatedTotalNote) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTotalNote);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Note not found" },
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
    const deletedTotalNote = await prisma.totalNotes.delete({
      where: {
        id: Number(params.id),
      },
    });

    if (!deletedTotalNote) {
      return NextResponse.json(
        { message: "TotalValue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedTotalNote);
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
