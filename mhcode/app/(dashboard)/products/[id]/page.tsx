import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/Card";
import { ProductForm } from "@/components/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product || product.userId !== session.user.id) notFound();

  return (
    <>
      <Topbar title={`Modifier: ${product.name}`} />
      <main className="flex-1 p-6">
        <Card className="mx-auto max-w-3xl">
          <ProductForm
            productId={product.id}
            initialValues={{
              name: product.name,
              supplierUrl: product.supplierUrl ?? "",
              supplierPrice: product.supplierPrice,
              shippingCost: product.shippingCost,
              platformFeePct: product.platformFeePct,
              otherFees: product.otherFees,
              sellingPrice: product.sellingPrice,
              quantity: product.quantity,
            }}
          />
        </Card>
      </main>
    </>
  );
}
