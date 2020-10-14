import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatId: " ",
    chatName: " ",
    chatPhoto: [],
    chatMembers: [],
  },
  reducers: {
    setChat: (state, action) => {
      state.chatId = action.payload.chatId;
      state.chatName = action.payload.chatName;
      state.chatPhoto = action.payload.chatPhoto;
      state.chatMembers = action.payload.chatMembers;
    },
  },
});

export const { setChat } = chatSlice.actions;

export const selectChatName = (state) => state.chat.chatName;
export const selectChatId = (state) => state.chat.chatId;
export const selectChatPhoto = (state) => state.chat.chatPhoto;
export const selectChatMembers = (state) => state.chat.chatMembers;

export default chatSlice.reducer;
