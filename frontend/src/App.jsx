import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import Posts from "./pages/Posts";
import Addpost from "./pages/Addpost"
import PostDetail from "./pages/PostDetail";
import UserPosts from "./pages/Userpost";
import Footer from "./pages/Footer";
import Layout from "./partial/layout";
import About from "./pages/About";
import EditPost from "./pages/Editpost"







function App() {
  return (
    <BrowserRouter>
      <Layout />



      <Routes>
        <Route path="/posts" element={<Posts />} />
        <Route path="/" element={<Navigate to="/posts" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/posts/:id" element={<PostDetail />} />

        <Route path="/posts/user/:userId" element={<UserPosts />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />





        <Route path="/addpost" element={<Addpost />} />


      </Routes>
      <Footer />

    </BrowserRouter>
  );
}

export default App;