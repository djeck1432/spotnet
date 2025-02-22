import { useState } from 'react'
import "./index.css"
import { cn } from "./utils/cn.ts";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={cn("flex", "items-center", "justify-center", "min-h-screen", "w-full", "bg-gray-800")}>
      <div className={cn("flex", "flex-col", "items-center", "justify-center", "gap-4")}>
        <h1 className={cn("font-bold", "text-3xl", "text-white")}>Margin frontend</h1>
        <button
          className={cn("bg-blue-400", "flex", "text-xl", "items-center", "justify-center", "w-full", "hover:shadow-lg hover:shadow-blue-200/20 hover:-translate-y-0.5 transition", "py-2", "rounded-xl", "text-white")}
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
