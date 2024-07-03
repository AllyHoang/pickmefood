import React from "react";
import { FaPaperPlane } from "react-icons/fa";

export const SendButton = ({ onPress, disabled }) => {
  return (
    <button disabled={disabled} onClick={onPress}>
      <FaPaperPlane className="mr-2" />
      {/* Use onClick for button */}
    </button>
  );
};
