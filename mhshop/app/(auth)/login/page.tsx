'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@mhshop.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) router.push('/dashboard');
    else alert('Identifiants invalides - Utilise demo@mhshop.com / demo123 ou crée un compte');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8"><div className="w-12 h-12 bg-violet-600 rounded-xl mx-auto flex items-center justify-center font-bold text-white text-xl mb-3">m</div><h1 className="text-2xl font-bold text-white">Connexion mhshop</h1><p className="text-sm text-white/50 mt-2">Accède à ton dashboard</p></div>
        <form onSubmit={handleLogin} className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div><label className="text-xs text-white/60">Email</label><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500" /></div>
          <div><label className="text-xs text-white/60">Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500" /></div>
          <button disabled={loading} className="w-full py-2.5 bg-white text-black rounded-xl font-medium text-sm disabled:opacity-50">{loading ? 'Connexion...' : 'Se connecter'}</button>
          <div className="text-center text-xs text-white/40">Pas de compte ? <Link href="/register" className="text-violet-400">S'inscrire</Link></div>
          <div className="pt-3 border-t border-white/10 text-[11px] text-white/30">Démo: demo@mhshop.com / demo123<br/>En prod, utilise ton compte créé via inscription sécurisée (bcrypt)</div>
        </form>
      </div>
    </div>
  );
}
