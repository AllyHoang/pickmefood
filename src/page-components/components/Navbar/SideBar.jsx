import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/page-components/shadcn/navigation-menu";
import {
  RxAvatar,
  RxChevronUp,
  RxEnvelopeClosed,
  RxHome,
  RxPaperPlane,
  RxRocket,
  RxPinRight,
  RxChatBubble,
  RxHeart,
} from "react-icons/rx";
import { FiCreditCard } from "react-icons/fi";
import { AiOutlineTrophy } from "react-icons/ai";
import { FiBell } from "react-icons/fi";
import { MdOutlineLeaderboard } from "react-icons/md";
import { useSelector } from "react-redux";

const handleLogout = async () => {
  try {
    await fetch("/api/users/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to logout:", error);
  }
};

const SideBar = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = React.useState(router.pathname);
  const { loading, error, currentUser } = useSelector((state) => state.user);

  const MenuList = [
    { href: "/dashboard", icon: <RxHome size="20px" />, label: "Dashboard" },
    { href: "/map-view", icon: <RxPaperPlane size="20px" />, label: "Map" },
    {
      href: {
        pathname: `/${currentUser?.username}`,
      },
      icon: <RxAvatar size="20px" />,
      label: "Profile",
    },
    {
      href: "/transactions",
      icon: <FiCreditCard size="20px" />,
      label: "Transaction",
    },
    {
      href: "/leaderboard",
      icon: <AiOutlineTrophy size="21px" />,
      label: "Leaderboard",
    },
    { href: "/chats", icon: <FiBell size="20px" />, label: "Notifications" },
  ];

  const isActive = (path) => activeItem === path;

  return (
    <>
      <NavigationMenu className="border shadow-md h-screen">
        <NavigationMenuList className="flex flex-col items-start md:h-[100vh] space-y-6 pt-6 justify-between">
          <div>
            <NavigationMenuItem className="flex items-center align-center pl-2 pr-6">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={`text-heading3-bold`}>
                  PICK ME FOOD
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <hr className="my-2 border-t-2 border-gray-200"></hr>

            <div className="flex flex-col justify-between space-y-2">
              {MenuList.map((item) => (
                <NavigationMenuItem key={item.label} className="w-[100%]">
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`relative pl-4 flex items-center gap-3 h-12 w-full text-xl p-3 cursor-pointer group ${
                        isActive(item.href)
                          ? "bg-sky-200"
                          : "text-gray-700 hover:bg-sky-100"
                      }`}
                      onClick={() => setActiveItem(item.href)}
                    >
                      {isActive(item.href) && (
                        <span
                          className={`absolute left-0 top-0 w-1 h-full bg-sky-700`}
                          aria-hidden="true"
                        ></span>
                      )}
                      <span
                        className={`transition-transform ${
                          isActive(item.href) ? "rotate-oscillate" : ""
                        }`}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </div>
          </div>
          <div>
            <hr className="border"></hr>
            <div className="flex align-middle justify-start">
              <NavigationMenuItem>
                <div className="flex align-start justify-between pt-2 pb-2">
                  <NavigationMenuTrigger className="h-12">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser?.profileImage}
                        alt="User"
                        className="rounded-full w-10 h-10 object-cover"
                      />
                      {currentUser?.username}
                    </div>
                    <NavigationMenuContent className="">
                      <ul className="grid gap-3 p-6 md:w-[100px] lg:w-[190px] lg:grid-cols-[1fr]">
                        <Link href="/about" legacyBehavior passHref>
                          <a
                            className={`${navigationMenuTriggerStyle()} w-[150px] h-12 text-md flex items-center gap-2`}
                          >
                            <RxRocket size="20px" />
                            About Us
                          </a>
                        </Link>
                        <Link href="/contact" legacyBehavior passHref>
                          <a
                            className={`${navigationMenuTriggerStyle()} w-[150px] h-12 text-md flex items-center gap-2`}
                          >
                            <RxChatBubble size="20px" />
                            Contact Us
                          </a>
                        </Link>
                        <a
                          href="#"
                          onClick={handleLogout}
                          className={`${navigationMenuTriggerStyle()} w-[140px] h-12 text-md flex items-center gap-2`}
                        >
                          <RxPinRight size="20px" />
                          Log Out
                        </a>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuTrigger>
                </div>
              </NavigationMenuItem>
            </div>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default SideBar;
