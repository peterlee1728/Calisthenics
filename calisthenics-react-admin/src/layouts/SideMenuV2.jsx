import React from "react";
import { Sidebar } from "primereact/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setClickedMenuItem } from "../redux/navigationSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SideMenuV2() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clickedMenuItem = useSelector(
    (state) => state.navigation.clickedMenuItem
  );
  const userRole = useSelector((state) => state.token.authState.userRole);

  const handleClick = (label, path) => {
    dispatch(setClickedMenuItem(label));
    navigate(path);
  };

  const adminMenu = [
    {
      label: t("menu.adminAccess"),
      icon: Shield,
      id: "Admin Access",
      path: "/admin-access",
    },
    {
      label: t("menu.advisorAccess"),
      icon: IdCard,
      id: "Advisor Access",
      path: "/advisor-access",
    },
  ];

  const configMenu = [
    {
      label: t("menu.applicationConfiguration"),
      icon: Cog,
      id: "Application Configuration",
      path: "/application-configuration",
    },
    {
      label: t("menu.subMenuConfiguration"),
      icon: List,
      id: "Sub Menu Configuration",
      path: "/sub-menu-configuration",
    },
  ];

  const supportingConfigItems = [
    {
      label: t("menu.channel"),
      id: "Channel",
      path: "/channel",
    },
    {
      label: t("menu.designation"),
      id: "Designation",
      path: "/designation",
    },
    {
      label: t("menu.parentAgency"),
      id: "Parent Agency",
      path: "/parent-agency",
    },
  ];

  const widgetConfigItems = [
    {
      label: t("menu.widgetList"),
      id: "Widget List",
      path: "/widget-configuration",
    },
    {
      label: t("menu.widgetAccess"),
      id: "Widget Access",
      path: "/widget-access",
    },
    {
      label: t("menu.googleWorkspaceAccess"),
      id: "Google Workspace Access",
      path: "/google-workspace-access",
    },
    {
      label: t("menu.noticeboard"),
      id: "Noticeboard List",
      path: "/noticeboard",
    },
    {
      label: t("menu.noticeboardAccess"),
      id: "Noticeboard Access",
      path: "/noticeboard-access",
    },
  ];

  const isAdvisor = userRole === "AD";

  return (
    <Sidebar.Panel>
      <Sidebar.Header>
        <span className="font-bold text-lg">
          {t("menu.accessConfigurations")}
        </span>
      </Sidebar.Header>

      <Sidebar.Content>
        {/* Main navigation */}
        <Sidebar.Group>
          <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {adminMenu
                .filter((item) =>
                  isAdvisor ? item.id === "Advisor Access" : true
                )
                .map((item) => (
                  <Sidebar.MenuItem key={item.id}>
                    <Sidebar.MenuButton
                      isActive={clickedMenuItem === item.id}
                      onClick={() => handleClick(item.id, item.path)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>

        {/* Supporting Configuration (collapsible submenu) */}
        {!isAdvisor && (
          <Sidebar.Group>
            <Sidebar.GroupLabel>
              {t("menu.supportingConfiguration")}
            </Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem collapsible defaultOpen={false}>
                  <Sidebar.MenuButton>
                    <Sitemap />
                    <span>{t("menu.supportingConfiguration")}</span>
                  </Sidebar.MenuButton>
                  <Sidebar.MenuSub>
                    {supportingConfigItems.map((item) => (
                      <Sidebar.MenuSubItem key={item.id}>
                        <Sidebar.MenuSubButton
                          isActive={clickedMenuItem === item.id}
                          onClick={() => handleClick(item.id, item.path)}
                        >
                          <span>{item.label}</span>
                        </Sidebar.MenuSubButton>
                      </Sidebar.MenuSubItem>
                    ))}
                  </Sidebar.MenuSub>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        )}

        {/* Configuration */}
        {!isAdvisor && (
          <Sidebar.Group>
            <Sidebar.GroupLabel>Configuration</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {configMenu.map((item) => (
                  <Sidebar.MenuItem key={item.id}>
                    <Sidebar.MenuButton
                      isActive={clickedMenuItem === item.id}
                      onClick={() => handleClick(item.id, item.path)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        )}

        {/* Widget Configuration (collapsible submenu) */}
        {!isAdvisor && (
          <Sidebar.Group>
            <Sidebar.GroupLabel>
              {t("menu.widgetConfiguration")}
            </Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem collapsible defaultOpen={false}>
                  <Sidebar.MenuButton>
                    <ThLarge />
                    <span>{t("menu.widgetConfiguration")}</span>
                  </Sidebar.MenuButton>
                  <Sidebar.MenuSub>
                    {widgetConfigItems.map((item) => (
                      <Sidebar.MenuSubItem key={item.id}>
                        <Sidebar.MenuSubButton
                          isActive={clickedMenuItem === item.id}
                          onClick={() => handleClick(item.id, item.path)}
                        >
                          <span>{item.label}</span>
                        </Sidebar.MenuSubButton>
                      </Sidebar.MenuSubItem>
                    ))}
                  </Sidebar.MenuSub>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        )}
      </Sidebar.Content>

      <Sidebar.Footer>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton tooltip="Settings">
              <Cog />
              <span>Settings</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Footer>
    </Sidebar.Panel>
  );
}
