import Link from "next/link"
import { Ghost, Shield } from "lucide-react"
import { AdminLoginForm } from "@/components/admin-login-form"

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-16">
        <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1fr_420px]">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary">
              <Shield className="h-3.5 w-3.5" />
              Admin Access
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Ghost className="h-9 w-9 text-primary" />
                <h1 className="text-4xl font-semibold tracking-tight">GhostTrace Admin</h1>
              </div>
              <p className="max-w-xl text-lg leading-7 text-muted-foreground">
                Review user reports, confirm profile status manually, and build a cleaner intelligence layer over time.
              </p>
              <p className="text-sm text-muted-foreground">
                Default local credentials are <code>admin</code> / <code>change-me</code> until you replace them with environment variables.
              </p>
            </div>

            <Link href="/" className="text-sm text-primary hover:underline">
              Back to homepage
            </Link>
          </section>

          <AdminLoginForm />
        </div>
      </div>
    </main>
  )
}
