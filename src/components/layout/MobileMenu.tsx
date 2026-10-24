"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { appointmentCta, primaryNav } from "@/config/navigation";
import { contactChannels } from "@/config/business";
import { publishedServices } from "@/content/services";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/components/motion/SmoothScroll";

interface Props {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}

/**
 * Full-screen menu built on <dialog>: the browser provides focus containment, Escape to close and an
 * inert page behind it.
 */
export function MobileMenu({ open, onClose, isActive }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const lenis = useLenis();
  const channels = contactChannels();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        gsap.fromTo(dialog, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power4.inOut" });
        gsap.fromTo(
          dialog.querySelectorAll("[data-menu-item]"),
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, delay: 0.2, ease: "power3.out" },
        );
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, lenis]);

  // Restore scrolling whenever the dialog closes (Escape, link, or button).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [lenis, onClose]);

  // Close after navigating.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      aria-label="Site menu"
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-y-auto bg-asphalt p-0 text-titanium backdrop:bg-asphalt/80 xl:hidden"
    >
      <div className="shell flex min-h-full flex-col pb-10">
        <div className="flex h-[var(--header-h)] items-center justify-between">
          <span className="t-note">Menu</span>
          <button type="button" onClick={() => dialogRef.current?.close()} className="inline-flex h-11 items-center gap-3 text-[0.9375rem] font-[600]">
            Close
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile primary" className="mt-6">
          <ul className="border-t border-gunmetal">
            {primaryNav.map((item) => (
              <li key={item.href} data-menu-item className="border-b border-gunmetal">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline justify-between py-4 text-[clamp(2rem,9vw,3.25rem)] leading-none font-[760] uppercase aria-[current=page]:text-signal-text"
                  style={{ fontStretch: "106%" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div data-menu-item className="mt-8">
          <p className="t-note mb-3">Services</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[0.9375rem] text-alloy">
            {publishedServices().map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-titanium">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-menu-item className="mt-auto flex flex-col gap-3 pt-10">
          <Link href={appointmentCta.href} className="btn btn-primary w-full">
            {appointmentCta.label}
          </Link>
          {channels.map((c) => (
            <a key={c.kind} href={c.href} className="btn btn-ghost w-full" {...(c.kind === "directions" || c.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </dialog>
  );
}
