import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setClickedMenuItem } from "../redux/navigationSlice";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bars, PowerOff, ChevronDown } from "@primeicons/react";

function CollapsibleSection({ title, items, clickedMenuItem, onItemClick }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-1">
      <button
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent rounded-md transition-colors text-left"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span
          className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>
      {open && (
        <div className="grid gap-1 pl-4 mt-1">
          {items.map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors
                ${
                  clickedMenuItem === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => onItemClick(item.id, item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserProfile({ email, onProfileClick, onLogout }) {
  const initials = email ? email.substring(0, 2).toUpperCase() : "??";

  return (
    <div className="border-t">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          onClick={onProfileClick}
          title="View profile"
        >
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
            {initials}
          </div>
          <span className="text-sm truncate">{email}</span>
        </button>
        <button
          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
          onClick={onLogout}
          title="Logout"
        >
          <PowerOff className="w-4 h-4" />
        </button>
      </div>
      <div className="px-4 pb-2 text-right">
        <span className="text-[10px] text-muted-foreground">v{__APP_VERSION__}</span>
      </div>
    </div>
  );
}

export default function SideMenuV2() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const clickedMenuItem = useSelector(
    (state) => state.navigation.clickedMenuItem,
  );
  const userEmail = useSelector((state) => state.token.authState.email);

  const handleClick = (label, path) => {
    dispatch(setClickedMenuItem(label));
    navigate(path);
    setVisible(false);
  };

  const sections = [
    {
      title: t("menu.userConfigurations"),
      items: [
        { label: t("menu.addUsers"), id: "Add Users", path: "/home/users/add" },
        {
          label: t("menu.updateUsers"),
          id: "Update Users",
          path: "/home/users",
        },
        {
          label: t("menu.banHideUsers"),
          id: "Ban/Hide Users",
          path: "/home/users",
        },
      ],
    },
    {
      title: t("menu.classesConfigurations"),
      items: [
        {
          label: t("menu.addClasses"),
          id: "Add Classes",
          path: "/home/classes/add",
        },
        {
          label: t("menu.updateClasses"),
          id: "Update Classes",
          path: "/home/classes",
        },
        {
          label: t("menu.banHideClasses"),
          id: "Ban/Hide Classes",
          path: "/home/classes",
        },
      ],
    },
    {
      title: t("menu.exercisesConfigurations"),
      items: [
        {
          label: t("menu.addExercises"),
          id: "Add Exercises",
          path: "/home/exercises/add",
        },
        {
          label: t("menu.editExercises"),
          id: "Edit Exercises",
          path: "/home/exercises",
        },
        {
          label: t("menu.removeHideExercises"),
          id: "Remove/Hide Exercises",
          path: "/home/exercises",
        },
      ],
    },
    {
      title: t("menu.exerciseProgressionsConfiguration"),
      items: [
        {
          label: t("menu.addExerciseProgressions"),
          id: "Add Exercise Progressions",
          path: "/home/exercise-progressions/add",
        },
        {
          label: t("menu.editExerciseProgressions"),
          id: "Edit Exercise Progressions",
          path: "/home/exercise-progressions",
        },
      ],
    },
    {
      title: t("menu.userProgressionsConfiguration"),
      items: [
        {
          label: t("menu.addUserProgressions"),
          id: "Add User Progressions",
          path: "/home/user-progressions/add",
        },
        {
          label: t("menu.editUserProgressions"),
          id: "Edit User Progressions",
          path: "/home/user-progressions",
        },
      ],
    },
  ];

  return (
    <div>
      <div
        className="cursor-pointer p-2"
        onClick={() => setVisible(true)}
      >
        <Bars className="w-6 h-6" />
      </div>

      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        position="left"
        className="w-72"
        content={({ hide }) => (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b flex gap-2 justify-center">
              <div>
                <img
                  src="/images/one_arm_handstand_gold.png"
                  alt="User avatar"
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
              </div>
              <div className="content-center">
                <h2 className="text-lg font-bold">{t("menu.title")}</h2>
              </div>
            </div>

            {/* Scrollable menu sections */}
            <div className="flex-1 overflow-y-auto py-2 px-2">
              {sections.map((section) => (
                <CollapsibleSection
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  clickedMenuItem={clickedMenuItem}
                  onItemClick={handleClick}
                />
              ))}
            </div>

            {/* User profile pinned at bottom */}
            <UserProfile
              email={userEmail}
              onProfileClick={() => {
                setVisible(false);
                navigate("/profile");
              }}
              onLogout={() => {
                dispatch(logout());
                navigate("/login");
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
