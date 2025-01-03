import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const result = await appwriteService.allPosts();
      if (result) {
        // Update posts, ensuring no duplicates
        setPosts(result.documents);
      }
    } catch (err) {
      setError("Failed to fetch posts. Please try again.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Remove duplicates based on `$id`
  const removeDuplicates = (posts) => {
    const uniquePosts = new Map();
    posts.forEach((post) => uniquePosts.set(post.$id, post));
    return Array.from(uniquePosts.values());
  };

  // Update the list of posts (to avoid duplicates after editing)
  useEffect(() => {
    setPosts((prevPosts) => removeDuplicates(prevPosts));
  }, [posts]);

  if (error) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1 className="text-xl font-bold text-red-500">{error}</h1>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1 className="text-2xl font-bold">No posts available</h1>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
