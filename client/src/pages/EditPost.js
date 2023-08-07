import React, { useContext, useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsError, toastOptionsSuccess } from "../utils/ToastOptions";
import {
  deletePost,
  getPostError,
  getPostStatus,
  selectPostById,
  updatePost,
} from "../features/postSlice";
import { UserContext } from "../App";

function EditPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const post = useSelector((state) => selectPostById(state, postId));
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const postStatus = useSelector(getPostStatus);
  const postError = useSelector(getPostError);

  const handleUpdatePost = (e) => {
    e.preventDefault();
    if (title !== "" && content !== "") {
      dispatch(
        updatePost({
          details: {
            postId: post.postId,
            title,
            content,
            editor: post.autorId,
          },
          token: user.accessToken,
        })
      );
      if (postStatus === "failed") {
        toast.warning(postError, toastOptionsError);
      } else {
        toast.success("Post updated successfully", toastOptionsSuccess);
      }
      navigate("/");
    } else {
      toast.error("Please fill all the fields", toastOptionsError);
    }
  };

  const handleDeletePost = (e) => {
    e.preventDefault();
    dispatch(
      deletePost({
        details: { postId: post.postId, editor: post.autorId },
        token: user.accessToken,
      })
    );
    if (postStatus === "failed") {
      toast.warning(postError, toastOptionsError);
    } else {
      toast.success("Post deleted successfully", toastOptionsSuccess);
    }
    navigate("/");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleEmojiClick = (emoji) => {
    let des = content;
    des += emoji.emoji;
    setContent(des);
  };

  return (
    <Container>
      <div className="editForm">
        <h1>Edit Post</h1>
        <form onSubmit={handleUpdatePost}>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value.trim())}
            placeholder="Title"
          />
          <textarea
            type="text"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <div>
            <GrEmoji
              className="emojiImg"
              size="2rem"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <Picker
                onEmojiClick={handleEmojiClick}
                height="325px"
                width="250px"
              />
            )}
            <div className="buttons">
              <button
                className="deleteBnt"
                type="delete"
                onClick={handleDeletePost}
              >
                Delete Post
              </button>
              <button
                className="cancelBnt"
                type="cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button className="updateBnt" type="submit">
                Update Post
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.section`
  height: 70vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .editForm {
    max-width: 35rem;
    width: 100%;
    padding: 2rem;
    padding-top: 1rem;
    border-radius: 1rem;
    background: var(--background-color4);
    h1 {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      input,
      textarea {
        margin: 0.3rem 0;
        outline: none;
        border: 1px solid var(--border-color);
        padding: 0.5rem;
        height: 1.5rem;
        border-radius: 0.2rem;
        font-size: 15px;
      }
      textarea {
        height: 10rem;
        &::-webkit-scrollbar {
          width: 0.2rem;
          &-thumb {
            background-color: var(--scrollbar-thumb);
            width: 0.1rem;
            border-radius: 1rem;
          }
        }
      }
      & > div {
        display: flex;
        justify-content: space-between;
        .emojiImg {
          cursor: pointer;
          margin: 0.5rem;
          &:hover {
            color: var(--background-color2);
          }
        }
        .EmojiPickerReact {
          position: absolute;
          top: 9rem;
          left: 30rem;
          box-shadow: 0 5px 10px var(--border-color);
          .epr-body::-webkit-scrollbar {
            width: 5px;
            &-thumb {
              background-color: var(--scrollbar-thumb);
            }
          }
          .epr-search-container {
            input {
              background-color: var(--background-color1);
              border: 1px solid var(--border-color);
            }
          }
        }
        .buttons {
          display: flex;
          justify-content: end;
          gap: 1rem;
          & > button {
            border: none;
            width: 7rem;
            height: 2rem;
            font-size: 1.1rem;
            background-color: var(--background-color2);
            padding: 0.3rem 0.6rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: 0.3s ease-in-out;
            &:hover {
              box-shadow: 2px 2px 5px black;
            }
          }
          .deleteBnt {
            background-color: rgba(246, 55, 55, 0.885);
          }
        }
      }
    }
  }
`;

export default EditPost;
