import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET() {
  try {
    const values = await prisma.totalValue.findMany();
    return NextResponse.json(values);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const { total, userId } = await request.json();

    const newTotalValue = await prisma.totalValue.create({
      data: {
        total,
        userId,
      },
    });

    return NextResponse.json(newTotalValue);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "totalValue already exists." },
          { status: 400 }
        );
      }
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
