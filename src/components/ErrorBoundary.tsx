import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 p-6 text-center bg-cream">
          <p className="text-2xl">💥</p>
          <p className="font-semibold text-stone-800">Er ging iets mis</p>
          <pre className="max-w-xs overflow-auto rounded-lg bg-stone-100 p-3 text-left text-xs text-stone-600">
            {this.state.error.message}
          </pre>
          <button
            className="rounded-lg bg-stone-800 px-4 py-2 text-sm text-white"
            onClick={() => this.setState({ error: null })}
          >
            Probeer opnieuw
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
