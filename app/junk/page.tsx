'use client';

import React from 'react';
import { theme } from '@/tailwind.config';
import { Header } from '../../components/styleGuide/Header';
import { Colors } from '@/components/styleGuide/Colors';
import { Typography } from '@/components/styleGuide/Typography';
import { Components } from '@/components/styleGuide/Components';
import { Inputs } from '@/components/styleGuide/Inputs';
import { Loading } from '@/components/styleGuide/Loading';
import { TabBar } from '@/components/styleGuide/TabBar';
import { Labels } from '@/components/styleGuide/Labels';
import { Notifications } from '@/components/styleGuide/Notifications';
import { Paginations } from '@/components/styleGuide/Pagination';
import { Tables } from '@/components/styleGuide/Table';
import { UploadFile } from '@/components/styleGuide/Fileupload';
import { RichTextEditor } from '@/components/styleGuide/RichTextEditor';
import { SlideOverGuide } from '@/components/styleGuide/SlideOverGuide';

const Index = () => {
  return (
    <div
      className={`font-${theme.fontFamily.albertSans} flex flex-col gap-8 pb-7 w-full`}
    >
      <Header />
      <Colors />
      <Typography />
      <Components />
      <Inputs />
      <Loading />
      <TabBar />
      <Labels />
      <UploadFile />
      <Notifications />
      <Paginations />
      <Tables />
      <SlideOverGuide />
      <RichTextEditor />
    </div>
  );
};

export default Index;
