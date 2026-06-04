"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // 1. Smooth Scroll Interceptor
    const handleScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      if (!href) return;

      let targetId = "";
      if (href.startsWith("/#") && href.length > 2) {
        targetId = href.substring(1);
      } else if (href.startsWith("#") && href.length > 1) {
        targetId = href;
      }

      if (targetId) {
        if (targetId === "#top") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        const element = document.querySelector(targetId);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handleScroll);

    // 2. Active Menu Items via IntersectionObserver
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('nav a');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            
            navLinks.forEach((link) => {
              link.classList.remove("text-indigo-600", "font-bold");
              link.classList.add("text-gray-600");
            });
            
            // Only toggle state automatically if the URL is mapped correctly
            const activeLink = document.querySelector(`nav a[href="/${id}"]`);
            if (activeLink) {
              activeLink.classList.remove("text-gray-600");
              activeLink.classList.add("text-indigo-600", "font-bold");
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px" // Trigger when element hits top 20%
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      document.removeEventListener("click", handleScroll);
      observer.disconnect();
    };
  }, []);

  return null;
}
