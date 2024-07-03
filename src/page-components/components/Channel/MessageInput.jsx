export const MessageInput = ({ value, onMessageChange }) => {
  // Corrected prop name
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onMessageChange(e.target.value)} // Ensure proper value change handling
      placeholder="Send a message"
      className="block w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
    />
  );
};
