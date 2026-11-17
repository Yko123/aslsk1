import { HashRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.tsx";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import Tutor from "./pages/Tutor.tsx";

// HashRouter (#/workspace) works on any static host with no server setup.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="workspace" element={<Tutor />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
