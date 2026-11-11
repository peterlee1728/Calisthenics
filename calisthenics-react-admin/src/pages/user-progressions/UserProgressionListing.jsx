import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATUS_KEYS = {
  "In Progress": "inProgress",
  Paused: "paused",
  Completed: "completed",
};

export default function UserProgressionListing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [progressions, setProgressions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/user-progressions")
      .then((res) => setItems(res.data))
      .catch(() => {});
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => {});
    api
      .get("/progressions")
      .then((res) => setProgressions(res.data))
      .catch(() => {});
  }, []);

  const rows = useMemo(() => {
    const userMap = Object.fromEntries(
      users.map((u) => [
        u.userId ?? u.id,
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email,
      ])
    );
    const progressionMap = Object.fromEntries(
      progressions.map((p) => [p.progressionId, p.progressionName])
    );
    return items.map((i) => ({
      ...i,
      userName: userMap[i.userId] ?? i.userId,
      progressionName: progressionMap[i.progressionId] ?? i.progressionId,
    }));
  }, [items, users, progressions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        String(r.userName).toLowerCase().includes(q) ||
        String(r.progressionName).toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("userProgressions.title")}</CardTitle>
            <Button onClick={() => navigate("/home/user-progressions/add")}>
              {t("userProgressions.addUserProgression")}
            </Button>
          </div>
          <Input
            placeholder={t("userProgressions.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 max-w-sm"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4">{t("userProgressions.user")}</th>
                  <th className="pb-2 pr-4">{t("userProgressions.progression")}</th>
                  <th className="pb-2 pr-4">{t("userProgressions.currentLevel")}</th>
                  <th className="pb-2 pr-4">{t("userProgressions.startedDate")}</th>
                  <th className="pb-2 pr-4">{t("userProgressions.completedDate")}</th>
                  <th className="pb-2 pr-4">{t("userProgressions.status")}</th>
                  <th className="pb-2">{t("userProgressions.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-4 text-center text-muted-foreground"
                    >
                      {t("userProgressions.noResults")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.userProgressionId} className="border-b">
                      <td className="py-2 pr-4">{r.userName}</td>
                      <td className="py-2 pr-4">{r.progressionName}</td>
                      <td className="py-2 pr-4">{r.currentLevel}</td>
                      <td className="py-2 pr-4">{r.startedDate}</td>
                      <td className="py-2 pr-4">{r.completedDate || "-"}</td>
                      <td className="py-2 pr-4">
                        {STATUS_KEYS[r.status]
                          ? t(`userProgressions.${STATUS_KEYS[r.status]}`)
                          : r.status}
                      </td>
                      <td className="py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/home/user-progressions/${r.userProgressionId}/edit`
                            )
                          }
                        >
                          {t("userProgressions.edit")}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
