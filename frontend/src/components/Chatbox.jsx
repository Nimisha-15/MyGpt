import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const Chatbox = () => {
  const containerRef = useRef(null);

  const { selectedChats, theme, user, axios, token, setUser } = useAppContext();
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !user || !selectedChats._id || loading) return;

    const currentPrompt = prompt.trim();
    setPrompt("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: selectedChats._id,
          prompt: currentPrompt,
          isPublished,
        },
        { withCredentials: true }
      );

      if (data.success) {
        // Instant local append (optimistic update)
        setMessage((prev) => [
          ...prev,
          {
            role: "user",
            content: currentPrompt,
            timestamp: Date.now(),
            isImage: false,
          },
          data.reply, // Append AI reply immediately
        ]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChats && Array.isArray(selectedChats.messages)) {
      setMessage(selectedChats.messages);
    } else {
      setMessage([]);
    }
  }, [selectedChats]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [message]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-14">
      {/* CHAT MESSAGES  */}
      <div ref={containerRef} className="flex-1 mb-4 overflow-y-scroll">
        {message.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-1 text-primary ">
            <img
              className="w-full max-w-50 sm:max-w-62"
              src={assets.custom_logo}
              alt="Logo"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything ...
            </p>
          </div>
        ) : (
          message.map((msg, index) => <Message key={index} message={msg} />)
        )}

        {/* Move Loader inside scroll container */}
        {loading && (
          <div className="loader flex items-center gap-1.5 p-4">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div
              className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto ">
          <p className="text-xs ">Publish generated image to Community </p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}
      {/* prompt input box */}
      <form
        onSubmit={onSubmit}
        className="bg-[#75a4add8]/20 dark:bg-[#58379]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          onChange={(e) => {
            setMode(e.target.value);
          }}
          value={mode}
          className="text-sm pl-2 pr-2 outline-none"
        >
          <option className="drak:bg-purple-900" value="text">
            Text{" "}
          </option>
          <option className="drak:bg-purple-900" value="image">
            Image{" "}
          </option>
        </select>
        <input
          type="text"
          placeholder="Write the prompt..."
          className="flex-1 w-full text-sm  outline-none "
          required
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
        <button type="submit" disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className="w-8 cursor-pointer "
            alt=""
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
