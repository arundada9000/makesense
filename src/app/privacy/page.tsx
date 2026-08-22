import type { Metadata } from "next";
import { DocPage, DocSection } from "@/components/site/doc-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "MakeSense is local-first: your business models are stored in your browser and never leave your device. No accounts, no uploads, no analytics on your numbers.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <DocPage
      title="Privacy policy"
      intro="MakeSense is built to work without knowing anything about you. This page explains exactly what the app stores, what it sends, and what it never does."
    >
      <DocSection id="summary" title="The short version">
        <p>
          Your business models live only inside your browser, in an IndexedDB
          database on your device. Nothing you type into MakeSense is ever sent
          to a server, because there is no server to send it to. The app works
          fully offline once loaded.
        </p>
      </DocSection>

      <DocSection id="stored" title="What is stored on your device">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Business models you create: names, assumptions, scenarios, notes.</li>
          <li>Your preferences: theme, density, font scale, currency defaults.</li>
          <li>Nothing else. No cookies for tracking, no identifiers, no fingerprints.</li>
        </ul>
        <p>
          Clearing your browser data for this site, or using{" "}
          <strong>Delete all data</strong> in Settings, removes everything
          permanently. There is no cloud copy to fall back on: export a backup
          file regularly if your models matter.
        </p>
      </DocSection>

      <DocSection id="network" title="What leaves your device">
        <p>
          Loading the app downloads static files (HTML, CSS, JavaScript,
          fonts). After that, the app makes network requests only when:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>You open a currency conversion view, where indicative reference rates are fetched or bundled with their date and source shown alongside.</li>
          <li>The service worker checks for app updates in the background.</li>
        </ul>
        <p>
          Your model data is excluded from every request. There is no telemetry,
          no error reporting service, and no analytics scripts.
        </p>
      </DocSection>

      <DocSection id="third-parties" title="Third parties">
        <p>
          The app is hosted as a static web application. The hosting provider
          can see standard, anonymous request logs (IP address, user agent,
          requested URL) common to every website visit. MakeSense itself adds no
          third-party tracking, advertising, or profiling scripts of any kind.
        </p>
      </DocSection>

      <DocSection id="rights" title="Your control">
        <p>
          Because all data is yours on your device, you already hold full
          control: export models as JSON at any time from Settings or any report
          page, re-import them elsewhere, or delete them permanently. No
          requests, waiting periods, or account deletion forms are involved.
        </p>
      </DocSection>

      <DocSection id="contact" title="Contact">
        <p>
          Questions about this policy? Reach the developer at{" "}
          <a href="https://arunneupane.vercel.app" target="_blank" rel="noopener noreferrer">
            arunneupane.vercel.app
          </a>
          .
        </p>
      </DocSection>
    </DocPage>
  );
}
