import { NavLink } from "react-router-dom";
import "./SideBar.scss";
import { ReactComponent as Home } from "../../assets/home-ico.svg";
import { ReactComponent as Notif } from "../../assets/notif.svg";
import { ReactComponent as Profile } from "../../assets/profile.svg";
import { ReactComponent as SingleChat } from "../../assets/single-chat.svg";
import { ReactComponent as MultiChat } from "../../assets/multi-chat.svg";
import { ReactComponent as Robot } from "../../assets/robot-ico.svg";
import { ReactComponent as AutoReply } from "../../assets/auto-ico.svg";
import { ReactComponent as Whatsapp } from "../../assets/whatsapp-ico.svg";
import { ReactComponent as Contacts } from "../../assets/contacts-ico.svg";
import { ReactComponent as Media } from "../../assets/media-ico.svg";
import { ReactComponent as Chain } from "../../assets/chain-ico.svg";
import { ReactComponent as Employee } from "../../assets/employee-ico.svg";
import { ReactComponent as API } from "../../assets/api-ico.svg";
import { ReactComponent as Support } from "../../assets/support-ico.svg";
import { ReactComponent as Subscribe } from "../../assets/subscribe.svg";
import { ReactComponent as Telegram } from "../../assets/tele.svg";
import { ReactComponent as Acadim } from "../../assets/labtop.svg";

const SideBar = ({ isAsideVisible }) => {
  const iconColor = "#322662"; // Change this to your desired color

  const sidebarLinks = [
    {
      path: "/dashboard",
      text: "الرئيسية",
      icon: <Home style={{ fill: iconColor }} />,
    },
    // {
    //   path: "/notifications",
    //   text: "الإشعارات",
    //   icon: <Notif style={{ fill: iconColor }} />,
    // },
    {
      path: "/profile",
      text: "ملفي",
      icon: <Profile style={{ fill: iconColor }} />,
    },
    {
      path: "/individual-messaging",
      text: "المراسلة الفردية",
      icon: <SingleChat style={{ fill: iconColor }} />,
    },
    {
      path: "/group-messaging",
      text: "المراسلة الجامعية",
      icon: <MultiChat style={{ fill: iconColor }} />,
    },
    {
      path: "/smart-bot",
      text: "الروبوت الذكي",
      icon: <Robot style={{ fill: iconColor }} />,
    },
    {
      path: "/auto-reply",
      text: "الرد الآلي",
      icon: <AutoReply style={{ fill: iconColor }} />,
    },
    {
      path: "/my-accounts",
      text: "حساباتي",
      icon: <Whatsapp style={{ fill: iconColor }} />,
    },
    {
      path: "/contact-list",
      text: "قائمة الاتصال",
      icon: <Contacts style={{ fill: iconColor }} />,
    },
    {
      path: "/file-management",
      text: "إدارة الملفات",
      icon: <Media style={{ fill: iconColor }} />,
    },
    // {
    //   path: "/linked-platforms",
    //   text: "المنصات المرتبطة",
    //   icon: <Chain style={{ fill: iconColor }} />,
    // },
    {
      path: "/employees",
      text: "الموظفين",
      icon: <Employee style={{ fill: iconColor }} />,
    },
    // {
    //   path: "/developers",
    //   text: "المطورين",
    //   icon: <API style={{ fill: iconColor }} />,
    // },
    // {
    //   path: "/technical-support",
    //   text: "الدعم الفني",
    //   icon: <Support style={{ fill: iconColor }} />,
    // },
    {
      path: "/subscription-manager",
      text: "مدير الاشتراكات",
      icon: <Subscribe style={{ fill: iconColor }} />,
    },
    // {
    //   path: "/program-academy",
    //   text: "أكاديمية البرنامج",
    //   icon: <Acadim style={{ fill: iconColor }} />,
    // },
    // {
    //   path: "/telegram-channel",
    //   text: "قناة التلجرام",
    //   icon: <Telegram style={{ fill: iconColor }} />,
    // },
  ];

  return (
    <aside
      className={`bg-light p-3 aside-transition ${
        isAsideVisible ? "aside-visible" : ""
      }`}
      style={{ width: "338px" }}
    >
      <h5>مرحبًا، العالم بين يديك الآن!</h5>
      <ul className="list-unstyled">
        {sidebarLinks.map((link, index) => (
          <li key={index} className="mb-2">
            <NavLink
              to={link.path}
              className="text-decoration-none d-flex align-items-center"
              activeclassname="active-route" // For react-router-dom v5
              style={({ isActive }) => ({
                color: isActive ? "#322662" : "#000",
                fontWeight: isActive ? "bold" : "normal",
                borderLeft: isActive ? "3px solid #322662" : "none",
              })}
            >
              <span className="me-2">{link.icon}</span>
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
