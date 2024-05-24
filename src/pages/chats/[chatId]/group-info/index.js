import { ChatLayout } from "@/page-components/layouts";
import GroupInfo from "@/page-components/components/ChatComponents/ChatPageGroup";
import { useRouter } from "next/router";

const ChatPageIndex = () => {
  const router = useRouter();
  const { chatId } = router.query;
  return <GroupInfo chatId={chatId} />;
};

ChatPageIndex.Layout = ChatLayout;

export default ChatPageIndex;
