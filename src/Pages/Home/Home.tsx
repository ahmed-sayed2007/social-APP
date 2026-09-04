import AllPosts from "../../Components/AllPosts/AllPosts.tsx";
import CreatePost from "../../Components/CreatePost/CreatePost.tsx";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Home · LinkedPost</title>
      </Helmet>
      <div className="feed-container">
        <CreatePost />
        <AllPosts />
      </div>
    </>
  );
}
