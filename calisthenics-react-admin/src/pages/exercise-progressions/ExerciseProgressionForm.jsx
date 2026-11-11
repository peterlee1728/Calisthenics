import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, getErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DEFAULT_FORM = {
  exerciseId: "",
  progressionId: "",
  sequenceOrder: "",
  status: "Active",
};

export default function ExerciseProgressionForm({
  mode = "add",
  existingItem = null,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [exercises, setExercises] = useState([]);
  const [progressions, setProgressions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .get("/exercises")
      .then((res) => setExercises(res.data))
      .catch(() => {});
    api
      .get("/progressions")
      .then((res) => setProgressions(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && existingItem) {
      setForm({
        exerciseId: String(existingItem.exerciseId ?? ""),
        progressionId: String(existingItem.progressionId ?? ""),
        sequenceOrder: existingItem.sequenceOrder ?? "",
        status: existingItem.status ?? "Active",
      });
    }
  }, [mode, existingItem]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const isAdd = mode === "add";
      const payload = {
        exerciseId: Number(form.exerciseId),
        progressionId: Number(form.progressionId),
        sequenceOrder: Number(form.sequenceOrder),
        status: form.status,
      };
      if (!isAdd) payload.exerciseProgressionId = existingItem?.exerciseProgressionId;

      if (isAdd) {
        await api.post("/exercise-progressions", payload);
      } else {
        await api.put(
          `/exercise-progressions/${existingItem?.exerciseProgressionId}`,
          payload
        );
      }

      setSuccess(t("exerciseProgressions.saveSuccess"));
      if (isAdd) setForm(DEFAULT_FORM);
    } catch (err) {
      setError(getErrorMessage(err, t("exerciseProgressions.saveError")));
    } finally {
      setIsLoading(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate("/home/exercise-progressions")}
      >
        ← {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit
              ? t("exerciseProgressions.editExerciseProgression")
              : t("exerciseProgressions.addExerciseProgression")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exerciseId">
                {t("exerciseProgressions.exercise")}
              </Label>
              <NativeSelect
                id="exerciseId"
                value={form.exerciseId}
                onChange={(e) => handleChange("exerciseId", e.target.value)}
                required
              >
                <option value="">
                  {t("exerciseProgressions.selectExercise")}
                </option>
                {exercises.map((ex) => (
                  <option key={ex.exerciseId} value={ex.exerciseId}>
                    {ex.exerciseName}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progressionId">
                {t("exerciseProgressions.progression")}
              </Label>
              <NativeSelect
                id="progressionId"
                value={form.progressionId}
                onChange={(e) => handleChange("progressionId", e.target.value)}
                required
              >
                <option value="">
                  {t("exerciseProgressions.selectProgression")}
                </option>
                {progressions.map((p) => (
                  <option key={p.progressionId} value={p.progressionId}>
                    {p.progressionName}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sequenceOrder">
                {t("exerciseProgressions.sequenceOrder")}
              </Label>
              <Input
                id="sequenceOrder"
                type="number"
                min="1"
                step="1"
                value={form.sequenceOrder}
                onChange={(e) => handleChange("sequenceOrder", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("exerciseProgressions.status")}</Label>
              <div className="flex gap-4">
                {["Active", "Inactive"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={form.status === s}
                      onChange={() => handleChange("status", s)}
                    />
                    {t(`exerciseProgressions.${s.toLowerCase()}`)}
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isLoading}>
                {t("exerciseProgressions.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/home/exercise-progressions")}
              >
                {t("exerciseProgressions.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
