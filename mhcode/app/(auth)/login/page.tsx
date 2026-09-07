"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-fg">Connexion a mhcode</h1>
        <p className="mt-1 text-sm text-fg-muted">Pilotez vos ventes eBay en un coup d&apos;oeil.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Se connecter
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-medium text-brand-600 hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </Card>
  );
}
