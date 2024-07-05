import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const Comments = ({ eventId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [eventId, userId]); // Include userId in dependencies to fetch updated user info

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/events/${eventId}/comments`);
      const commentsData = response.data.data.comments;

      // Fetch user details including profile image for each comment author
      for (let comment of commentsData) {
        const userResponse = await axios.get(`/api/users/${comment.user}`);
        comment.user = userResponse.data.user;
      }

      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post(`/api/events/${eventId}/comments`, {
        eventId,
        text: newComment,
        userId,
      });
      // After posting, immediately fetch comments again to update state
      fetchComments();
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleEditComment = (commentId) => {
    // Implement edit comment functionality
    console.log("Edit comment:", commentId);
  };

  const handleDeleteComment = async (commentId) => {
    // Implement delete comment functionality
    try {
      await axios.delete(`/api/events/${eventId}/comments/${commentId}`);
      // After deletion, fetch comments again to update state
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-2 flex-grow">
        {comments?.map((comment) => (
          <div
            key={comment._id}
            className="bg-white p-4 rounded shadow flex items-center"
          >
            <img
              src={comment.user.profileImage} // Assuming user has a profileImage field
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-3 flex-grow">
              <p className="text-gray-800">{comment.text}</p>
            </div>
            {comment.user._id === userId && (
              <div className="ml-auto flex space-x-2">
                <button
                  onClick={() => handleEditComment(comment._id)}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="comments-container border border-gray-200 rounded p-4 space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-gray-300 border rounded-md px-3 py-2"
            placeholder="Add a comment..."
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
