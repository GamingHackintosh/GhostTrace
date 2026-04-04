import type { Metadata } from "next"
import { AboutPageContent } from "@/components/about-page-content"

export const metadata: Metadata = {
  title: "About GhostTrace",
  description: "Learn what GhostTrace does and switch between English and Russian across the site.",
}

export default function AboutPage() {
  return <AboutPageContent />
}
