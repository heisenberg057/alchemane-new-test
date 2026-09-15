"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  blockType?: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Per-block error boundary.
 * If a single block throws during render, only that block shows an inline error
 * card — the rest of the canvas stays fully interactive.
 */
export class BlockErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[VisualBuilder] Block render error (type="${this.props.blockType ?? 'unknown'}"):`,
        error,
        info.componentStack,
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-start gap-2 p-3 rounded border border-destructive/40 bg-destructive/5 text-destructive text-xs">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              Block could not be rendered
              {this.props.blockType ? ` (${this.props.blockType})` : ''}
            </p>
            <p className="text-muted-foreground mt-0.5 font-mono">{this.state.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
