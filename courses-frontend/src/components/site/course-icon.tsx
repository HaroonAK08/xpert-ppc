import Image from 'next/image';
import { Search, Users, Code2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const BRAND_LOGOS: Record<string, { src: string; alt: string }> = {
  google: { src: '/images/logos/google-ads.png', alt: 'Google Ads' },
  meta: { src: '/images/logos/meta-ads.png', alt: 'Meta Ads' },
  tiktok: { src: '/images/logos/tiktok-ads.png', alt: 'TikTok Ads' },
};

export function isBrandLogo(name: string) {
  const key = (name || '').toLowerCase();
  return key.includes('google') || key.includes('meta') || key.includes('tiktok');
}

export function CourseIcon({ name, className = 'h-7 w-7' }: { name: string; className?: string }) {
  const key = (name || '').toLowerCase();

  if (key.includes('google')) {
    return <BrandLogo logo={BRAND_LOGOS.google} className={className} />;
  }
  if (key.includes('meta')) {
    return <BrandLogo logo={BRAND_LOGOS.meta} className={className} />;
  }
  if (key.includes('tiktok')) {
    return <BrandLogo logo={BRAND_LOGOS.tiktok} className={className} />;
  }
  if (key.includes('web') || key.includes('code')) {
    return <Code2 className={cn(className, 'text-[#1a6ef0]')} strokeWidth={1.75} />;
  }
  if (key.includes('seo') || key.includes('search')) {
    return <Search className={cn(className, 'text-[#1a6ef0]')} strokeWidth={1.75} />;
  }
  if (key.includes('client') || key.includes('users')) {
    return <Users className={cn(className, 'text-[#1a6ef0]')} strokeWidth={1.75} />;
  }

  return <BrandLogo logo={BRAND_LOGOS.google} className={className} />;
}

function BrandLogo({ logo, className }: { logo: { src: string; alt: string }; className?: string }) {
  return (
    <span className={cn('relative inline-block', className)}>
      <Image
        src={logo.src}
        alt={logo.alt}
        fill
        unoptimized
        className="object-contain"
        sizes="72px"
      />
    </span>
  );
}
