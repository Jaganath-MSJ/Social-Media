import React, { useContext, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsError } from "../utils/ToastOptions.js";
import { calculateTimeAgo } from "../utils/DateFunction.js";
import { UserContext } from "../App.jsx";
import { getUserNameById } from "../features/userSlice.js";
import { addComment, selectPostById } from "../features/postSlice.js";
import Post from "../components/Post.jsx";

function SinglePost() {
  const dispatch = useDispatch();
  const { userIdFromToken, user } = useContext(UserContext);
  const { postId } = useParams();
  const [comment, setComment] = useState("");

  const post = useSelector((state) => selectPostById(state, postId));

  if (!post.postId) {
    return <div>Loading ...</div>;
  }

  const handleComment = async (e) => {
    e.preventDefault();
    if (comment.trim() !== "") {
      dispatch(
        addComment({
          details: {
            postId: post.postId,
            autorId: userIdFromToken,
            comment,
            createdOn: new Date().toISOString(),
          },
          token: user.accessToken,
        })
      );
    } else {
      toast.error("Please fill comments", toastOptionsError);
    }
  };

  return (
    <Container>
      <Post post={post} />
      <div className="comments">
        <div className="commentsFrom">
          <form>
            <textarea
              type="text"
              placeholder="Comments"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">
              <FiSend size="1.5rem" color="blue" onClick={handleComment} />
            </button>
          </form>
        </div>
        <div className="allComments">
          {post.comments.map((comment) => {
            return <Comment comment={comment} key={comment.createdOn} />;
          })}
        </div>
      </div>
      <ToastContainer />
    </Container>
  );
}

function Comment({ comment }) {
  const commentAutorName = useSelector((state) =>
    getUserNameById(state, comment.autorId)
  );
  return (
    <article>
      <div>
        <h4>{commentAutorName}</h4>
        <p>{calculateTimeAgo(comment.createdOn)}</p>
      </div>
      <p>{comment.comment}</p>
    </article>
  );
}

Comment.propTypes = {
  comment: PropTypes.object,
};

const Container = styled.section`
  margin: 0rem 3rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .comments {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .commentsFrom {
      form {
        display: flex;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        align-items: center;
        textarea {
          width: 100%;
          border: none;
          outline: none;
          margin: 0.5rem;
          height: 3rem;
          padding-right: 2rem;
        }
        button {
          margin-left: -2rem;
          margin-right: 0.5rem;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
        }
      }
    }
    .allComments {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: auto;
      height: 19rem;
      & > article {
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        padding: 0.5rem;
        & h4,
        p {
          margin: 0;
        }
        & > div {
          display: flex;
          & > p {
            margin-left: 0.5rem;
          }
        }
      }
      &::-webkit-scrollbar {
        width: 0.4rem;
        &-thumb {
          background-color: var(--scrollbar-thumb);
          border-radius: 1rem;
          width: 0.3rem;
        }
      }
    }
  }
  @media screen and (max-width: 550px) {
    margin: 0;
  }
`;

export default SinglePost;
