import type { Metadata } from "next";
import { DocPage, DocSection } from "@/components/site/doc-page";

export const metadata: Metadata = {
  title: "Terms of Use and Disclaimer",
  description:
    "Terms governing use of the MakeSense business model simulator, including the financial information disclaimer and limitation of liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <DocPage
      title="Terms of use and disclaimer"
      intro="Plain-language terms for using MakeSense. By using the app you accept them."
    >
      <DocSection id="what-it-is" title="What MakeSense is">
        <p>
          A financial modeling and business-planning simulator. It turns the
          assumptions you enter into projections: revenue, costs, profit, cash,
          tax estimates, financing schedules and scenario comparisons. It is a
          calculator with transparent formulas, not an advisor.
        </p>
      </DocSection>

      <DocSection id="not-advice" title="Not financial, tax, or legal advice">
        <p>
          <strong>
            Every output is a mathematical consequence of your assumptions: it
            is not a prediction, forecast, or recommendation.
          </strong>{" "}
          Tax rules, exchange rates, market conditions and individual
          circumstances vary by jurisdiction and change over time. Always
          validate figures with a qualified accountant, tax practitioner or
          lawyer before making financial commitments or filings.
        </p>
      </DocSection>

      <DocSection id="your-data" title="Your data and responsibility">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Models are stored locally in your browser. You are responsible for keeping backups via export.</li>
          <li>Clearing browser data, uninstalling a browser, or device loss deletes models permanently.</li>
          <li>You are responsible for the accuracy of what you enter.</li>
        </ul>
      </DocSection>

      <DocSection id="liability" title="No warranty; limitation of liability">
        <p>
          The app is provided &ldquo;as is&rdquo; without warranties of any
          kind. To the maximum extent permitted by law, the developer is not
          liable for any loss arising from use of the app or reliance on its
          outputs, including business decisions, tax assessments or missed
          opportunities.
        </p>
      </DocSection>

      <DocSection id="acceptable-use" title="Acceptable use">
        <p>
          Use the app for lawful purposes only. Do not attempt to disrupt the
          service for others or misrepresent the app as your own product. The
          software itself is proprietary; see the license in the repository.
        </p>
      </DocSection>

      <DocSection id="changes" title="Changes">
        <p>
          These terms may be updated as the product evolves. Material changes
          will be reflected on this page with a new date. Continued use after
          changes means acceptance.
        </p>
      </DocSection>

      <DocSection id="contact" title="Contact">
        <p>
          Developer:{" "}
          <a href="https://arunneupane.vercel.app" target="_blank" rel="noopener noreferrer">
            Arun Neupane
          </a>
          , Butwal, Nepal.
        </p>
      </DocSection>
    </DocPage>
  );
}
