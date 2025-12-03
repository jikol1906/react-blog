import { AuthProvider } from "./context/AuthContext"; // Import the provider
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login/Login";
import ArticleDetails from "./pages/Article/ArticleDetails";
import Articles from "./pages/Article/Articles";
import Layout from "./pages/Layout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Articles />} />
            <Route path="/article/:id" element={<ArticleDetails />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
