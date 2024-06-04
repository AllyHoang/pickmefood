// Navbar.js
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/page-components/shadcn/navigation-menu";

const ListItem = React.forwardRef(function ListItem(
  { className, title, children, ...props },
  ref
) {
  return React.createElement(
    "li",
    null,
    React.createElement(
      NavigationMenuLink,
      { asChild: true },
      React.createElement(
        "a",
        {
          ref: ref,
          className: cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          ),
          ...props,
        },
        React.createElement(
          "div",
          { className: "text-sm font-medium leading-none" },
          title
        ),
        React.createElement(
          "p",
          {
            className:
              "line-clamp-2 text-sm leading-snug text-muted-foreground",
          },
          children
        )
      )
    )
  );
});
ListItem.displayName = "ListItem";

const RightBar = () => {
  return (
    <>
      <NavigationMenu className="border-l border-black-200 pr-4 w-48 pt-6">
        <NavigationMenuList className="flex flex-col items-start md:h-[100vh] space-y-80 pl-4 justify-start">
          <NavigationMenuItem>
            <NavigationMenuLink className={` font-medium w-[160px] h-12 py-2`}>
              Notifications
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink className={`font-medium w-[160px] h-12 py-2`}>
              Donation Centers near me
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default RightBar;
