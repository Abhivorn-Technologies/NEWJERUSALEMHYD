'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to the top of the page on pathname changes/redirects
    window.scrollTo(0, 0);

    const setupReveal = () => {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      }, observerOptions);

      const selectAndObserve = () => {
        const revealElements = document.querySelectorAll(
          '.reveal, .reveal-left, .reveal-right, .reveal-scale, .about-content > *'
        );
        revealElements.forEach((el) => {
          if (!el.classList.contains('is-visible')) {
            observer.observe(el);
          }
        });
      };

      selectAndObserve();

      const mutationObserver = new MutationObserver(() => {
        selectAndObserve();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
      };
    };

    const cleanup = setupReveal();
    return () => {
      cleanup();
    };
  }, [pathname]);

  return null;
}
