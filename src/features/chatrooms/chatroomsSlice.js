// src/features/chatrooms/chatroomSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const LOCAL_STORAGE_KEY = "chatrooms_data";

// Load from localStorage or fallback dummy data
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [
    {
      id: 1,
      name: "General",
      messages: [
        { sender: "user", text: "Hello everyone!" },
        { sender: "ai", text: "Hello everyone!" },
      ],
      lastMessage: "Hello everyone!",
    },
    {
      id: 2,
      name: "Tech Talk",
      messages: [{ sender: "user", text: "React 19 is coming soon." }],
      lastMessage: "React 19 is coming soon.",
    },
    {
      id: 3,
      name: "Random",
      messages: [{ sender: "user", text: "Did you see that meme?" }],
      lastMessage: "Did you see that meme?",
    },
  ];
};

// Save to localStorage helper
const saveToLocalStorage = (chatrooms) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatrooms));
  } catch {}
};

const initialState = {
  list: loadFromLocalStorage(),
  selectedChatroomId: null,
  loading: true,
};

const chatroomSlice = createSlice({
  name: "chatrooms",
  initialState,
  reducers: {
    setSelectedChatroominstate(state, action) {
      state.selectedChatroomId = action.payload;
    },
    createChatroom(state, action) {
      const newRoom = {
        id: Date.now(),
        name: action.payload || "New Chatroom",
        messages: [],
        lastMessage: "",
      };
      state.list.push(newRoom);
      state.selectedChatroomId = newRoom.id;
      saveToLocalStorage(state.list);
      toast.success(" New Chatroom created ");
    },
    sendMessage(state, action) {
      const { text, sender = "user" } = action.payload;
      const room = state.list.find((r) => r.id === state.selectedChatroomId);
      if (!room) return;
      room.messages.push({ sender, text });
      room.lastMessage = text;
      room.name = text;
      saveToLocalStorage(state.list);
    },
    sendAIReply(state, action) {
      const { text } = action.payload;
      const room = state.list.find((r) => r.id === state.selectedChatroomId);
      if (!room) return;
      room.messages.push({ sender: "ai", text });
      room.lastMessage = text;
      saveToLocalStorage(state.list);
    },
    deleteChatroomById(state, action) {
      const chatroomId = action.payload;

      console.log(JSON.parse(JSON.stringify(state.list)));

      state.list = state.list?.filter((chatroom) => {
        return chatroom.id !== chatroomId;
      });

      toast.success(" Chatroom Deleted ");

      console.log(JSON.parse(JSON.stringify(state.list)));
      // saveToLocalStorage(state.list);
    },
  },
});

export const {
  setSelectedChatroominstate,
  createChatroom,
  sendMessage,
  sendAIReply,
  deleteChatroomById,
} = chatroomSlice.actions;
export default chatroomSlice.reducer;
