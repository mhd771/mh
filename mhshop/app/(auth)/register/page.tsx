'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) router.push('/login');
    else { const data = await res.json(); alert(data.error || 'Erreur'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8"><div className="w-12 h-12 bg-violet-600 rounded-xl mx-auto flex items-center justify-center font-bold text-white text-xl mb-3">m</div><h1 className="text-2xl font-bold text-white">Créer ton compte</h1><p className="text-sm text-white/50 mt-2">Gratuit, sécurisé, 30s</p></div>
        <form onSubmit={handleRegister} className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div><label className="text-xs text-white/60">Nom</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Ahmed" className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm" /></div>
          <div><label className="text-xs text-white/60">Email</label><input required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="ahmed@email.com" className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm" /></div>
          <div><label className="text-xs text-white/60">Mot de passe (min 6)</label><input required type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm" /></div>
          <button disabled={loading} className="w-full py-2.5 bg-white text-black rounded-xl font-medium text-sm">{loading ? 'Création...' : 'Créer mon compte'}</button>
          <div className="text-center text-xs text-white/40">Déjà un compte ? <Link href="/login" className="text-violet-400">Se connecter</Link></div>
        </form>
      </div>
    </div>
  );
}
