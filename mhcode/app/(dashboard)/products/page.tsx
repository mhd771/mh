import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/Button";
import { ProductTable } from "@/components/ProductTable";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const products = await prisma.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Topbar title="Produits" />
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-fg-muted">
            Gerez vos produits, leurs prix et leur rentabilite.
          </p>
          <Link href="/products/new">
            <Button>+ Ajouter un produit</Button>
          </Link>
        </div>

        <ProductTable products={products} />
      </main>
    </>
  );
}
