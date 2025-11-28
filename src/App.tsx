// # path: src/App.tsx
import type React from "react";
import ModelEditor from "./components/ModelEditor";
import IconSparkles from "~icons/mdi/sparkles"; // unplugin-icons: Material Design "sparkles"

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
          <IconSparkles className="h-6 w-6 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              model.yaml HF Builder
            </span>
            <span className="text-xs text-muted-foreground">
              Swap LM Studio base models for any Hugging Face repo
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-4">
        <ModelEditor />
      </main>
    </div>
  );
};

export default App;
