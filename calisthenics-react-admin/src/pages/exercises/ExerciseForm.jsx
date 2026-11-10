import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, getErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

const DEFAULT_FORM = {
  exerciseName: "",
  exerciseDescription: "",
  exerciseDifficulty: "",
  status: "Active",
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ExerciseForm({ mode = "add", existingExercise = null }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existingExercise) {
      setForm({
        exerciseName: existingExercise.exerciseName ?? "",
        exerciseDescription: existingExercise.exerciseDescription ?? "",
        exerciseDifficulty: existingExercise.exerciseDifficulty ?? "",
        status: existingExercise.status ?? "Active",
      });
      if (existingExercise.exerciseImage) {
        setImagePreview(`data:image/*;base64,${existingExercise.exerciseImage}`);
      }
    }
  }, [mode, existingExercise]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const isAdd = mode === "add";
      const payload = { ...form };
      if (!isAdd) payload.exerciseId = existingExercise?.exerciseId;
      if (imageFile) {
        payload.exerciseImage = await fileToBase64(imageFile);
      } else if (!isAdd && existingExercise?.exerciseImage) {
        payload.exerciseImage = existingExercise.exerciseImage;
      }

      if (isAdd) {
        await api.post("/exercises", payload);
      } else {
        await api.put(`/exercises/${existingExercise?.exerciseId}`, payload);
      }

      setSuccess(t("exercises.saveSuccess"));
      if (isAdd) {
        setForm(DEFAULT_FORM);
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (err) {
      setError(getErrorMessage(err, t("exercises.saveError")));
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
        onClick={() => navigate("/home/exercises")}
      >
        ← {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? t("exercises.editExercise") : t("exercises.addExercise")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exerciseName">{t("exercises.name")}</Label>
              <Input
                id="exerciseName"
                maxLength={100}
                value={form.exerciseName}
                onChange={(e) => handleChange("exerciseName", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exerciseDescription">
                {t("exercises.description")}
              </Label>
              <textarea
                id="exerciseDescription"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                value={form.exerciseDescription}
                onChange={(e) =>
                  handleChange("exerciseDescription", e.target.value)
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exerciseDifficulty">
                {t("exercises.difficulty")}
              </Label>
              <select
                id="exerciseDifficulty"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={form.exerciseDifficulty}
                onChange={(e) =>
                  handleChange("exerciseDifficulty", e.target.value)
                }
                required
              >
                <option value="">{t("exercises.selectDifficulty")}</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {t(`exercises.${d.toLowerCase()}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>{t("exercises.status")}</Label>
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
                    {t(`exercises.${s.toLowerCase()}`)}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exerciseImage">{t("exercises.image")}</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-14 rounded-md object-cover"
                  />
                )}
                <Input
                  id="exerciseImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isLoading}>
                {t("exercises.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/home/exercises")}
              >
                {t("exercises.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
