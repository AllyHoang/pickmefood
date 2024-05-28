// Navbar.js
import Link from "next/link";
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

const LandingPageNavbar = () => {
  return (
    <>
      <NavigationMenu className="border-b border-black-200 pr-4 ">
        <NavigationMenuList className="flex p-7 w-full md:w-[100vw] justify-between">
          <NavigationMenuItem className="">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className="text-xl">
                Pick Me Food
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <div className="flex flex-row space-x-10">
            <NavigationMenuItem>
              <Link href="/active-donation" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()}`}
                >
                  About Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/sign-in" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} `}
                >
                  Sign In
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/sign-up" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`group inline-flex h-10 w-max items-center justify-start rounded-md bg-[#9abaed81] hover:bg-[#9abaedf1] font-bold px-4 py-2 text-sm transition-colors border border-black`}
                >
                  Make an account
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default LandingPageNavbar;
