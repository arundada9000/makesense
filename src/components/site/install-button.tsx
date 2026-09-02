"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const IS_IOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      setInstalled(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (installed) return null;

  if (IS_IOS) {
    return (
      <span className="inline-flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
        <Download className="h-3.5 w-3.5 shrink-0 text-accent" />
        Tap the Share button in Safari, then &ldquo;Add to Home Screen&rdquo; to
        install MakeSense.
      </span>
    );
  }

  if (!deferredPrompt) return null;

  return (
    <Button variant="secondary" size="sm" onClick={handleInstall} className="gap-1.5">
      <Download className="h-3.5 w-3.5" />
      Install app
    </Button>
  );
}