import React, { useState, useEffect } from "react";

export const PostsList: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";
  const CACHE_NAME = "posts-cache";

  useEffect(() => {
    (async () => {
      try {
        // Check if Cache API is supported
        if ("caches" in window) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(API_ENDPOINT);

          if (cachedResponse) {
            // If cached data exists
            const cachedPosts = await cachedResponse.json();
            setPosts(cachedPosts);

            console.log("Loaded posts from cache");

            // Fetch fresh data in the background
            fetchAndCachedPosts(cache);
          } else {
            await fetchAndCachedPosts(cache);
          }
        } else {
          // If Cache API is not supported fetch directly
          const res = await fecth(API_ENDPOINT);
          const posts = await res.json();
          setPosts(posts);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchAndCachedPosts = async (cache) => {
    try {
      setIsLoading(true);
      const res = await fetch(API_ENDPOINT);
      const posts = await res.json();

      // Cache new response
      cache.put(API_ENDPOINT, new Response(JSON.stringify(posts)));

      setPosts(posts);
      console.log("Fetched and cached new posts");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      {posts.map((post) => {
        return (
          <div
            style={{
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "4px",
              padding: "1rem",
              maxWidth: "15rem",
            }}
            key={post.id}
          >
            <h4>
              {post.id}. {post.title}
            </h4>
            <div>{post.body}</div>
          </div>
        );
      })}
    </div>
  );
};
