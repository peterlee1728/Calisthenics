import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/api/client";
import ExerciseForm from "./ExerciseForm";

export default function EditExercise() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);

  useEffect(() => {
    api
      .get(`/exercises/${id}`)
      .then((res) => setExercise(res.data))
      .catch(() => {});
  }, [id]);

  if (!exercise) {
    return <div className="p-6">{t("common.loading")}</div>;
  }

  return <ExerciseForm mode="edit" existingExercise={exercise} />;
}
