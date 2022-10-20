const User = require("../models/User");
const friendsUpdates = require("../socketHandlers/updates/friends");
const FriendInvitation = require("../models/FriendInvitation");

exports.postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;
  const { id, mail } = req.user;

  //check if the mail is not same as sender
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res.status(409).json({
      message: "Sorry. You cannot be friends with yourself.",
    });
  }

  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });
  if (!targetUser) {
    return res.status(404).json({
      message: `Friend of mail: ${targetMailAddress} has not been found. Please try again.`,
    });
  }

  //check if invitation has already been sent
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: id,
    receiverId: targetUser._id,
  });

  if (invitationAlreadyReceived) {
    return res.status(409).json({
      message: "Invitation has been sent already. ",
    });
  }

  //check if user which we would like to invite is already our friend
  const alreadyFriends = targetUser.friends.find(
    (friendId) => friendId.toString() === id.toString()
  );

  if (alreadyFriends) {
    return res.status(409).json({
      message: "Friend already added.",
    });
  }

  //create new invitation in database
  const newInvitation = await FriendInvitation.create({
    senderId: id,
    receiverId: targetUser._id,
  });

  //send pending update to specific user
  friendsUpdates.updateFriendsPendingInvitations(targetUser._id);

  return res.status(201).json({
    message: "Invitation has benn sent.",
  });
};

exports.postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(401).json({
        message: "Error occured. Please try again.",
      });
    }

    const { senderId, receiverId } = invitation;

    //add friends to both users
    const sender = await User.findById(senderId);
    sender.friends = [...sender.friends, receiverId];

    const receiver = await User.findById(receiverId);
    receiver.friends = [...receiver.friends, senderId];

    await sender.save();
    await receiver.save();

    //delete the invitation after users are friends
    await FriendInvitation.findByIdAndDelete(id);

    //update list of friends if users are online
    friendsUpdates.updateFriends(senderId);
    friendsUpdates.updateFriends(receiverId);

    //update list of pending invitations
    friendsUpdates.updateFriendsPendingInvitations(receiverId);

    res.status(200).json({
      message: "Friend succefully added.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Somethimg went wrong. Please try again later.",
    });
  }
};

exports.postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;

    //remove that invitation from friends invitation collection
    const invitationExists = await FriendInvitation.exists({ _id: id });

    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    //update pending invitations
    friendsUpdates.updateFriendsPendingInvitations(userId);

    res.status(200).json({
      message: "Invitation rejected.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};
