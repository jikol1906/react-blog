import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router"; // or "react-router-dom"
import Login from "./pages/Login/Login";
import ArticleDetails from "./pages/Article/ArticleDetails";
import Articles from "./pages/Article/Articles";
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the guard

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            
            <Route element={<Layout />}>
              <Route path="/" element={<Articles />} />
              <Route path="/article/:id" element={<ArticleDetails />} />
            </Route>

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;