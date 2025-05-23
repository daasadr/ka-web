'use client';

import { useRouter } from 'next/navigation';
import NeonOrnamentalBackground from '@/components/NeonOrnamentalBackground';

export default function NutritionPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white relative">
      <NeonOrnamentalBackground
        colors={{
          primary: '#FF6B00', // Orange
          secondary: '#FFD93D', // Yellow
          tertiary: '#FF3D3D', // Red
        }}
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <button
          onClick={() => router.push('/')}
          className="mb-8 text-lg hover:text-gray-300 transition-colors"
        >
          ← Back to Home
        </button>
        <h1 className="text-4xl font-bold mb-8">Nutrition Consulting</h1>
        {/* Add your nutrition content here */}
      </div>
    </main>
  );
} 