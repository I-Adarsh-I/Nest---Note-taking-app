"use client"

import MessageList from "../../_components/MessageList/MessageList";
import { ChatInput } from "../../_components/ChatInput/ChatInput";

const ChatPage = () => {
    return ( 
        <>
      <div className="h-full flex flex-col items-center justify-center">
      <div className="flex flex-col gap-2 h-full w-full my-4 mt-12 justify-center items-center">
            <MessageList />
            <ChatInput onSendMessage={() => {}}/>
        </div>
      </div>
    </>
     );
}
 
export default ChatPage;