import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExerciseProgressionForm from "./ExerciseProgressionForm";

export default function EditExerciseProgression() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/exercise-progressions/${id}`)
      .then((res) => res.json())
      .then(setItem)
      .catch(() => {});
  }, [id]);

  if (!item) {
    return <div className="p-6">{t("common.loading")}</div>;
  }

  return <ExerciseProgressionForm mode="edit" existingItem={item} />;
}
