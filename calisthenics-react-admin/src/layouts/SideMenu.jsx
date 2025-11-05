import "primeicons/primeicons.css";
import { PanelMenu } from "primereact/panelmenu";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickedMenuItem } from "../redux/navigationSlice";
import "./SideMenu.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SideMenu = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const clickedMenuItem = useSelector(
    (state) => state.navigation.clickedMenuItem
  );
  const userRole = useSelector((state) => state.token.authState.userRole);
  const handleMenuItemClick = (label) => {
    dispatch(setClickedMenuItem(label));
  };
  const navigate = useNavigate();

  const [expandedKeys, setExpandedKeys] = useState({});

  const setSideMenuValue = (labelName, handleMenuItemClickName, urlLink) => {
    return {
      label: t(labelName),
      command: () => {
        handleMenuItemClick(handleMenuItemClickName);
        navigate(urlLink);
        setExpandedKeys({});
      },
    };
  };

  const setSideSubMenuValue = (labelName, handleMenuItemClickName, urlLink) => {
    return {
      label: t(labelName),
      command: (event) => {
        event.originalEvent.preventDefault();
        handleMenuItemClick(handleMenuItemClickName);
        navigate(urlLink);
      },
    };
  };

  const sideMenu = [
    setSideMenuValue("menu.adminAccess", "Admin Access", "/admin-access"),
    setSideMenuValue("menu.advisorAccess", "Advisor Access", "/advisor-access"),
    {
      label: t("menu.supportingConfiguration"),
      key: "supportingConfiguration",
      items: [
        setSideSubMenuValue("menu.channel", "Channel", "/channel"),
        setSideSubMenuValue("menu.designation", "Designation", "/designation"),
        setSideSubMenuValue(
          "menu.parentAgency",
          "Parent Agency",
          "/parent-agency"
        ),
      ],
    },
    setSideMenuValue(
      "menu.applicationConfiguration",
      "Application Configuration",
      "/application-configuration"
    ),
    setSideMenuValue(
      "menu.subMenuConfiguration",
      "Sub Menu Configuration",
      "/sub-menu-configuration"
    ),
    {
      label: t("menu.widgetConfiguration"),
      key: "widgetConfiguration",
      items: [
        setSideSubMenuValue(
          "menu.widgetList",
          "Widget List",
          "/widget-configuration"
        ),
        setSideSubMenuValue(
          "menu.widgetAccess",
          "Widget Access",
          "/widget-access"
        ),
        setSideSubMenuValue(
          "menu.googleWorkspaceAccess",
          "Google Workspace Access",
          "/google-workspace-access"
        ),
        setSideSubMenuValue(
          "menu.noticeboard",
          "Noticeboard List",
          "/noticeboard"
        ),
        setSideSubMenuValue(
          "menu.noticeboardAccess",
          "Noticeboard Access",
          "/noticeboard-access"
        ),
      ],
    },
  ];

  // Filter the sideMenu array based on the user role
  const filteredSideMenu =
    userRole === "AD"
      ? sideMenu.filter((item) => item.label === t("menu.advisorAccess"))
      : sideMenu;

  const addBorder = () => {
    return { borderBottom: "1px solid #d8dee9" };
  };

  const onExpandedKeysChange = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
  };

  return (
    <div className="text-base md:text-xl w-full min-w-150">
      <div className="text-base md:text-xl mb-4 font-bold white-space-nowrap">
        {t("menu.accessConfigurations")}
      </div>
      <PanelMenu
        model={filteredSideMenu.map((item) => ({
          ...item,
          items: item.items
            ? item.items.map((subItem) => ({
                ...subItem,
                className:
                  clickedMenuItem === subItem.label
                    ? "awb-active-menu-item"
                    : "",
              }))
            : undefined,
          className:
            clickedMenuItem === item.label ? "awb-active-menu-item" : "",
          style: addBorder(),
        }))}
        expandedKeys={expandedKeys}
        onExpandedKeysChange={onExpandedKeysChange}
      />
    </div>
  );
};

export default SideMenu;
