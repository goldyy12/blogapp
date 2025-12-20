import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import Posts from "./pages/Posts";
import Addpost from "./pages/Addpost"
import PostDetail from "./pages/PostDetail";
import UserPosts from "./pages/Userpost";
import Footer from "./pages/Footer";
import Layout from "./partial/layout";
import About from "./pages/About";







function App() {
  return (
    <BrowserRouter>
      <Layout />



      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/user/:userId" element={<UserPosts />} />
        <Route path="/about" element={<About />} />




        <Route path="/addpost" element={<Addpost />} />


      </Routes>
      <Footer />

    </BrowserRouter>
  );
}

export default App;