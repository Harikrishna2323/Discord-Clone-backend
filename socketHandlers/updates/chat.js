const Conversation = require("../../models/Conversation");
const serverStore = require("../../serverStore");

const updateChatHistory = async (
  conversationId,
  toSpecifiedSocketId = null
) => {
  console.log("updateChat history.");
  const conversation = await Conversation.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: {
      path: "author",
      model: "User",
      select: "username _id",
    },
  });

  if (conversation) {
    const io = serverStore.getSocketServerInstance();
    if (toSpecifiedSocketId) {
      //initial update of chat history
      return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    }
    // check if users of this conversation are online
    //if yes emit to them update of conversation / message

    conversation.participants.forEach((userId) => {
      const activeConnections = serverStore.getActiveUsers(userId.toString());

      activeConnections.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      });
    });
  }
};

module.exports = { updateChatHistory };
