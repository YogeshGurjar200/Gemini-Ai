import React, { useState, useEffect } from "react";
import { MdDelete, MdMoreVert } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteChatroomById } from "./chatroomsSlice";
import { useSelector } from "react-redux";
import { setSelectedChatroominstate } from "../chatrooms/chatroomsSlice";
import ChatroomSearch from "../../components/ChatroomSearch";
const ChatroomList = ({
  chatrooms,
  onSelectChatroom,
  setSidebarOpen,
  sidebarOpen,
}) => {
  const selectedChatroomsid = useSelector(
    (state) => state.chatrooms?.selectedChatroomId
  );
  const theme = useSelector((state) => state.theme?.value);

  const dispatch = useDispatch();

  const handleDeleteChatroom = (roomID) => {
    if (!window.confirm("are you sure to delete")) return;
    dispatch(deleteChatroomById(roomID));
  };
  const handleclick = (room) => {
    onSelectChatroom(room);
    setSidebarOpen(!sidebarOpen);
    dispatch(setSelectedChatroominstate(room.id));
    console.log(room);
  };

  // const chatrooms = useSelector((state) => state.chatrooms?.list);

  const [filteredChatrooms, setFilteredChatrooms] = useState(chatrooms);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredChatrooms(chatrooms);
    } else {
      const filtered = chatrooms.filter((room) =>
        room.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChatrooms(filtered);
    }
  };

  return (
    <aside className="w-full h-full p-4 bg-base-200">
      <ChatroomSearch onSearch={handleSearch} />
      <h2 className="text-xl font-bold my-4">Chatrooms</h2>
      {filteredChatrooms && filteredChatrooms.length > 0 ? (
        <div className="menu bg-base-100 rounded-box flex flex-col">
          {filteredChatrooms.map((room) => (
            <div
              key={room.id}
              className={`menu-item group  ${
                theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-900"
              } mt-1 flex flex-row flex-nowrap items-center justify-between relative rounded-lg px-2 py-1`}
            >
              {/* Chatroom name + last message */}
              <button
                onClick={() => handleclick(room)}
                className="flex flex-col items-start "
              >
                <p className="font-semibold truncate">{room.name}</p>
                <p className="text-xs opacity-70 truncate">
                  {room.lastMessage || "No messages yet"}
                </p>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChatroom(room.id);
                }}
                className={`flex items-center px-1 py-2 rounded-md  ${
                  theme === "light" ? "hover:bg-gray-300" : "hover:bg-gray-800"
                } opacity-0 group-hover:opacity-100`}
                title="Delete"
              >
                <MdDelete size={18} className="mr-1" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No chatrooms available.</p>
      )}
    </aside>
  );
};

export default ChatroomList;
