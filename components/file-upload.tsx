'use client';

import { type FileRouterEndpoints } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';

import '@uploadthing/react/styles.css';
import { FileIcon, XIcon } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: FileRouterEndpoints;
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split('.').pop();

  if (value && fileType !== 'pdf')
    return (
      <div className='relative h-20 w-20'>
        <Image
          fill
          src={value}
          alt='Upload'
          className='rounded-full object-cover'
        />
        <button className='absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm'>
          <XIcon className='h-4 w-4' onClick={() => onChange('')} />
        </button>
      </div>
    );

  if (value && fileType === 'pdf') {
    return (
      <div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
        >
          {value}
        </a>
        <button className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'>
          <XIcon className='h-4 w-4' onClick={() => onChange('')} />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error) => console.log(error)}
    />
  );
};
