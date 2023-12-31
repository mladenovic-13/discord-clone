import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface ChannelIdPageProps {
  params: {
    channelId: string;
    serverId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const { channelId, serverId } = params;

  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect('/');

  return (
    <div className='flex h-full flex-col bg-white dark:bg-[#313338]'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
      />

      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type='channel'
        apiUrl='/api/messages'
        socketUrl='/api/socket/messages'
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        paramKey='channelId'
        paramValue={channel.id}
      />

      <ChatInput
        name={channel.name}
        type='channel'
        apiUrl='/api/socket/messages'
        query={{
          serverId,
          channelId,
        }}
      />
    </div>
  );
};

export default ChannelIdPage;
