import Link from "next/link";
import { useRef, useState } from "react";
import {
  NotificationFeedPopover,
  NotificationIconButton,
  NotificationCell,
} from "@knocklabs/react";
import "@knocklabs/react/dist/index.css";
import { useSelector } from "react-redux";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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

function HorizontalBar() {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const { loading, error, currentUser } = useSelector((state) => state.user);
//   const userImage = "path_to_user_image.jpg"; // Replace with your dynamic image path

return (
  <div className="base-container relative top-0 z-50 flex justify-end items-center gap-2">

      <div className="">
      <NotificationIconButton
        ref={notifButtonRef}
        onClick={(e) => setIsVisible(!isVisible)}
        className="bg-blue-500 p-2 rounded-full"
      />
      <NotificationFeedPopover
        buttonRef={notifButtonRef}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        renderItem={({ item, ...props }) => (
          <NotificationCell {...props} item={item}>
            <div className="rounded-xl">
              <Link
                className="flex items-center space-x-4 p-2 rounded-md text-blue-500 transition duration-150 ease-in-out"
                onClick={() => {
                  setIsVisible(false);
                }}
                href={`/transactions`}
              >
                <div className="flex flex-col">
                  <span className="font-bold">{item.data.name}</span>
                  <span className="text-gray-500">{item.data.message}</span>
                </div>
              </Link>
            </div>
          </NotificationCell>
        )}
      />
      </div>
      
                  {/* <div className="flex items-center gap-2">
                    <img
                      src={currentUser?.profileImage}
                      alt="User"
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    {currentUser?.username}
                  </div> */}  
                   <div className="">
                    <NavigationMenu className="bg-none" >
            <NavigationMenuItem className="list-none">
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
                  <NavigationMenuContent>
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
            </NavigationMenu>
            
          
    </div>
  </div>
);
}

export default HorizontalBar;
