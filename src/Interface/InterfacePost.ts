export interface postInterface {
  body: string;
  bookmarked: boolean;
  commentsCount: string;
  createdAt: string;
  id: string;
  image: string;
  isShare: boolean;
  likes: [];
  likesCount: string;
  privacy: string;
  sharedPost: string;
  sharesCount: string;
  topComment: null | {
    commentCreator: null | { _id: string; name: string; username: string; photo: string };
    content: string;
    createdAt: string;
    likes: [];
    parentComment: string;
    post: string;
    _id: string;
  };
  user: { _id: string; name: string; username: string; photo: string };
  _id: string;
  isDetails: false;
}
