import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function EbayPage({ searchParams }: { searchParams: { connected?: string, error?: string } }) {
  const session = await auth();
  if (!session?.user?.id) return null;
  const account = await prisma.ebayAccount.findUnique({ where: { userId: session.user.id } });
  const isConnected = !!account;

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold">Intégration eBay</h1>
      <p className="text-sm text-white/50 mt-1">Connexion OAuth officielle, conforme ToS eBay</p>

      {searchParams.connected && <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300">✅ Compte eBay connecté avec succès ! Tokens chiffrés AES-256.</div>}
      {searchParams.error && <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">❌ Erreur: {searchParams.error}</div>}

      {!isConnected ? (
        <div className="mt-8">
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0064D2] mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4">e</div>
            <h2 className="text-xl font-bold">Connecte ton compte eBay vendeur</h2>
            <p className="text-sm text-white/50 mt-2 max-w-md mx-auto">Tu seras redirigé sur eBay.com officiel. Tu te connectes sur eBay, pas sur mhshop. Aucun mot de passe stocké.</p>
            <div className="mt-6 p-4 rounded-xl bg-white/[0.03] text-left text-xs text-white/60 max-w-md mx-auto">
              <div className="font-medium text-white/80 mb-2">Flux sécurisé :</div>
              1. Clic → redirection auth.ebay.com<br/>2. Login sur eBay.com<br/>3. Autorisation → retour avec code<br/>4. Échange code → tokens chiffrés
            </div>
            <Link href="/api/ebay/auth" className="inline-block mt-6 px-8 py-3 bg-[#0064D2] text-white rounded-full font-medium">Connecter eBay →</Link>
            <div className="mt-4 text-[11px] text-white/30">Mode: {process.env.EBAY_ENV || 'sandbox'} • Scopes: sell.inventory, sell.marketing</div>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-sm font-medium text-amber-300">Configuration requise</div>
            <div className="text-xs text-amber-200/60 mt-2">1. Va sur developer.ebay.com → Crée app<br/>2. Récupère CLIENT_ID, CLIENT_SECRET, RuName<br/>3. Mets-les dans .env + ENCRYPTION_KEY (openssl rand -hex 32)<br/>4. Redémarre le serveur</div>
            <Link href="/EBAY_SETUP.md" className="text-xs text-amber-300 underline mt-2 inline-block">Voir EBAY_SETUP.md</Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">✓</div><div><div className="font-medium">Compte eBay connecté</div><div className="text-xs text-white/50">Expire le {account.tokenExpiry.toLocaleString('fr-FR')}</div></div></div>
            <form action="/api/ebay/disconnect" method="POST"><button className="px-4 py-2 rounded-full bg-white/10 text-sm">Déconnecter</button></form>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex justify-between mb-4"><h3 className="font-medium">Tes annonces eBay (API officielle)</h3><Link href="/api/ebay/listings" className="text-xs text-violet-400">API /api/ebay/listings</Link></div>
            <div className="text-xs text-white/40">Les annonces seront chargées via sell/inventory/v1/inventory_item après connexion. En sandbox, crée des annonces test sur sandbox.ebay.com.</div>
            <div className="mt-4 grid gap-2">
              <div className="p-3 rounded-xl bg-white/[0.03] flex justify-between text-sm"><span>Exemple Annonce #1</span><span className="text-white/40">45.90€ • 10 en stock</span></div>
              <div className="p-3 rounded-xl bg-white/[0.03] flex justify-between text-sm"><span>Exemple Annonce #2</span><span className="text-white/40">29.90€ • 5 en stock</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
