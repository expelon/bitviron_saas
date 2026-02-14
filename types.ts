// Fix: Import React to resolve React namespace error
import React from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'Text' | 'Dev' | 'Images' | 'Security' | 'AI';
}

export enum AppSection {
  Home = 'home',
  Tools = 'tools',
  About = 'about',
  Pricing = 'pricing'
}