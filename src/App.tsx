import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Articles from "./pages/Article/Articles";
import Layout from "./pages/Layout";
import ArticleDetails from "./pages/Article/ArticleDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
