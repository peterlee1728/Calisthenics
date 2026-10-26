import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserForm from "./UserForm";

export default function EditUser() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return <UserForm mode="edit" existingUser={user} />;
}
