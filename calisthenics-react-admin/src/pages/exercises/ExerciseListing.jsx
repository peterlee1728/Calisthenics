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

export default function ExerciseListing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/exercises")
      .then((res) => setExercises(res.data))
      .catch(() => {});
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return exercises.filter(
      (e) =>
        e.exerciseName?.toLowerCase().includes(q) ||
        e.exerciseDifficulty?.toLowerCase().includes(q)
    );
  }, [exercises, search]);

  const toggleHide = async (exercise) => {
    setError("");
    const status = exercise.status === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/exercises/${exercise.exerciseId}`, {
        ...exercise,
        status,
      });
      load();
    } catch {
      setError(t("exercises.actionError"));
    }
  };

  const remove = async (exercise) => {
    if (!window.confirm(t("exercises.confirmRemove"))) return;
    setError("");
    try {
      await api.delete(`/exercises/${exercise.exerciseId}`);
      load();
    } catch {
      setError(t("exercises.actionError"));
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("exercises.title")}</CardTitle>
            <Button onClick={() => navigate("/home/exercises/add")}>
              {t("exercises.addExercise")}
            </Button>
          </div>
          <Input
            placeholder={t("exercises.searchPlaceholder")}
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
                  <th className="pb-2 pr-4">{t("exercises.name")}</th>
                  <th className="pb-2 pr-4">{t("exercises.description")}</th>
                  <th className="pb-2 pr-4">{t("exercises.difficulty")}</th>
                  <th className="pb-2 pr-4">{t("exercises.status")}</th>
                  <th className="pb-2">{t("exercises.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-muted-foreground"
                    >
                      {t("exercises.noResults")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.exerciseId} className="border-b">
                      <td className="py-2 pr-4">{e.exerciseName}</td>
                      <td className="py-2 pr-4 max-w-xs truncate">
                        {e.exerciseDescription}
                      </td>
                      <td className="py-2 pr-4">{e.exerciseDifficulty}</td>
                      <td className="py-2 pr-4">
                        {t(`exercises.${(e.status || "").toLowerCase()}`)}
                      </td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/home/exercises/${e.exerciseId}/edit`)
                            }
                          >
                            {t("exercises.edit")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleHide(e)}
                          >
                            {e.status === "Active"
                              ? t("exercises.hide")
                              : t("exercises.unhide")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(e)}
                          >
                            {t("exercises.remove")}
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
