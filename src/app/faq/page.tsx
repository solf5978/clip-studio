import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "../../../public/texts/faq-data";
import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";

export default async function FaqPage() {
  const session = await auth();
  return (
    <main className="container py-12 md:py-20">
      <Navbar session={session} />
      <div className="mx-auto max-w-3xl">
        <h1 className="pt-8 pb-8 mb-8 text-center text-3xl font-bold md:text-4xl">
          Frequently Asked Questions
        </h1>
        <Accordion type="single" collapsible defaultValue="item-0">
          {faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
