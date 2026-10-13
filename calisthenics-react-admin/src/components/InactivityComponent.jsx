import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./InactivityComponent.scss";

const InactivityComponent = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const events = [
    "mousedown",
    "mousemove",
    "wheel",
    "keydown",
    "touchstart",
    "scroll",
    "keypress",
    "touchmove",
  ];

  const inactivityTime = 1000 * 60 * 30; // 30 minutes

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setVisible(true);
      }, inactivityTime);
    };

    // Add event listeners for mouse, keyboard, and touch events
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start the timer on mount

    return () => {
      // Cleanup event listeners and clear the timer
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(timer);
    };
  }, []);

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div>
      {visible && (
        <Dialog
          header={t("inactivity.inactivityWarningHeader")}
          visible={visible}
          className="text-xs sm:text-base w-8"
          footer={
            <div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs sm:text-base w-full cursor-pointer sm:w-12 p-2 text-blue-900 border-none border-round-sm sm:content-center sm:justify-end awb-logout-button"
              >
                {t("inactivity.logout")}
              </button>
            </div>
          }
          draggable={false}
          closeOnEscape={false}
          closable={false}
          pt={{
            header: {
              style: { backgroundColor: "#fbc02d" },
            },
            content: {
              style: { paddingTop: "20px" },
            },
            root: {
              style: {
                borderRadius: "10px",
              },
            },
          }}
        >
          <p className="m-0">{t("inactivity.inactivityWarningMessage")}</p>
          <p className="m-0">{t("inactivity.inactivityWarningMessage1")}</p>
        </Dialog>
      )}
    </div>
  );
};

export default InactivityComponent;
