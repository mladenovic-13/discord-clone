import { HashIcon, MenuIcon } from 'lucide-react';
import { MobileToggle } from '@/components/mobile-toggle';
import { UserAvatar } from '@/components/user-avatar';
import { SocketIndicator } from '@/components/socket-indicator';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className='flex h-12 items-center border-b-2 border-neutral-200 px-3 text-base font-semibold dark:border-neutral-800'>
      <MobileToggle serverId={serverId} />

      {type === 'channel' && (
        <HashIcon className='mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400' />
      )}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className='mr-2 h-8 w-8 md:h-8 md:w-8' />
      )}
      <p className='text-base font-semibold text-black dark:text-white'>
        {name}
      </p>
      <div className='ml-auto flex items-center'>
        <SocketIndicator />
      </div>
    </div>
  );
};
