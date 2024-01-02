import { ChatSidebar } from "components/ChatSidebar";
import { streamReader } from "openai-edge-stream";
import { useState } from "react";
import { Message } from "components/Message";
import { v4 as uuid } from "uuid";
import Head from "next/head";

export default function ChatPage() {
  const [incommingMessage, setIncommingMessage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [newChatMessages, setNewChatMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* setNewChatMessages(prev =>{
      const newChatMessages = [...prev, {
        _id: uuid(),
        role:  'user',
        content: messageText
      }];
    }) */
    console.log("MESSAGETEXT: ", messageText);
    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ "message": messageText })
    });
    
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    await streamReader(reader, async(message) => {
      setIncommingMessage(s => `${s}${message.content}`)
    })
  }

  return (
    <>
      <Head>
        <title>New Chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="bg-gray-700 flex flex-col">
          <div className="flex-1 text-white">
            {/* {newChatMessages.map((message) =>(
              <Message key={message._id} role={message.role} content={message.content} />
            ))}
            <Message role="assistent" content={incommingMessage} /> */}
            {incommingMessage}
          </div>
          <footer className="bg-gray-800 p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2">
                <textarea value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Send message..." className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 bg-gray-600 focus:outline focus:outline-emerald-500" />
                <button type="submit" className="btn">
                  Send
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  )
}