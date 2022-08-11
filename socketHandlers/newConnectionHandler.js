const serverStore = require('../serverStore');
const friendsUpdate = require('../socketHandlers/updates/friends');

const newConnectionHandler = async(socket, io) => {
    const userDetails = socket.user;

    serverStore.addNewConnectedUser({
        socketId: socket.id,
        userId: userDetails.id
    })

    //update pending friends invitation list
    friendsUpdate.updateFriendsPendingInvitations(userDetails.id)

    //update friendsList
    friendsUpdate.updateFriends(userDetails.id)
}

module.exports = newConnectionHandler;