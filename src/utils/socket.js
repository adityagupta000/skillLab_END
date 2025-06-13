import { io } from "socket.io-client";

const socket = io("/", {
  auth: {
    token: localStorage.getItem("token"),
  },
  autoConnect: false,
});

export default socket;
