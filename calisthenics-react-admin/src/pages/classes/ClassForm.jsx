import { useState, useEffect, useMemo } from "react";
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

function generateTimeSlots() {
  const slots = [];
  for (let h = 7; h <= 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 24 && m > 0) break;
      const hour = h === 24 ? 0 : h;
      const label =
        h < 12
          ? `${h}:${m === 0 ? "00" : m} AM`
          : h === 12
            ? `12:${m === 0 ? "00" : m} PM`
            : h < 24
              ? `${h - 12}:${m === 0 ? "00" : m} PM`
              : `12:${m === 0 ? "00" : m} AM`;
      const value = `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({ label, value, totalMinutes: h * 60 + m });
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_FORM = {
  name: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  image: null,
  location: "",
  price: "",
};

export default function ClassForm({ mode = "add", existingClass = null }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existingClass) {
      setForm({ ...DEFAULT_FORM, ...existingClass, image: null });
      if (existingClass.imageUrl) {
        setImagePreview(existingClass.imageUrl);
      }
    }
  }, [mode, existingClass]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const dayOfWeek = useMemo(() => {
    if (!form.date) return "-";
    const d = new Date(form.date + "T00:00:00");
    return isNaN(d.getTime()) ? "-" : DAYS[d.getDay()];
  }, [form.date]);

  const nowMinutes = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);

  const isToday = useMemo(() => {
    if (!form.date) return false;
    const today = new Date().toISOString().split("T")[0];
    return form.date === today;
  }, [form.date]);

  const duration = useMemo(() => {
    if (!form.startTime || !form.endTime) return "-";
    const start = TIME_SLOTS.find((s) => s.value === form.startTime);
    const end = TIME_SLOTS.find((s) => s.value === form.endTime);
    if (!start || !end) return "-";

    let diff = end.totalMinutes - start.totalMinutes;
    if (diff <= 0) return "-";

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    if (hours > 0 && minutes > 0) {
      return t("classes.durationHoursMinutes", { hours, minutes });
    } else if (hours > 0) {
      return t("classes.durationHours", { hours });
    }
    return t("classes.durationMinutes", { minutes });
  }, [form.startTime, form.endTime, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const payload = {
        ...form,
        day: dayOfWeek,
        duration,
      };
      delete payload.image;

      if (mode === "add") {
        await api.post("/classes", payload);
      } else {
        await api.put(`/classes/${existingClass?.id}`, payload);
      }

      setSuccess(t("classes.saveSuccess"));
      if (mode === "add") {
        setForm(DEFAULT_FORM);
        setImagePreview(null);
      }
    } catch (err) {
      setError(getErrorMessage(err, t("classes.saveError")));
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
        onClick={() => navigate("/home/classes")}
      >
        ← {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? t("classes.editClass") : t("classes.addClass")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("classes.name")}</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">{t("classes.description")}</Label>
              <textarea
                id="description"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px]"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">{t("classes.date")}</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>{t("classes.day")}</Label>
                <div className="flex items-center h-10 px-3 rounded-md border bg-muted text-sm">
                  {dayOfWeek}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">{t("classes.startTime")}</Label>
                <select
                  id="startTime"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  required
                >
                  <option value="">{t("classes.selectTime")}</option>
                  {TIME_SLOTS.map((slot) => (
                    <option
                      key={`start-${slot.value}`}
                      value={slot.value}
                      disabled={isToday && slot.totalMinutes < nowMinutes}
                    >
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">{t("classes.endTime")}</Label>
                <select
                  id="endTime"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  required
                >
                  <option value="">{t("classes.selectTime")}</option>
                  {TIME_SLOTS.map((slot) => (
                    <option
                      key={`end-${slot.value}`}
                      value={slot.value}
                      disabled={isToday && slot.totalMinutes < nowMinutes}
                    >
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>{t("classes.duration")}</Label>
              <div className="flex items-center h-10 px-3 rounded-md border bg-muted text-sm">
                {duration}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">{t("classes.location")}</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">{t("classes.price")}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="classImage">{t("classes.image")}</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-14 rounded-md object-cover"
                  />
                )}
                <Input
                  id="classImage"
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
                {t("classes.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/home/classes")}
              >
                {t("classes.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
