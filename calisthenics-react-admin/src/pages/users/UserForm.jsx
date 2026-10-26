import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DEFAULT_FORM = {
  firstName: "",
  lastName: "",
  gender: "Male",
  age: "",
  email: "",
  mobile: "",
  emergencyName: "",
  emergencyPhone: "",
  weight: "",
  height: "",
  profileImage: null,
  role: "User",
  password: "Welcome123!",
};

export default function UserForm({ mode = "add", existingUser = null }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existingUser) {
      setForm({ ...DEFAULT_FORM, ...existingUser, password: "" });
      if (existingUser.profileImageUrl) {
        setImagePreview(existingUser.profileImageUrl);
      }
    }
  }, [mode, existingUser]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("profileImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const calculateBMI = () => {
    const w = parseFloat(form.weight);
    const h = parseFloat(form.height) / 100;
    if (w > 0 && h > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return "-";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const endpoint =
        mode === "add"
          ? "http://localhost:8080/api/users"
          : `http://localhost:8080/api/users/${existingUser?.id}`;

      const method = mode === "add" ? "POST" : "PUT";

      const payload = { ...form, bmi: calculateBMI() };
      delete payload.profileImage;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || t("users.saveError"));
        return;
      }

      setSuccess(t("users.saveSuccess"));
      if (mode === "add") {
        setForm(DEFAULT_FORM);
        setImagePreview(null);
      }
    } catch {
      setError(t("users.saveError"));
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
        onClick={() => navigate("/home/users")}
      >
        ← {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? t("users.editUser") : t("users.addUser")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">{t("users.firstName")}</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">{t("users.lastName")}</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Gender & Age row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t("users.gender")}</Label>
                <div className="flex gap-4">
                  {["Male", "Female"].map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={(e) => handleChange("gender", e.target.value)}
                      />
                      {t(`users.${g.toLowerCase()}`)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">{t("users.age")}</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Contact row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("users.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">{t("users.mobile")}</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Emergency contact row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="emergencyName">{t("users.emergencyName")}</Label>
                <Input
                  id="emergencyName"
                  value={form.emergencyName}
                  onChange={(e) => handleChange("emergencyName", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emergencyPhone">{t("users.emergencyPhone")}</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={form.emergencyPhone}
                  onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                />
              </div>
            </div>

            {/* Body metrics row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">{t("users.weight")}</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="height">{t("users.height")}</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t("users.bmi")}</Label>
                <div className="flex items-center h-10 px-3 rounded-md border bg-muted text-sm">
                  {calculateBMI()}
                </div>
              </div>
            </div>

            {/* Profile image */}
            <div className="grid gap-2">
              <Label htmlFor="profileImage">{t("users.profileImage")}</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label>{t("users.role")}</Label>
              <div className="flex gap-4">
                {["Admin", "Trainer", "User"].map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={form.role === r}
                      onChange={(e) => handleChange("role", e.target.value)}
                    />
                    {t(`users.role${r}`)}
                  </label>
                ))}
              </div>
            </div>

            {/* Password (only for add mode) */}
            {!isEdit && (
              <div className="grid gap-2">
                <Label htmlFor="password">{t("users.password")}</Label>
                <Input
                  id="password"
                  type="text"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t("users.defaultPasswordHint")}
                </p>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isLoading}>
                {t("users.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/home/users")}
              >
                {t("users.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
