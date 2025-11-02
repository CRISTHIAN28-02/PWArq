import { HashRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";

export default function App() {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  );
}
