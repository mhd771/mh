"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de l'inscription");
      }

      const signInRes = await signIn("credentials", { email, password, redirect: false });
      if (signInRes?.error) {
        throw new Error("Compte cree, mais la connexion automatique a echoue. Connectez-vous.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-fg">Creer un compte mhcode</h1>
        <p className="mt-1 text-sm text-fg-muted">Gratuit pour commencer.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nom" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Mot de passe"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Creer mon compte
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        Deja un compte ?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Connectez-vous
        </Link>
      </p>
    </Card>
  );
}
