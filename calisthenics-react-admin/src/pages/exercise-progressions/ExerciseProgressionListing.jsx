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

export default function ExerciseProgressionListing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [progressions, setProgressions] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/exercise-progressions")
      .then((res) => setItems(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    load();
    api
      .get("/exercises")
      .then((res) => setExercises(res.data))
      .catch(() => {});
    api
      .get("/progressions")
      .then((res) => setProgressions(res.data))
      .catch(() => {});
  }, []);

  const rows = useMemo(() => {
    const exMap = Object.fromEntries(
      exercises.map((e) => [e.exerciseId, e.exerciseName])
    );
    const prMap = Object.fromEntries(
      progressions.map((p) => [p.progressionId, p.progressionName])
    );
    return items.map((i) => ({
      ...i,
      exerciseName: exMap[i.exerciseId] ?? i.exerciseId,
      progressionName: prMap[i.progressionId] ?? i.progressionId,
    }));
  }, [items, exercises, progressions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        String(r.exerciseName).toLowerCase().includes(q) ||
        String(r.progressionName).toLowerCase().includes(q)
    );
  }, [rows, search]);

  const toggleHide = async (item) => {
    setError("");
    const status = item.status === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/exercise-progressions/${item.exerciseProgressionId}`, {
        exerciseProgressionId: item.exerciseProgressionId,
        exerciseId: item.exerciseId,
        progressionId: item.progressionId,
        sequenceOrder: item.sequenceOrder,
        status,
      });
      load();
    } catch {
      setError(t("exerciseProgressions.actionError"));
    }
  };

  const remove = async (item) => {
    if (!window.confirm(t("exerciseProgressions.confirmRemove"))) return;
    setError("");
    try {
      await api.delete(`/exercise-progressions/${item.exerciseProgressionId}`);
      load();
    } catch {
      setError(t("exerciseProgressions.actionError"));
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("exerciseProgressions.title")}</CardTitle>
            <Button onClick={() => navigate("/home/exercise-progressions/add")}>
              {t("exerciseProgressions.addExerciseProgression")}
            </Button>
          </div>
          <Input
            placeholder={t("exerciseProgressions.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 max-w-sm"
          />
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4">{t("exerciseProgressions.exercise")}</th>
                  <th className="pb-2 pr-4">{t("exerciseProgressions.progression")}</th>
                  <th className="pb-2 pr-4">{t("exerciseProgressions.sequenceOrder")}</th>
                  <th className="pb-2 pr-4">{t("exerciseProgressions.status")}</th>
                  <th className="pb-2">{t("exerciseProgressions.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-muted-foreground"
                    >
                      {t("exerciseProgressions.noResults")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.exerciseProgressionId} className="border-b">
                      <td className="py-2 pr-4">{r.exerciseName}</td>
                      <td className="py-2 pr-4">{r.progressionName}</td>
                      <td className="py-2 pr-4">{r.sequenceOrder}</td>
                      <td className="py-2 pr-4">
                        {t(`exerciseProgressions.${(r.status || "").toLowerCase()}`)}
                      </td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/home/exercise-progressions/${r.exerciseProgressionId}/edit`
                              )
                            }
                          >
                            {t("exerciseProgressions.edit")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleHide(r)}
                          >
                            {r.status === "Active"
                              ? t("exerciseProgressions.hide")
                              : t("exerciseProgressions.unhide")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(r)}
                          >
                            {t("exerciseProgressions.remove")}
                          </Button>
                        </div>
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
