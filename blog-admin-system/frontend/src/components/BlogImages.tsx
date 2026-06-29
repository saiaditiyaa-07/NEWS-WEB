"use client";

import Image from "next/image";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function BlogHeroImage({ src, alt }: BlogImageProps) {
  return (
    <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-10 shadow-xl bg-slate-100">
      <Image
        src={`${BACKEND_URL}${src}`}
        alt={alt}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 896px"
      />
    </div>
  );
}

export function RelatedBlogImage({ src, alt }: BlogImageProps) {
  return (
    <div className="relative h-32 rounded-lg overflow-hidden bg-slate-100 mb-3">
      <Image
        src={`${BACKEND_URL}${src}`}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="250px"
      />
    </div>
  );
}
