import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { listFeedbackEntries, listOverrides } from "@/lib/feedback-store"
import { AdminFeedbackActions } from "@/components/admin-feedback-actions"
import { AdminLogoutButton } from "@/components/admin-logout-button"

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const feedback = await listFeedbackEntries()
  const overrides = await listOverrides()
  const pendingFeedback = feedback.filter((entry) => entry.reviewState === "pending")
  const reviewedFeedback = feedback.filter((entry) => entry.reviewState !== "pending").slice(0, 20)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">GhostTrace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin moderation queue</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review feedback reports and apply manual overrides to improve platform accuracy.
            </p>
          </div>
          <AdminLogoutButton />
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
              <h2 className="text-xl font-medium">Pending reports</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {pendingFeedback.length} item(s) waiting for manual review
              </p>

              <div className="mt-6 space-y-4">
                {pendingFeedback.length === 0 ? (
                  <div className="rounded-2xl border border-border/50 bg-background/50 p-5 text-sm text-muted-foreground">
                    No pending reports right now.
                  </div>
                ) : (
                  pendingFeedback.map((entry) => (
                    <article key={entry.id} className="rounded-2xl border border-border/60 bg-background/50 p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-medium">
                            {entry.platform} / <span className="font-mono">{entry.username}</span>
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Current: {entry.currentStatus} | Suggested: {entry.suggestedStatus}
                          </p>
                        </div>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                          Pending
                        </span>
                      </div>

                      <div className="grid gap-3 text-sm text-muted-foreground">
                        <p><strong className="text-foreground">Submitted:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
                        <p><strong className="text-foreground">Note:</strong> {entry.note || "No note provided"}</p>
                        <p>
                          <strong className="text-foreground">Proof:</strong>{" "}
                          {entry.proofUrl ? (
                            <a href={entry.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {entry.proofUrl}
                            </a>
                          ) : (
                            "No proof URL"
                          )}
                        </p>
                      </div>

                      <AdminFeedbackActions feedbackId={entry.id} />
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
              <h2 className="text-xl font-medium">Recent decisions</h2>
              <div className="mt-4 space-y-3">
                {reviewedFeedback.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviewed feedback yet.</p>
                ) : (
                  reviewedFeedback.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-border/50 bg-background/50 p-4 text-sm">
                      <p className="font-medium">
                        {entry.platform} / <span className="font-mono">{entry.username}</span>
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {entry.reviewState} at {entry.reviewedAt ? new Date(entry.reviewedAt).toLocaleString() : "-"}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Notes: {entry.reviewNotes || "No notes"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-border/60 bg-card/60 p-6">
            <h2 className="text-xl font-medium">Active overrides</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manual decisions that take priority over automatic checks
            </p>

            <div className="mt-5 space-y-3">
              {overrides.length === 0 ? (
                <p className="text-sm text-muted-foreground">No overrides yet.</p>
              ) : (
                overrides.map((override) => (
                  <div key={override.id} className="rounded-2xl border border-border/50 bg-background/50 p-4 text-sm">
                    <p className="font-medium">
                      {override.platform} / <span className="font-mono">{override.username}</span>
                    </p>
                    <p className="mt-1 text-muted-foreground">Final status: {override.status}</p>
                    <p className="mt-1 text-muted-foreground">Updated: {new Date(override.updatedAt).toLocaleString()}</p>
                    <p className="mt-1 text-muted-foreground">Note: {override.note || "No note"}</p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
