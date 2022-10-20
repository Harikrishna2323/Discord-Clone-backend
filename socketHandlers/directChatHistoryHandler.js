const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const chatUpdates = require("./updates/chat");

const directChatHistoryHandler = async (socket, data) => {
  console.log("directChatHistory route.");
  try {
    const userId = socket.user.id;
    const { receiverId } = data;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
      type: "DIRECT",
    });

    if (conversation) {
      chatUpdates.updateChatHistory(conversation._id.toString(), socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directChatHistoryHandler;
