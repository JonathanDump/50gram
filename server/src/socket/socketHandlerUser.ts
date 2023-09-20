import { Server } from "socket.io";
import User from "../models/user";
import Chat from "../models/chat";
import jwtDecode from "jwt-decode";
import { DecodedJwt, UserInterface } from "../interfaces/interfaces";

export let usersOnline: { userId: string; socketId: string }[] = [];
export default function socketHandlerUser(io: Server) {
  io.on("connect", (socket) => {
    console.log("connection created");
    // console.log("socket", socket.handshake.auth);

    if (!socket.handshake.auth.token) {
      console.log("invalid token");

      socket.emit("invalid token");
    }
    if (socket.handshake.auth.token) {
      console.log("handshake auth", socket.handshake.auth.token);

      console.log("decoding token");

      const decodedJwt: DecodedJwt = jwtDecode(
        socket.handshake.auth.token as string
      );
      console.log("decoded token", decodedJwt);

      const userIds = { socketId: socket.id, userId: decodedJwt.user._id! };
      usersOnline.find((user) => user.userId === userIds.userId) ||
        usersOnline.push(userIds);

      io.emit("online", usersOnline);
    }

    console.log("users online", usersOnline);

    socket.on("getAllUsers", async (myId) => {
      const allUsers = await User.find({
        _id: { $ne: myId },
      })
        .select("id name img isVerified")
        .exec();

      const populateChatsWithUnreadMessages = async (
        user: any,
        myId: string
      ) => {
        const populatedChat = await Chat.findOne({
          users: { $all: [myId, user._id] },
        })
          .populate({
            path: "messages",
            match: { isRead: false, user: user._id },
            select: "id",
          })
          .exec();

        return {
          ...user.toObject(),
          newMessages: populatedChat?.messages.length || 0,
        };
      };

      const usersWithPopulatedChat = await Promise.all(
        allUsers.map((user) => populateChatsWithUnreadMessages(user, myId))
      );

      // socket.emit("allUsers", allUsers);
      socket.emit("allUsers", usersWithPopulatedChat);
    });

    socket.on("signUpUser", (user) => {
      console.log("signing up the user");

      socket.broadcast.emit("updateUserList", user);
    });

    socket.on("disconnect", async () => {
      console.log("disconnect");

      const disconnectedUser = usersOnline.filter(
        (user) => user.socketId === socket.id
      );
      const userDb = await User.findById(disconnectedUser[0]?.userId);

      if (userDb) {
        userDb.lastOnline = Date.now();
        await userDb.save();

        socket.broadcast.emit("disconnected user", {
          _id: userDb._id,
          name: userDb.name,
          lastOnline: userDb.lastOnline,
        });
      }

      usersOnline = usersOnline.filter((user) => user.socketId !== socket.id);
      io.emit("disconnected", usersOnline);
      console.log("final users online", usersOnline);
      socket.emit("disconnect user");
    });
  });
}
