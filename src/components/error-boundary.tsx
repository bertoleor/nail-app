"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  readonly state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-muted mb-4">
                Algo salió mal en este componente
              </p>
              <button
                className="px-4 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80"
                onClick={() => { this.setState({ hasError: false }); }}
              >
                Reintentar
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
