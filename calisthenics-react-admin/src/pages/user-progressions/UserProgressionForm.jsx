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

const STATUSES = [
  { value: "In Progress", key: "inProgress" },
  { value: "Paused", key: "paused" },
  { value: "Completed", key: "completed" },
];

const today = () => new Date().toISOString().split("T")[0];

const buildDefaultForm = () => ({
  userId: "",
  progressionId: "",
  currentLevel: 1,
  startedDate: today(),
  completedDate: "",
  status: "In Progress",
});

export default function UserProgressionForm({
  mode = "add",
  existingItem = null,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(buildDefaultForm);
  const [users, setUsers] = useState([]);
  const [progressions, setProgressions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => {});
    api
      .get("/progressions")
      .then((res) => setProgressions(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && existingItem) {
      setForm({
        userId: String(existingItem.userId ?? ""),
        progressionId: String(existingItem.progressionId ?? ""),
        currentLevel: existingItem.currentLevel ?? 1,
        startedDate: existingItem.startedDate ?? today(),
        completedDate: existingItem.completedDate ?? "",
        status: existingItem.status ?? "In Progress",
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
        userId: Number(form.userId),
        progressionId: Number(form.progressionId),
        currentLevel: Number(form.currentLevel),
        startedDate: form.startedDate,
        completedDate: form.completedDate || null,
        status: form.status,
      };
      if (!isAdd) payload.userProgressionId = existingItem?.userProgressionId;

      if (isAdd) {
        await api.post("/user-progressions", payload);
      } else {
        await api.put(
          `/user-progressions/${existingItem?.userProgressionId}`,
          payload
        );
      }

      setSuccess(t("userProgressions.saveSuccess"));
      if (isAdd) setForm(buildDefaultForm());
    } catch (err) {
      setError(getErrorMessage(err, t("userProgressions.saveError")));
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
        onClick={() => navigate("/home/user-progressions")}
      >
        ← {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit
              ? t("userProgressions.editUserProgression")
              : t("userProgressions.addUserProgression")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="userId">{t("userProgressions.user")}</Label>
              <NativeSelect
                id="userId"
                value={form.userId}
                onChange={(e) => handleChange("userId", e.target.value)}
                required
              >
                <option value="">{t("userProgressions.selectUser")}</option>
                {users.map((u) => {
                  const id = u.userId ?? u.id;
                  return (
                    <option key={id} value={id}>
                      {u.firstName} {u.lastName} ({u.email})
                    </option>
                  );
                })}
              </NativeSelect>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progressionId">
                {t("userProgressions.progression")}
              </Label>
              <NativeSelect
                id="progressionId"
                value={form.progressionId}
                onChange={(e) => handleChange("progressionId", e.target.value)}
                required
              >
                <option value="">
                  {t("userProgressions.selectProgression")}
                </option>
                {progressions.map((p) => (
                  <option key={p.progressionId} value={p.progressionId}>
                    {p.progressionName}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currentLevel">
                {t("userProgressions.currentLevel")}
              </Label>
              <Input
                id="currentLevel"
                type="number"
                min="1"
                step="1"
                value={form.currentLevel}
                onChange={(e) => handleChange("currentLevel", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startedDate">
                  {t("userProgressions.startedDate")}
                </Label>
                <Input
                  id="startedDate"
                  type="date"
                  value={form.startedDate}
                  onChange={(e) => handleChange("startedDate", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="completedDate">
                  {t("userProgressions.completedDate")}
                </Label>
                <Input
                  id="completedDate"
                  type="date"
                  min={form.startedDate}
                  value={form.completedDate}
                  onChange={(e) =>
                    handleChange("completedDate", e.target.value)
                  }
                  required={form.status === "Completed"}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">{t("userProgressions.status")}</Label>
              <NativeSelect
                id="status"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t(`userProgressions.${s.key}`)}
                  </option>
                ))}
              </NativeSelect>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isLoading}>
                {t("userProgressions.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/home/user-progressions")}
              >
                {t("userProgressions.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
