'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HARDCODED = {
  muser1: { pass: 'mpassword1', blocked: false },
  muser2: { pass: 'mpassword2', blocked: false },
  muser3: { pass: 'mpassword3', blocked: true },
};

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const user = HARDCODED[username as keyof typeof HARDCODED];

    if (user) {
      if (password === user.pass) {
        if (user.blocked) {
          setError("Ce compte a été bloqué.");
        } else {
          setSuccess("Connexion réussie...");
          localStorage.setItem('currentUser', username);
          setTimeout(() => router.push('/gallery'), 1200);
        }
      } else {
        setError("Informations de connexion invalides");
      }
    } else {
      setError("Informations de connexion invalides");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Connexion</h1>
          <p className="text-zinc-400 mt-2">Accédez à votre galerie d'images</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Nom d'utilisateur</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-zinc-500" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3.5 pl-11 text-white focus:border-blue-500 outline-none"
                placeholder="muser1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-zinc-500" size={20} />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3.5 pl-11 pr-12 text-white focus:border-blue-500 outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-white"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-4 rounded-2xl transition disabled:opacity-70"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 mt-8">
          Tests : <span className="text-emerald-400">muser1 / mpassword1</span> • 
          <span className="text-red-400">muser3 / mpassword3</span> (bloqué)
        </div>
      </div>
    </div>
  );
}