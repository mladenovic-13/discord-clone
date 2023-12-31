'use client';

import { Member, Message, Profile } from '@prisma/client';
import { ChatWelcome } from '@/components/chat/chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2Icon, ServerCrashIcon } from 'lucide-react';
import { ElementRef, Fragment, useRef } from 'react';
import { ChatItem } from '@/components/chat/chat-item';
import { format } from 'date-fns';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useChatScroll } from '@/hooks/use-chat-scroll';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ apiUrl, paramKey, paramValue, queryKey });

  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  });

  useChatScroll({
    chatRef: chatRef,
    bottomRef: bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === 'loading') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <Loader2Icon className='my-4 h-7 w-7 animate-spin text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <ServerCrashIcon className='my-4 h-7 w-7 text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className='flex flex-1 flex-col overflow-y-auto py-4'>
      {!hasNextPage && <div className='flex-1' />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {hasNextPage && (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2Icon className='my-4 h-6 w-6 animate-spin text-zinc-500' />
          ) : (
            <button
              className='my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-400'
              onClick={() => fetchNextPage()}
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className='mt-auto flex flex-col-reverse'>
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                content={message.content}
                deleted={message.deleted}
                fileUrl={message.fileUrl}
                isUpdated={message.createdAt !== message.updatedAt}
                member={message.member}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
