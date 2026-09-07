import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { generateProductCopy } from "@/services/aiService";

const schema = z.object({
  productName: z.string().min(1, "Le nom du produit est requis"),
  keywordsHint: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Donnees invalides" },
      { status: 400 }
    );
  }

  const result = await generateProductCopy(parsed.data);
  return NextResponse.json(result);
}
