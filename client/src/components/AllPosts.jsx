import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getPostStatus, selectAllPost } from "../features/postSlice";
import Post from "./Post";

function Posts() {
  const posts = useSelector(selectAllPost);
  const postStatus = useSelector(getPostStatus);
  const [searchPost, setSearchPost] = useState("");
  let allPost = [];
  if (postStatus === "loading") {
    return <div>Loading ...</div>;
  } else if (posts) {
    allPost = posts
      .slice()
      .sort((a, b) => b.postedOn.localeCompare(a.postedOn));
  }

  return (
    <Container>
      <div className="searchPost">
        <input
          type="text"
          placeholder="Search Post"
          name="searchPost"
          value={searchPost}
          onChange={(e) => setSearchPost(e.target.value)}
        />
      </div>
      <div className="allPost">
        {searchPost === ""
          ? allPost.map((post) => {
              return <Post post={post} key={post.postId} />;
            })
          : allPost
              .filter(
                (post) =>
                  post.content
                    .toLowerCase()
                    .includes(searchPost.toLowerCase()) ||
                  post.title.toLowerCase().includes(searchPost.toLowerCase())
              )
              .map((post) => {
                return <Post post={post} key={post.postId} />;
              })}
      </div>
    </Container>
  );
}

const Container = styled.section`
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin-right: 1rem;
  padding: 0.5rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  height: 83.5vh;
  .searchPost {
    margin-right: 2.5rem;
    & > input {
      width: 100%;
      border: 1px solid var(--border-color);
      background-color: var(--background-color1);
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      outline: none;
    }
  }
  .allPost {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.4rem;
      &-thumb {
        background-color: var(--scrollbar-thumb);
        border-radius: 1rem;
        width: 0.3rem;
      }
    }
  }
`;

export default Posts;
