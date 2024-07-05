import Link from "next/link";
import { useRef, useState } from "react";
import {
  NotificationFeedPopover,
  NotificationIconButton,
  NotificationCell,
} from "@knocklabs/react";
import "@knocklabs/react/dist/index.css";
import { useSelector } from "react-redux";

function HorizontalBar() {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const { loading, error, currentUser } = useSelector((state) => state.user);
//   const userImage = "path_to_user_image.jpg"; // Replace with your dynamic image path

  return (
    <div className="relative top-0 z-50 flex justify-end">
      <div className="flex justify-end items-center space-x-4 px-5 py-5 bg-white ">
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
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser?.profileImage}
                        alt="User"
                        className="rounded-full w-10 h-10 object-cover"
                      />
                      {currentUser?.username}
                    </div>
      </div>
    </div>
  );
}

export default HorizontalBar;
