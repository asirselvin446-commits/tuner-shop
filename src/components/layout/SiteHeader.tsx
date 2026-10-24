"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { appointmentCta, primaryNav } from "@/config/navigation";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";

/** Pixels of travel in one direction before the header hides or reappears. */
const SCROLL_THRESHOLD = 16;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        // Hide after scrolling down past the fold; reveal after scrolling back up. Direction is measured
        // from the point of the last change (not frame to frame), so the small per-frame steps at the end
        // of each smooth-scroll ease can't flip the header back and forth.
        if (y <= 480) {
          setHidden(false);
          lastY.current = y;
        } else if (y - lastY.current > SCROLL_THRESHOLD) {
          setHidden(true);
          lastY.current = y;
        } else if (lastY.current - y > SCROLL_THRESHOLD) {
          setHidden(false);
          lastY.current = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]",
          "border-b",
          scrolled ? "border-gunmetal/70 bg-asphalt" : "border-transparent bg-transparent",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Wordmark />

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="relative py-2 text-[0.9375rem] font-[520] text-alloy transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-titanium after:transition-transform after:duration-500 after:ease-[var(--ease-shutter)] hover:text-titanium hover:after:origin-left hover:after:scale-x-100 aria-[current=page]:text-titanium aria-[current=page]:after:hidden"
                    style={{ fontStretch: "104%" }}
                  >
                    {item.label}
                    {isActive(item.href) && <span aria-hidden="true" className="absolute inset-x-0 -bottom-0.5 h-px bg-signal" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link href={appointmentCta.href} className="btn btn-primary hidden min-h-[44px] px-5 text-[0.875rem] sm:inline-flex">
              {appointmentCta.label}
            </Link>
            <button
              type="button"
              className="menu-btn inline-flex h-11 items-center gap-3 px-1 text-[0.9375rem] font-[600] xl:hidden"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              Menu
              <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
                <span className="h-[2px] w-full bg-titanium" />
                <span className="h-[2px] w-2/3 self-end bg-signal" />
              </span>
            </button>
            <noscript>
              <a href="#footer-nav" className="inline-flex h-11 items-center text-[0.9375rem] font-[600] xl:hidden">
                Menu
              </a>
            </noscript>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} isActive={isActive} />
    </>
  );
}
