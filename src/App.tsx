import { useState } from "react";
import { TaskProvider } from "./context/TaskContext";
import { AppLayout } from "./components/layout/AppLayout";
import { TaskTable } from "./components/tracker/TaskTable";
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard";
import { HistoryView } from "./components/tracker/HistoryView";


// Placeholder components until we implement them


function App() {
  const [view, setView] = useState<"tracker" | "analytics" | "history">("tracker");

  return (
    <TaskProvider>
      <AppLayout currentView={view} onChangeView={setView}>
        {view === "tracker" && <TaskTable />}
        {view === "analytics" && <AnalyticsDashboard />}
        {view === "history" && <HistoryView />}
      </AppLayout>
    </TaskProvider>
  );
}

export default App;
