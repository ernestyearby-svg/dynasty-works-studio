import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath: string; // e.g. '/growth', '/growth/apply'
}

const PRODUCTION_ORIGIN = 'https://dynastyworksstudio.com';

export function useGrowthSeo({ title, description, canonicalPath }: SeoProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Set or Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Strict Canonical URL Lock (Never localhost, github or preview)
    const canonicalUrl = `${PRODUCTION_ORIGIN}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Tags
    const setOgTag = (property: string, content: string) => {
      let og = document.querySelector(`meta[property="${property}"]`);
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', property);
        document.head.appendChild(og);
      }
      og.setAttribute('content', content);
    };

    setOgTag('og:title', title);
    setOgTag('og:description', description);
    setOgTag('og:url', canonicalUrl);
    setOgTag('og:type', 'website');
  }, [title, description, canonicalPath]);
}
