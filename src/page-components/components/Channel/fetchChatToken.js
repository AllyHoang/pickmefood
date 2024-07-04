export async function fetchChatToken(userId, roomIdentifier) {
  console.log(roomIdentifier);
  const response = await fetch(`/api/generateChatToken`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      roomIdentifier: roomIdentifier,
    }),
  });
  const tokenData = await response.json();
  const token = tokenData.data.chatToken;

  return {
    token,
  };
}
