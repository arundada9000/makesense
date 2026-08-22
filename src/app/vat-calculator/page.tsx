import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculators/calculator-shell";
import { VatCalculatorWidget } from "@/components/calculators/widgets/vat";

export const metadata: Metadata = {
  title: "VAT and GST Calculator",
  description:
    "Split tax-inclusive prices or add tax on top: net amount, tax portion and gross total for any VAT or GST rate.",
  alternates: { canonical: "/vat-calculator" },
};

export default function VatCalculatorPage() {
  return (
    <CalculatorShell
      title="VAT and GST calculator"
      intro="Two jobs in one tool: take a tax-inclusive price and split out the tax portion, or take a net price and add the tax on top. Works with any rate, including Nepal's 13 percent VAT."
      formula={
        <p>
          <strong>Inclusive:</strong> net = price divided by (1 + rate), so a
          Rs. 11,300 bill at 13 percent contains Rs. 1,300 of tax.{" "}
          <strong>Exclusive:</strong> tax = price times rate, added on top. The
          two directions answer different questions: what you owe to the
          authority versus what you must charge customers.
        </p>
      }
      example={
        <p>
          An invoice totals Rs. 11,300 including 13 percent VAT. The net sale is
          Rs. 10,000 and <strong>Rs. 1,300 is output tax</strong> you will
          declare. If instead you quote Rs. 10,000 excluding tax, the customer
          pays Rs. 11,300 and your books show the same split.
        </p>
      }
      mistakes={[
        "Booking the full inclusive amount as revenue; only the net part is yours.",
        "Mixing up output tax collected and input tax paid when filing.",
        "Applying the wrong rate across product categories that have exemptions.",
        "Forgetting that discounts usually apply before tax, not after.",
      ]}
      faq={[
        {
          q: "What is input tax credit?",
          a: "VAT you paid on business purchases can offset VAT you collected on sales. You remit only the difference, which is why clean records matter.",
        },
        {
          q: "Should my prices include VAT?",
          a: "Consumer-facing businesses often display inclusive prices; B2B usually quotes exclusive. Pick one convention and stay consistent.",
        },
        {
          q: "Is GST calculated the same way?",
          a: "Yes, the arithmetic is identical; only rates, registration thresholds and filing rules differ by country.",
        },
      ]}
      related={[
        { href: "/tax-calculator", label: "Tax calculator" },
        { href: "/pricing-calculator", label: "Pricing calculator" },
        { href: "/profit-calculator", label: "Profit calculator" },
      ]}
    >
      <VatCalculatorWidget />
    </CalculatorShell>
  );
}
