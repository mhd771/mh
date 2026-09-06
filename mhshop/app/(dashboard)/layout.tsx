import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) { return <div className="p-8 text-white">Non connecté - <Link href="/login" className="underline">Login</Link></div>; }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      <aside className="w-[280px] border-r border-white/10 p-5 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-8"><div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold">m</div><span className="font-bold">mhshop</span><span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-violet-500/20 text-violet-300">BETA</span></div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white text-black text-sm font-medium">📊 Dashboard</Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:bg-white/5 text-sm">📦 Produits</Link>
          <Link href="/dashboard/calculator" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:bg-white/5 text-sm">🧮 Calculateur</Link>
          <Link href="/dashboard/ai" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:bg-white/5 text-sm">✨ Générateur IA <span className="ml-auto text-[9px] bg-violet-500 text-white px-1.5 py-0.5 rounded">NEW</span></Link>
          <Link href="/dashboard/monitor" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:bg-white/5 text-sm">📈 Surveillance</Link>
          <Link href="/dashboard/ebay" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:bg-white/5 text-sm">🛒 eBay</Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]"><div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm">{session.user?.name?.[0] || 'A'}</div><div className="text-sm"><div className="font-medium">{session.user?.name || 'Utilisateur'}</div><div className="text-[11px] text-white/40 truncate">{session.user?.email}</div></div></div>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}><button className="mt-3 w-full py-2 text-xs text-white/40 hover:text-white">Déconnexion</button></form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
