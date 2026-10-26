import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { t } = useTranslation();
  const email = useSelector((state) => state.token.authState.email);
  const userRole = useSelector((state) => state.token.authState.userRole);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("profile.passwordRequired"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("profile.passwordMismatch"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || t("profile.passwordError"));
        return;
      }

      setSuccess(t("profile.passwordSuccess"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch {
      setError(t("profile.passwordError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-lg grid gap-6">
        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.title")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1">
              <Label>{t("profile.email")}</Label>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="grid gap-1">
              <Label>{t("profile.role")}</Label>
              <p className="text-sm text-muted-foreground">{userRole}</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.changePassword")}</CardTitle>
            <CardDescription>
              {!showPasswordForm && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowPasswordForm(true)}
                >
                  {t("profile.changePassword")}
                </Button>
              )}
            </CardDescription>
          </CardHeader>
          {showPasswordForm && (
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">{t("profile.currentPassword")}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">{t("profile.newPassword")}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">{t("profile.confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {t("profile.save")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    {t("profile.cancel")}
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
