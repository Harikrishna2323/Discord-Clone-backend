const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const chatUpdates = require("./updates/chat");

const directMessageHandler = async (socket, data) => {
  try {
    const userId = socket.user.id;

    const { receiverUserId, content } = data;

    // Create a new message
    const message = await Message.create({
      content: content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });

    //find if conversation exists with these users --- else create new conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      //perform update to sender and receiver if both are online

      chatUpdates.updateChatHistory(conversation._id.toString());
    } else {
      //create new conversation, if not already existing
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
      });

      //perform update to sender and receiver if both are online
      chatUpdates.updateChatHistory(newConversation._id.toString());
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directMessageHandler;
