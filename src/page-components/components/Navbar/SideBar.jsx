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

const SideBar = () => {
  const router = useRouter();

  // Function to determine if the link is active
  const isActive = (path) => router.pathname === path;

  // Handle logout and redirect to sign-in page
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to sign-in page after successful logout
        router.push("/sign-in");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Reusable menu
  const MenuList = [
    { href: "/dashboard", icon: <RxHome size="20px" />, label: "Dashboard" },
    { href: "/profile-page", icon: <RxAvatar size="20px" />, label: "Profile" },
    { href: "/userpage", icon: <RxHeart size="20px" />, label: "My Donations" },
    { href: "/userpage", icon: <RxRocket size="20px" />, label: "My Requests" },
    { href: "/map-view", icon: <RxPaperPlane size="20px" />, label: "Map" },
    {
      href: "/chats",
      icon: <RxEnvelopeClosed size="20px" />,
      label: "Notifications",
    },
  ];

  return (
    <NavigationMenu className="border shadow-md pr-4 h-screen">
      <NavigationMenuList className="flex flex-col items-start md:h-[100vh] space-y-6 pt-6 justify-between">
        <div>
          <NavigationMenuItem className="flex items-center align-center pl-2">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={`text-heading3-bold`}>
                PICK ME FOOD
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <hr className="my-3 border" />

          <div className="flex flex-col justify-between space-y-2">
            {MenuList.map((item) => (
              <NavigationMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`relative pl-4 flex items-center gap-3 h-12 w-full text-xl p-3 cursor-pointer rounded-lg ${
                      isActive(item.href)
                        ? "bg-sky-200"
                        : "text-gray-700 hover:bg-sky-100"
                    }`}
                  >
                    {/* Left bar indicator */}
                    {isActive(item.href) && (
                      <span
                        className={`absolute left-0 top-0 w-1 h-full ${
                          isActive(item.href) ? "bg-sky-700" : "bg-sky-200"
                        }`}
                        aria-hidden="true"
                      ></span>
                    )}
                    {item.icon}
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </div>
        </div>
        <div>
          <NavigationMenuItem>
            <div className="flex align-center justify-between p-4">
              <NavigationMenuTrigger className="">
                More
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default SideBar;
