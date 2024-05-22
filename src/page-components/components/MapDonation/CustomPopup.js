import React from "react";
import styles from "./CustomPopup.module.css";

const CustomPopup = {
  show: function (title, content) {
    const popupTitle = document.getElementById("popupTitle");
    const popupContent = document.getElementById("popupContent");

    if (!popupTitle || !popupContent) {
      console.error("Popup elements not found in the DOM");
      return;
    }

    popupTitle.innerHTML = title;
    popupContent.innerHTML = content;

    const popup = document.getElementById("customPopup");

    if (!popup) {
      console.error("Popup container element not found in the DOM");
      return;
    }

    popup.style.display = "block";
  },
};

const CustomPopupComponent = () => {
  return (
    <div id="customPopup" className={styles.customPopup}>
      <div className={styles.popupContent}>
        <h3 id="popupTitle" className={styles.popupTitle}></h3>
        <p id="popupContent" className={styles.popupContent}></p>
      </div>
      <span id="popupClose" className={styles.popupClose}>
        &times;
      </span>
    </div>
  );
};

export { CustomPopup, CustomPopupComponent };
