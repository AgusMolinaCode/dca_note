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
    const user = await prisma.user.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { nickname } = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(params.id),
      },
      data: {
        nickname
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
          );
        }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(params.id),
      },
    });

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedUser);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
          );
        }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}