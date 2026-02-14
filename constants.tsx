
import React from 'react';
import { 
  Type, 
  Code, 
  Image as ImageIcon, 
  ShieldCheck, 
  Sparkles,
  CaseUpper,
  FileJson,
  Hash,
  Scissors
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Transform text between UPPER, lower, camelCase, and more instantly.',
    icon: <CaseUpper className="w-6 h-6" />,
    category: 'Text'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Prettify, minify, or validate your JSON code for better readability.',
    icon: <FileJson className="w-6 h-6" />,
    category: 'Dev'
  },
  {
    id: 'password-gen',
    name: 'Safe Password',
    description: 'Generate high-entropy, secure passwords to keep your accounts safe.',
    icon: <ShieldCheck className="w-6 h-6" />,
    category: 'Security'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder',
    description: 'Encode or decode URLs safely for use in web applications and APIs.',
    icon: <Hash className="w-6 h-6" />,
    category: 'Dev'
  },
  {
    id: 'text-summarizer',
    name: 'AI Summarizer',
    description: 'Condense long articles or documents into concise bullet points.',
    icon: <Sparkles className="w-6 h-6 text-blue-500" />,
    category: 'AI'
  },
  {
    id: 'svg-optimizer',
    name: 'SVG Optimizer',
    description: 'Reduce SVG file size without losing quality for faster loading.',
    icon: <Scissors className="w-6 h-6" />,
    category: 'Images'
  }
];
