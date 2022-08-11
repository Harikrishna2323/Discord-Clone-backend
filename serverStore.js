const connectedUsers = new Map();

let io = null;

const setSocketServerInstance = (ioInstance) => {
    io = ioInstance
};

const getSocketServerInstance = () => {
    return io;
}

const addNewConnectedUser = ({socketId, userId})=> {
    connectedUsers.set(socketId,{userId});
    console.log('new connected users');
    console.log(connectedUsers)
};

const removeConnectedUser = (socketId) =>{
    if(connectedUsers.has(socketId)){
        connectedUsers.delete(socketId);
        console.log('New Connected users.')
        console.log(connectedUsers)
    }
}

const getActiveUsers = (userId) => {
    let activeConnections = [];

    connectedUsers.forEach(function (value, key){

        if(value.userId === userId.toString()){
            activeConnections.push(key);
        }
        
    })
    return activeConnections;
}

const getOnlineUsers = ()  => {
    const onlineUsers = [];

    connectedUsers.forEach(function(value, key) {
        onlineUsers.push({socketId: key, userId: value.userId})
    })
    return onlineUsers;
} 

module.exports = {addNewConnectedUser,
     removeConnectedUser,
     getActiveUsers,
     getSocketServerInstance,
     setSocketServerInstance,
     getOnlineUsers
     }