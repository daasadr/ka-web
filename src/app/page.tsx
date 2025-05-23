'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Cosmetic Section */}
      <div 
        className="relative w-1/2 h-full cursor-pointer group transition-all duration-300 hover:opacity-90"
        onClick={() => router.push('/cosmetic')}
      >
        <Image
          src="/cosmetic.jpg"
          alt="Cosmetic Consulting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white tracking-wider transform group-hover:scale-105 transition-transform duration-300">
            COSMETIC
          </h1>
        </div>
      </div>

      {/* Nutrition Section */}
      <div 
        className="relative w-1/2 h-full cursor-pointer group transition-all duration-300 hover:opacity-90"
        onClick={() => router.push('/nutrition')}
      >
        <Image
          src="/nutrition.jpg"
          alt="Nutrition Consulting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white tracking-wider transform group-hover:scale-105 transition-transform duration-300">
            NUTRITION
          </h1>
        </div>
      </div>
    </main>
  );
}
