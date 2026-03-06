import ChatPanel from '@/components/ChatPanel';

export const metadata = {
  title: 'Chat | WaferWiki v2'
};

export default function ChatPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <ChatPanel />
    </div>
  );
}
