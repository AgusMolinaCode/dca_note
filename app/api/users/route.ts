import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const { nickname, clerkId } = await request.json();

    const newUser = await prisma.user.create({
      data: {
        nickname,
        clerkId,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // Verifica si el error es una violación de la restricción de unicidad para `nickname`
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'El nickname ya está en uso.' }, { status: 400 });
      }
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
