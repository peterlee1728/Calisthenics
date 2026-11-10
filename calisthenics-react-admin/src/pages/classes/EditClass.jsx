import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ClassForm from "./ClassForm";

export default function EditClass() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/classes/${id}`)
      .then((res) => res.json())
      .then((data) => setClassData(data))
      .catch(() => {});
  }, [id]);

  if (!classData) {
    return <div className="p-6">{t("common.loading")}</div>;
  }

  return <ClassForm mode="edit" existingClass={classData} />;
}
