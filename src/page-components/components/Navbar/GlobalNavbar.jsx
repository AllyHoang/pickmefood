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

const GlobalNavbar = () => {
  return (
    <>
      <NavigationMenu className="border-r border-black-200 pr-4">
        <NavigationMenuList className="flex flex-col items-start md:h-[100vh] space-y-6 pl-4 justify-around">
          <NavigationMenuItem className="">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className="text-xl">
                {" "}
                Pick Me Food
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <div className="flex flex-col justify-between space-y-6">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} w-[180px] h-12 py-2`}
                >
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} w-[180px] h-12 py-2`}
                >
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/active-donation" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} w-[180px] h-12 py-2`}
                >
                  My Donations
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/active-request" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} w-[180px] h-12 py-2`}
                >
                  My Requests
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} w-[180px] h-12  py-2`}
                >
                  My Transactions
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} w-[180px] h-12 py-2`}
                >
                  Notifications
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="">
              More
              <NavigationMenuContent className="">
                <ul className="grid gap-3 p-6 md:w-[100px] lg:w-[180px] lg:grid-cols-[1fr]">
                  <ListItem
                    className={`${navigationMenuTriggerStyle()} w-[120px] h-12 py-2`}
                    href="/about"
                  >
                    About Us
                  </ListItem>
                  <ListItem
                    className={`${navigationMenuTriggerStyle()} w-[120px] h-12 py-2`}
                    href="/contact"
                  >
                    Contact Us
                  </ListItem>
                  <ListItem
                    className={`${navigationMenuTriggerStyle()} w-[120px] h-12 py-2`}
                    href="/log-out"
                  >
                    Log Out
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default GlobalNavbar;

export async function getServerSideProps(context) {
  // Fetch the token from context
  const token = context.req.cookies.token;

  // Decode the token to get user information
  const decodedToken = jwtDecode(token);

  // Extract userId from decoded token
  const userId = decodedToken.id;

  // Pass userId as props to the component
  return {
    props: {
      userId,
    },
  };
}
