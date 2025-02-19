import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const ChatPage = () => {
    return ( 
        <>
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <h2 className="text-lg font-medium">
          Welcome to nest chat
        </h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create a chat
        </Button>
      </div>
    </>
     );
}
 
export default ChatPage;