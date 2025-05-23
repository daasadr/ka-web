'use client';

import { useRouter } from 'next/navigation';
import NeonOrnamentalBackground from '@/components/NeonOrnamentalBackground';

export default function CosmeticPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white relative">
      <NeonOrnamentalBackground
        colors={{
          primary: '#00eaff', // Neon turquoise
          secondary: '#20b2aa', // Light sea green
          tertiary: '#48d1cc', // Medium turquoise
        }}
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <button
          onClick={() => router.push('/')}
          className="mb-8 text-lg hover:text-gray-300 transition-colors"
        >
          ← Back to Home
        </button>
        <h1 className="text-4xl font-bold mb-8">Cosmetic Consulting</h1>
        {/* Add your cosmetic content here */}
      </div>
    </main>
  );
} 