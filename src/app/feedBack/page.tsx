import { supabase } from "@/lib/DbConnection";
import Link from "next/link";

interface FeedbackRow {
  id: number;
  created_at: string;
  country: string | null;
  commit: string | null;
}

export const revalidate = 0;

export default async function FeedbackPage() {
  const { data, error } = await supabase
    .from("feedBack")
    .select("*")
    .order("created_at", { ascending: false });

  const feedbacks: FeedbackRow[] = data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Feedback</h1>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Search
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-sm">Failed to load feedback.</p>
        )}

        {feedbacks.length === 0 && !error && (
          <p className="text-gray-500 text-sm">No feedback submitted yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-600">
                  {fb.country ?? "Unknown"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(fb.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{fb.commit ?? "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
