const host =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : process.env.REACT_APP_BACKEND_URL;

export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const logoutRoute = `${host}/api/auth/logout`;
export const isUserAuthRoute = `${host}/api/auth/isUserAuth`;
export const refreshTokenRoute = `${host}/api/auth/refresh_token`;
export const getAllUsersRoute = `${host}/api/auth/getAllUsers`;
export const getUserRoute = `${host}/api/auth/getUser`;
export const updateUserRoute = `${host}/api/auth/updateUser`;
export const deactivateUserRoute = `${host}/api/auth/deactivateUser`;

export const getAllPostsRoute = `${host}/api/post/getAllPost`;
export const addPostRoute = `${host}/api/post/addPost`;
export const addEmotesRoute = `${host}/api/post/addEmotes`;
export const addCommentsRoute = `${host}/api/post/addComments`;
export const updatePostRoute = `${host}/api/post/updatePost`;
export const deletePostRoute = `${host}/api/post/deletePost`;
export const retweetPostRoute = `${host}/api/post/retweetPost`;
