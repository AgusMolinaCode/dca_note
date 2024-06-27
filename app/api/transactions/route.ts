import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const transaction = await prisma.transaction.findMany();
    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
  }
}

export async function POST(request: Request) {
  try {
    const { amount, price, total, crypto, imageUrl } = await request.json();

    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        price,
        total,
        crypto,
        imageUrl,
      },
    });

    return NextResponse.json(newTransaction);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
