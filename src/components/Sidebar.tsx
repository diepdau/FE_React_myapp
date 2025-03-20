import DashboardIcon from "@mui/icons-material/Dashboard";
import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import logo2 from "../asset/avataAdmin.png";
import { Link } from "react-router-dom";
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

export default function Sidebar({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 875px)");
    const handleResize = () => {
      setExpanded(!mediaQuery.matches);
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <aside className="relative flex flex-col h-full bg-[#d6e2d4] text-black min-h-[100vh]">
      <Link to="/" className="flex items-center m-4 gap-2">
        <img src={logo2} className="w-[49px]  object-cover flex-shrink-0" />
        <span
          className={`text-[#111111] overflow-hidden transition-all ${
            expanded ? "block" : "hidden"
          }`}
        >
          MY-TASK
        </span>
      </Link>
      <button
        onClick={() => setExpanded((curr) => !curr)}
        className="absolute hidden top-6 right-[-17px] -translate-y-1/2 p-1 rounded-lg self-end"
      >
        {expanded ? <DashboardIcon /> : <DashboardIcon />}
      </button>
      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 px-3">{children}</ul>
      </SidebarContext.Provider>
    </aside>
  );
}
// Component SidebarItem
export function SidebarItem({
  icon,
  text,
  url,
  active,
  alert,
  subItems,
  onSelect,
}: {
  icon: ReactNode;
  text: string;
  url?: string;
  active?: boolean;
  alert?: boolean;
  subItems?: { text: string; url?: string }[];
  onSelect?: (path: string) => void;
}) {
  const { expanded } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;

  return (
    <>
      <li
        className={`bg-[#F3F7F5] text-[#111111] relative flex text-left my-3 font-medium cursor-pointer transition-colors group
            ${
              active
                ? "bg-black text-white"
                : "hover:bg-[#111111] hover:text-white"
            }
            ${isOpen ? "rounded-[20px]" : "rounded-[100px]"}
            ${expanded ? "py-2 px-4" : "py-3 px-3"}`}
        onClick={() => {
          if (hasSubItems) {
            setIsOpen(!isOpen);
          } else if (url && onSelect) {
            onSelect(url);
          }
        }}
      >
        <div>
          <div className={`flex rounded-full`}>
            {icon && (
              <span className="flex-shrink-0">
                {React.cloneElement(icon as React.ReactElement)}
              </span>
            )}
            <span
              className={`overflow-hidden transition-all ${
                expanded ? "w-34 ml-4 block" : "hidden"
              }`}
            >
              {hasSubItems ? (
                text
              ) : (
                <Link to={url || "#"} className="w-full flex items-center">
                  {text}
                </Link>
              )}
            </span>
            {hasSubItems && (
              <span
                className={`overflow-hidden transition-all  ${
                  expanded ? "w-3" : "w-0"
                }`}
              >
                {isOpen ? <DashboardIcon /> : <DashboardIcon />}
              </span>
            )}
          </div>
          {isOpen && hasSubItems && (
            <div
              className={`${
                active
                  ? "bg-black text-white"
                  : "hover:bg-[#111111] hover:text-white"
              }`}
            >
              {subItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.url || "#"}
                  className="block py-2 cursor-pointer hover:border-b hover:border-[#B1B1B1]"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.url && onSelect) onSelect(item.url);
                  }}
                >
                  {item.text}
                </Link>
              ))}
            </div>
          )}
        </div>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded-full bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
        {!expanded && (
          <div
            className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#B1B1B1] text-white text-sm
                invisible opacity-0 -translate-x-3 transition-all
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
          >
            {text}
          </div>
        )}
      </li>
    </>
  );
}
