import React, { useEffect, useState, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import ChatroomList from "./ChatroomList";
import { HiMenu, HiX, HiPlus, HiOutlinePhotograph } from "react-icons/hi";
import { RiGeminiFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import {
  sendMessage,
  sendAIReply,
  createChatroom,
  setSelectedChatroominstate,
} from "./chatroomsSlice";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const chatrooms = useSelector((state) => state.chatrooms?.list);
  const selectedChatroomsid = useSelector(
    (state) => state.chatrooms?.selectedChatroomId || null
  );

  const latestChatroom = chatrooms?.[chatrooms.length - 1];

  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied!");
  };
  const theme = useSelector((state) => state.theme.value);
  const sidebarRef = useRef(null);
  useEffect(() => {
    window.document.title = `Gemini AI`;
    const selectLatestChatroom = () => {
      const latestChatroomfromState = chatrooms.find(
        (room) => room.id === selectedChatroomsid
      );

      // console.log(latestChatroomfromState);
      setSelectedChatroom(latestChatroomfromState);
    };
    selectLatestChatroom();

    function handleClickOutside(e) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatrooms, selectedChatroomsid, theme, sidebarOpen, setSidebarOpen]);

  const expanded = sidebarOpen;

  const isDisabled = latestChatroom && latestChatroom.messages.length === 0;

  const latestChatId = chatrooms[chatrooms.length - 1]?.id;

  const sortedChatrooms = [...chatrooms].sort((a, b) => b.id - a.id);

  // console.log(sortedChatrooms);

  // console.log(chatrooms);
  // console.log(latestChatId);
  // console.log(latestChatroom);
  // console.log(selectedChatroom);

  const handleSelectChatroom = (room) => {
    setSelectedChatroom(room);
    setMessages([]);
  };

  const handleNewChatroom = () => {
    dispatch(createChatroom());
    setSidebarOpen(false);
    setSelectedChatroom(null);
  };

  const handleSendMessage = (selectedChatRoomIid) => {
    // console.log(selectedChatRoomIid);

    if (!input.trim() && !imagePreview)
      return toast.error("Please type something");
    setLoading(true);

    dispatch(setSelectedChatroominstate(selectedChatRoomIid));

    dispatch(sendMessage({ text: input }));

    setInput("");
    setImagePreview(null);

    setTimeout(() => {
      dispatch(sendAIReply({ text: "This is a simulated AI reply." }));
      setLoading(false);
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Reset file input so same file can be uploaded again if needed
    e.target.value = null;
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex h-screen">
        {/* Sidebar */}

        <div
          ref={sidebarRef}
          className={`
            overflow-auto bg-base-200 border-r border-base-300 transition-all duration-300 z-50 sm:block
            ${expanded ? "translate-x-0 w-64" : "-translate-x-full w-0  "}
            sm:translate-x-0
            ${!expanded && "sm:w-16"}
          `}
        >
          {/* Sidebar Header */}
          <div
            className={`flex items-center ${
              sidebarOpen ? "justify-end" : "justify-start"
            } p-2 border-b border-base-300 `}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-ghost btn-sm"
            >
              {sidebarOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>

          <div className="flex items-center p-2 border-b border-base-300 cursor-pointer hover:bg-base-300">
            <button
              onClick={() => {
                if (isDisabled) return;
                return handleNewChatroom();
              }}
              className="btn btn-ghost btn-sm flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled}
            >
              <HiPlus size={24} />
              {sidebarOpen && (
                <h1 className="ml-2 font-semibold text-lg  ">New Chat</h1>
              )}
            </button>
          </div>

          {/* Sidebar Content */}
          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto">
              <ChatroomList
                chatrooms={sortedChatrooms}
                onSelectChatroom={handleSelectChatroom}
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
              />
            </div>
          )}
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full max-w-3xl mx-auto">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {selectedChatroom ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-base-300 bg-base-200">
                <h2 className="text-lg font-bold">{selectedChatroom.name}</h2>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto  space-y-4">
                {loading ? (
                  <div className="flex self-center items-center justify-center gap-2 py-4">
                    <FaSpinner className="animate-spin text-gray-500 text-4xl" />
                    <span className="text-gray-600 font-large">
                      Gemini is typing...
                    </span>
                  </div>
                ) : selectedChatroom?.messages.length > 0 ? (
                  selectedChatroom?.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={` relative chat ${
                        msg.sender === "user" ? "chat-end" : "chat-start"
                      }`}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div
                        className={`chat-bubble ${
                          msg.sender === "user"
                            ? "chat-bubble-primary"
                            : "chat-bubble-secondary"
                        }`}
                      >
                        {msg.text}
                        {hoveredIndex === idx && (
                          <button
                            onClick={() => handleCopy(msg.text)}
                            className="absolute -top-2 -right-6 p-1 text-gray-400 hover:text-gray-700"
                            title="Copy"
                          >
                            <FiCopy size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No messages yet.</p>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              {selectedChatroom ? (
                "Select a chatroom to start chatting"
              ) : (
                <h1 className="text-2xl animate-pulse">Ask Something...</h1>
              )}
            </div>
          )}
          {/* Input */}

          <div className="p-4 border-t border-base-300 flex flex-col gap-2">
            {imagePreview && (
              <div className="relative group w-40 h-40">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  // className="absolute top-1 right-1 btn btn-sm btn-circle btn-ghost"
                  className={`absolute top-1 right-1 flex items-center px-1 py-2 rounded-md  ${
                    theme === "light"
                      ? "hover:bg-gray-300"
                      : "hover:bg-gray-800"
                  } opacity-0 group-hover:opacity-100 group-hover:bg-gray-500`}
                  title="Delete"
                  aria-label="Remove image"
                >
                  <MdDelete size={18} className="mr-1" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <label
                htmlFor="image-upload"
                className="btn btn-ghost btn-square"
              >
                <HiOutlinePhotograph size={24} />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto"; // Reset height before recalculating
                  e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    150
                  )}px`; // Max height = 150px
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(),
                  handleSendMessage(selectedChatroom?.id || latestChatId))
                }
                placeholder="Ask Gemini"
                className="input input-bordered flex-1 resize-none overflow-y-auto"
                style={{
                  minHeight: "40px", // starting height
                  maxHeight: "150px", // limit
                }}
              />

              <button
                onClick={() =>
                  handleSendMessage(selectedChatroom?.id || latestChatId)
                }
                className="btn btn-primary"
              >
                Send
              </button>
            </div>
          </div>
          <h1 className="text-center my-3">
            Gemini can make mistakes, so double-check it
          </h1>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
