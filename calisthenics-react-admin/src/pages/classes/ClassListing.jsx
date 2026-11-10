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

export default function ClassListing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return classes.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
    );
  }, [classes, search]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("classes.title")}</CardTitle>
            <Button onClick={() => navigate("/home/classes/add")}>
              {t("classes.addClass")}
            </Button>
          </div>
          <Input
            placeholder={t("classes.searchPlaceholder")}
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
                  <th className="pb-2 pr-4">{t("classes.name")}</th>
                  <th className="pb-2 pr-4">{t("classes.date")}</th>
                  <th className="pb-2 pr-4">{t("classes.day")}</th>
                  <th className="pb-2 pr-4">{t("classes.startTime")}</th>
                  <th className="pb-2 pr-4">{t("classes.endTime")}</th>
                  <th className="pb-2 pr-4">{t("classes.duration")}</th>
                  <th className="pb-2 pr-4">{t("classes.location")}</th>
                  <th className="pb-2 pr-4">{t("classes.price")}</th>
                  <th className="pb-2">{t("classes.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-4 text-center text-muted-foreground">
                      {t("classes.noResults")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2 pr-4">{c.name}</td>
                      <td className="py-2 pr-4">{c.date}</td>
                      <td className="py-2 pr-4">{c.day}</td>
                      <td className="py-2 pr-4">{c.startTime}</td>
                      <td className="py-2 pr-4">{c.endTime}</td>
                      <td className="py-2 pr-4">{c.duration}</td>
                      <td className="py-2 pr-4">{c.location}</td>
                      <td className="py-2 pr-4">{c.price}</td>
                      <td className="py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/home/classes/${c.id}/edit`)}
                        >
                          {t("classes.edit")}
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
