import React, { useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { BiSolidUser, BiSolidDislike } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { FaComments, FaRetweet, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addEmotes, rewteetPost } from "../features/postSlice";
import { calculateTimeAgo, formatDateAndTime } from "../utils/DateFunction.js";
import { UserContext } from "../App";
import { getUserNameById } from "../features/userSlice";
import ROLE from "../utils/Role";

function Post({ post }) {
  const dispatch = useDispatch();
  const { userIdFromToken, user, userRoleFromToken } = useContext(UserContext);

  const autorName = useSelector((state) =>
    getUserNameById(state, post.autorId)
  );

  const handleEmote = async ({ emote, e }) => {
    e.preventDefault();
    dispatch(
      addEmotes({
        details: { postId: post.postId, emote, autorId: userIdFromToken },
        token: user.accessToken,
      })
    );
  };
  const rewteetByName = useSelector((state) =>
    getUserNameById(state, post.retweetBy)
  );
  return (
    <Container>
      {post.isRetweet && (
        <p className="retweetBy">
          <Link to={`/user/${post.retweetBy}`}>
            <FaRetweet className="retweetImg" /> Retweet by{" "}
            {userIdFromToken === post.retweetBy ? "You" : rewteetByName}
          </Link>
        </p>
      )}
      <div className="postHeader">
        <Link to={`/user/${post.autorId}`}>
          <BiSolidUser size="1.5rem" className="userImg" />
          <h2>{autorName}</h2>
        </Link>
        <p>{calculateTimeAgo(post.postedOn)}</p>
        {(post.autorId === userIdFromToken ||
          userRoleFromToken === ROLE.ADMIN ||
          userRoleFromToken === ROLE.EDITOR) &&
          !post.isRetweet && (
            <Link to={`/post/edit/${post.postId}`}>
              <FaEdit size="1.2rem" className="editImg" />
            </Link>
          )}
      </div>
      <Link to={`/post/${post.postId}`}>
        <div className="postDetails">
          <h3>{post.title}</h3>
          <p>{post.content} </p>
          <p>{formatDateAndTime(post.postedOn)}</p>
        </div>
      </Link>
      <div className="postEmotes">
        <p>
          <AiFillHeart
            size="1.5rem"
            onClick={(e) => handleEmote({ emote: "like", e })}
            color={
              post.like.includes(userIdFromToken) ? "red" : "rgb(173, 173, 173)"
            }
          />
          <span>{post.like.length}</span>
        </p>
        <p>
          <BiSolidDislike
            size="1.5rem"
            onClick={(e) => handleEmote({ emote: "disLike", e })}
            color={
              post.disLike.includes(userIdFromToken)
                ? "red"
                : "rgb(173, 173, 173)"
            }
          />
          <span>{post.disLike.length}</span>
        </p>
        <p>
          <FaComments size="1.5rem" />
          <span>{post.comments.length}</span>
        </p>
        <p>
          <FaRetweet
            size="1.5rem"
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                rewteetPost({
                  details: {
                    postId: post.postId,
                    autorId: post.autorId,
                    title: post.title,
                    content: post.content,
                    postedOn: new Date().toISOString(),
                    retweetBy: userIdFromToken,
                  },
                  token: user.accessToken,
                })
              );
            }}
            color={
              post.share.includes(userIdFromToken)
                ? "dodgerblue"
                : "rgb(173, 173, 173)"
            }
          />
          <span>{post.share.length}</span>
        </p>
      </div>
    </Container>
  );
}

const Container = styled.article`
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  .retweetBy {
    margin: -0.3rem 0 0.3rem 0;
    transition: 0.3s ease-in-out;
    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .retweetImg:hover {
    }
  }
  .postHeader {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    a {
      display: flex;
      gap: 1rem;
    }
    .userImg {
      padding: 0.5rem;
      background-color: var(--background-color2);
      color: white;
      border-radius: 2rem;
    }
    & h2,
    & p {
      margin: 0;
    }
    .editImg:hover {
      transition: color 0.3s;
      color: var(--background-color2);
    }
  }
  .postDetails {
    margin: 0.5rem;
    & > * {
      margin: 0.5rem 0;
    }
  }
  .postEmotes {
    display: flex;
    gap: 0.5rem;
    p {
      margin: 0;
      svg {
        cursor: pointer;
      }
      span {
        margin-left: 0.2rem;
      }
    }
  }
`;

Post.propTypes = {
  post: PropTypes.object,
};

export default Post;
