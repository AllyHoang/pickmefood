import {
    KnockFeedProvider,
    KnockProvider,
    NotificationFeedPopover,
    NotificationIconButton,
  } from "@knocklabs/react";
  // Required CSS import, unless you're overriding the styling
  import "@knocklabs/react/dist/index.css";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
  
  export const NotificationProvider = ({children}) => {
    const { loading, error, currentUser } = useSelector((state) => state.user);
    console.log(currentUser)
    if(!currentUser){
        return children;
    }
  
    return (
      <KnockProvider apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY} userId={currentUser?.id}>
        {/* Optionally, use the KnockFeedProvider to connect an in-app feed */}
        <KnockFeedProvider feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_ID}>
          <div>
            
          </div>
          {children}
        </KnockFeedProvider>
      </KnockProvider>
    );
  };