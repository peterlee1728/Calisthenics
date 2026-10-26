import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UserListing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = users.filter((user) => {
    const term = search.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("users.title")}</CardTitle>
            <Button onClick={() => navigate("/home/users/add")}>
              + {t("users.addUser")}
            </Button>
          </div>
          <div className="pt-2">
            <Input
              placeholder={t("users.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("users.noResults")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-2 font-medium">{t("users.firstName")}</th>
                    <th className="py-3 px-2 font-medium">{t("users.lastName")}</th>
                    <th className="py-3 px-2 font-medium">{t("users.email")}</th>
                    <th className="py-3 px-2 font-medium">{t("users.mobile")}</th>
                    <th className="py-3 px-2 font-medium">{t("users.role")}</th>
                    <th className="py-3 px-2 font-medium">{t("users.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-3 px-2">{user.firstName}</td>
                      <td className="py-3 px-2">{user.lastName}</td>
                      <td className="py-3 px-2">{user.email}</td>
                      <td className="py-3 px-2">{user.mobile}</td>
                      <td className="py-3 px-2">{user.role}</td>
                      <td className="py-3 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/home/users/${user.id}/edit`)}
                        >
                          {t("users.edit")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
