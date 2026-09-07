import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/Card";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <Topbar title="Nouveau produit" />
      <main className="flex-1 p-6">
        <Card className="mx-auto max-w-3xl">
          <ProductForm />
        </Card>
      </main>
    </>
  );
}
