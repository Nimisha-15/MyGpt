import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";

const Message = ({ message }) => {
  if (!message || typeof message !== "object") {
    return null;
  }
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);
  return (
    <div>
      {/* {console.log(message.role)}; */}
      {message.role === "user" ? (
        <div className="flex items-start justify-end my-4 gap-2">
          <div className="flex flex-col gap-2 p-2 px-4 bg-slate-100 dark:bg-[#57317C] border border-[#80609F]/30 rounded-md max-w-2xl">
            <p className="text-sm dark:text-primary">{message.content}</p>
            <span className="text-sm text-gray-400 dark:text-[#4d95aa]">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img src={assets.user_icon} className="w-8 rounded-full" alt="" />
        </div>
      ) : (
        <div className="inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#4d95ab]/30 border border-[#80609F]/30 rounded-md my-4">
          {message.isImage ? (
            <img
              src={message.content}
              className="w-full max-w-md mt-2 rounded-md "
              alt=""
            />
          ) : (
            <div className="text-sm dark:text-primary reset-tw">
              <Markdown>{message.content}</Markdown>
            </div>
          )}
          <span>{moment(message.timestamp).fromNow()}</span>
        </div>
      )}
    </div>
  );
};

export default Message;
