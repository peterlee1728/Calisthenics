import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/api/client";
import UserProgressionForm from "./UserProgressionForm";

export default function EditUserProgression() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api
      .get(`/user-progressions/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => {});
  }, [id]);

  if (!item) {
    return <div className="p-6">{t("common.loading")}</div>;
  }

  return <UserProgressionForm mode="edit" existingItem={item} />;
}
