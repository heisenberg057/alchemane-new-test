"use client";

import React from 'react';
import { RichTextBlock } from './RichTextBlock';

interface TextBlockProps {
  id: string;
  text?: string;
  fontSize?: string;
  color?: string;
}

export function TextBlock({ id, text, fontSize, color }: TextBlockProps) {
  return <RichTextBlock id={id} text={text} fontSize={fontSize} color={color} />;
}
