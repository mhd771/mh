import { Topbar } from "@/components/Topbar";
import { AIGeneratorForm } from "@/components/AIGeneratorForm";

export default function AIGeneratorPage() {
  return (
    <>
      <Topbar title="Generateur IA" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <p className="mb-6 text-sm text-fg-muted">
            Generez un titre, une description, des bullet points et des mots-cles optimises pour
            vos annonces. Vous pouvez tout modifier avant utilisation.
          </p>
          <AIGeneratorForm />
        </div>
      </main>
    </>
  );
}
