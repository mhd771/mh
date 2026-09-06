import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Non auth' }, { status: 401 });
  const { name, supplierInfo } = await req.json();

  // Si OPENAI_API_KEY dispo, appel réel
  if (process.env.OPENAI_API_KEY) {
    // TODO: appel OpenAI officiel
    // const completion = await openai.chat.completions.create(...)
  }

  // Mock pro pour démo sans clé
  const title = `${name} - Édition Premium 2024 | Livraison Rapide 24h | Garantie Qualité`;
  const description = `${name} est conçu pour offrir une expérience exceptionnelle.

✅ Qualité supérieure vérifiée
✅ Livraison rapide depuis fournisseur certifié
✅ Support client réactif 7j/7
✅ Garantie satisfaction 30 jours

Parfait pour un usage quotidien. Matériaux durables et design moderne.

${supplierInfo ? `Détails fournisseur: ${supplierInfo}` : ''}`;

  const bullets = [
    "Qualité premium vérifiée par notre équipe qualité",
    "Livraison rapide et suivie sous 24-48h",
    "Garantie satisfaction 30 jours, retour gratuit",
    "Support client 7j/7 par chat et email",
    "Stock disponible - Expédition immédiate depuis UE"
  ];

  const keywords = [name.toLowerCase(), "premium", "qualité supérieure", "livraison rapide", "tendance 2024", "garantie"].join(", ");

  return NextResponse.json({ title, description, bullets, keywords });
}
