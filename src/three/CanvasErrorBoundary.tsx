import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
}

// WebGL context creation can fail (old GPUs, sandboxed/headless browsers,
// too many contexts open). Catch it here so the rest of the app stays usable
// instead of the whole page unmounting.
export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('3D skin map failed to render:', error)
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-[13px] text-white/70 mb-1">3D rendering isn't available in this browser.</p>
          <p className="text-[11.5px] text-white/40">This view needs WebGL — try a different browser or device.</p>
        </div>
      )
    }
    return this.props.children
  }
}
