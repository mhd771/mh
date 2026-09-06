import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const products = await prisma.product.findMany({ where: { userId: session.user.id } });
  const totalProfit = products.reduce((s, p) => s + p.profit, 0);
  const avgMargin = products.length ? products.reduce((s, p) => s + p.margin, 0) / products.length : 0;
  const profitable = products.filter(p => p.isProfitable).length;
  const alerts = await prisma.priceAlert.findMany({ where: { product: { userId: session.user.id } }, orderBy: { createdAt: 'desc' }, take: 5 });
  const ebayAccount = await prisma.ebayAccount.findUnique({ where: { userId: session.user.id } });

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8"><div><h1 className="text-2xl font-bold">Tableau de bord</h1><p className="text-sm text-white/50 mt-1">Bienvenue, {session.user?.name} • {new Date().toLocaleDateString('fr-FR')}</p></div><Link href="/dashboard/products" className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium">+ Nouveau produit</Link></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"><div className="text-xs text-white/40">Produits suivis</div><div className="text-2xl font-bold mt-2">{products.length}</div><div className="text-[11px] text-emerald-400 mt-1">↑ Actifs</div></div>
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"><div className="text-xs text-white/40">Annonces eBay</div><div className="text-2xl font-bold mt-2">{ebayAccount ? '12' : '0'}</div><div className="text-[11px] text-white/30 mt-1">{ebayAccount ? 'Connecté' : 'Non connecté'}</div></div>
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"><div className="text-xs text-white/40">Rentables</div><div className="text-2xl font-bold mt-2 text-emerald-400">{profitable}</div><div className="text-[11px] text-white/40 mt-1">{products.length ? Math.round(profitable/products.length*100) : 0}% du catalogue</div></div>
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"><div className="text-xs text-white/40">Alertes</div><div className="text-2xl font-bold mt-2 text-orange-400">{alerts.length}</div><div className="text-[11px] text-orange-300 mt-1">Marge faible</div></div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600"><div className="text-xs text-white/70">Profit total estimé</div><div className="text-3xl font-bold mt-2">{totalProfit.toFixed(2)} €</div><div className="text-xs text-white/60 mt-2">Marge moyenne {avgMargin.toFixed(1)}%</div></div>
        <div className="md:col-span-2 p-5 rounded-2xl bg-white/[0.03] border border-white/10"><div className="text-sm font-medium mb-4">Profit par produit</div><div className="flex items-end gap-2 h-24">{products.length === 0 ? <div className="text-xs text-white/30">Ajoute ton premier produit</div> : products.map(p => <div key={p.id} className="flex-1 flex flex-col items-center gap-2"><div className="w-full rounded-lg bg-violet-500" style={{ height: `${Math.max(10, (p.profit / Math.max(...products.map(x=>x.profit),1))*80)}%` }}></div><div className="text-[10px] text-white/40 truncate w-full text-center">{p.name.slice(0,8)}</div></div>)}</div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"><div className="flex justify-between mb-4"><div className="text-sm font-medium">Produits rentables</div><Link href="/dashboard/products" className="text-xs text-violet-400">Voir tout</Link></div>{products.filter(p=>p.isProfitable).slice(0,3).map(p => <div key={p.id} className="flex justify-between py-2 border-b border-white/5 last:border-0"><div className="text-sm">{p.name}</div><div className="text-sm text-emerald-400">{p.profit.toFixed(2)}€ • {p.margin.toFixed(1)}%</div></div>)} {products.filter(p=>p.isProfitable).length===0 && <div className="text-xs text-white/30">Aucun produit rentable pour l'instant</div>}</div>
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"><div className="text-sm font-medium mb-4">Alertes récentes</div>{alerts.map(a => <div key={a.id} className="flex gap-3 py-2"><div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5"></div><div className="text-xs"><div className="text-white/80">{a.message}</div><div className="text-white/30">{a.createdAt.toLocaleDateString()}</div></div></div>)} {alerts.length===0 && <div className="text-xs text-white/30">Aucune alerte • Tout va bien ✅</div>}</div>
      </div>
    </div>
  );
}
