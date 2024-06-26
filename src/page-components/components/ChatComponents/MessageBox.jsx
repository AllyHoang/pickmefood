import { format } from "date-fns";

const MessageBox = ({ message, currentUser }) => {
  return message?.sender?._id !== currentUser ? (
    <div className="message-box">
      <img
        src={message?.sender?.profileImage || "/assets/person.jpg"}
        alt="profile photo"
        className="message-profilePhoto"
      />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160;{" "}
          {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <p className="w-fit bg-white py-2 px-4  shadow rounded-xl text-base-medium">
            {message?.text}
          </p>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <p className="w-fit py-2 px-4 bg-indigo-200 shadow rounded-xl text-base-medium">
            {message?.text}
          </p>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  );
};

export default MessageBox;
