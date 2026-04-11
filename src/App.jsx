import React from 'react'
import GraphEngine from './components/GraphEngine'
import Topbar from './components/Topbar'

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#030303] text-white relative">
      <Topbar />

      {/* Controls hint */}
      <div className="absolute bottom-6 left-8 z-30 pointer-events-none">
        <p className="text-[10px] text-white/20 tracking-wider">
          Scroll to zoom · Drag to pan · Click nodes to explore
        </p>
      </div>

      <GraphEngine />
    </div>
  )
}

export default App
