import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/api/client";
import ExerciseProgressionForm from "./ExerciseProgressionForm";

export default function EditExerciseProgression() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api
      .get(`/exercise-progressions/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => {});
  }, [id]);

  if (!item) {
    return <div className="p-6">{t("common.loading")}</div>;
  }

  return <ExerciseProgressionForm mode="edit" existingItem={item} />;
}
