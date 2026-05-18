"use client";

import { useState } from "react";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}

interface AdminUserTableProps {
  users: User[];
  currentUserId: string;
}

export function AdminUserTable({ users, currentUserId }: AdminUserTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  async function handleAction(userId: string, action: "disable" | "enable" | "delete") {
    if (action === "delete" && !confirm("Nutzer wirklich löschen? Diese Aktion ist nicht rückgängig zu machen.")) return;

    setLoading(userId + action);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/user-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatusMsg(`Fehler: ${json.error ?? "Unbekannter Fehler"}`);
      } else {
        setStatusMsg(`Aktion erfolgreich ausgeführt.`);
        // Reload to reflect changes
        window.location.reload();
      }
    } catch {
      setStatusMsg("Netzwerkfehler.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {statusMsg && (
        <div className="mb-4 rounded-lg border border-[var(--card-border)] bg-[var(--muted-bg)] px-4 py-2 text-sm">
          {statusMsg}
        </div>
      )}
      <div className="rounded-xl border border-[var(--card-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted-bg)]">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">E-Mail</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">Rolle</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">Erstellt</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]">
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} className="hover:bg-[var(--muted-bg)]">
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 text-[var(--muted)]">{u.full_name ?? "-"}</td>
                  <td className="px-4 py-2">
                    {u.is_admin ? (
                      <span className="text-xs font-medium text-[var(--primary)]">Admin</span>
                    ) : (
                      <span className="text-xs text-[var(--muted)]">Nutzer</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-[var(--muted)]">
                    {new Date(u.created_at).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-4 py-2">
                    {isSelf ? (
                      <span className="text-xs text-[var(--muted)]">–</span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(u.id, "disable")}
                          disabled={loading !== null}
                          className="text-xs text-[var(--warning)] hover:underline disabled:opacity-50"
                        >
                          {loading === u.id + "disable" ? "..." : "Sperren"}
                        </button>
                        <button
                          onClick={() => handleAction(u.id, "enable")}
                          disabled={loading !== null}
                          className="text-xs text-[var(--success)] hover:underline disabled:opacity-50"
                        >
                          {loading === u.id + "enable" ? "..." : "Entsperren"}
                        </button>
                        <button
                          onClick={() => handleAction(u.id, "delete")}
                          disabled={loading !== null}
                          className="text-xs text-[var(--danger)] hover:underline disabled:opacity-50"
                        >
                          {loading === u.id + "delete" ? "..." : "Löschen"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
