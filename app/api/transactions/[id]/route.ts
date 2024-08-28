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
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { amount, price, total, crypto, imageUrl, sellTotal } = await request.json();

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: Number(params.id),
      },
      data: {
        amount,
        price,
        total,
        crypto,
        imageUrl,
        sellTotal,
      },
    });

    if (!updatedTransaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "Transaction not found" },
            { status: 404 }
          );
        }
      } else if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deletedTransaction = await prisma.transaction.delete({
      where: {
        id: Number(params.id),
      },
    });

    if (!deletedTransaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedTransaction);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 404 }
        );
      }
    } else if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}