import { db } from "../lib/db";
import { CreateTransactionInput } from "../types";
import { Decimal } from "@prisma/client/runtime/library";

export const createTransaction = async (
  transactionData: CreateTransactionInput
) => {
  return db.$transaction(async (tx) => {
    const debitAccount = await tx.account.findUnique({
      where: { id: transactionData.debitAccountId },
    });

    const creditAccount = await tx.account.findUnique({
      where: { id: transactionData.creditAccountId },
    });
    if (!debitAccount || !creditAccount) {
      throw new Error("One or both accounts not found");
    }

    const amount = new Decimal(transactionData.amount);
    if (debitAccount.balance.lt(amount)) {
      throw new Error("Insufficient funds");
    }
    await tx.account.update({
      where: { id: debitAccount.id },
      data: { balance: { decrement: amount } },
    });
    await tx.account.update({
      where: { id: creditAccount.id },
      data: { balance: { increment: amount } },
    });
    const transaction = await tx.transaction.create({
      data: {
        ...transactionData,
        amount: amount,
        type: "TRANSFER",
        status: "COMPLETED",
      },
      include: {
        debitAccount: {
          select: { id: true, name: true, userId: true },
        },
        creditAccount: {
          select: { id: true, name: true, userId: true },
        },
      },
    });

    return transaction;
  });
};
export const findTransactionsByAccountId = async (accountId: string, limit = 50, offset = 0) => {
    return db.transaction.findMany({
      where: {
        OR: [
          { debitAccountId: accountId },
          { creditAccountId: accountId }
        ]
      },
      include: {
        debitAccount: {
          select: { id: true, name: true }
        },
        creditAccount: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  export const findRecentTransactions = async (limit = 10) => {
    return db.transaction.findMany({
      include: {
        debitAccount: {
          select: { id: true, name: true, userId: true }
        },
        creditAccount: {
          select: { id: true, name: true, userId: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }