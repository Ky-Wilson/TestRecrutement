// app/page.tsx
import LoginForm from '@/components/LoginForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 to-black flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}