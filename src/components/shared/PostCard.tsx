import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStatus from "./PostStatus";
import { useUserContext } from "@/context/AuthContext";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-5">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl || "assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 rounded-full"
            />
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${post.creator.$id}`}>
              <p className="base-medium lg:body-bold text-light-1">
                {post.creator.name}
              </p>
            </Link>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              <p>•</p>
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id} && "hidden"`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} />
        </Link>
      </div>

      <div className="small-medium lg:base-medium py-5">
        <p>{post.caption}</p>
        <ul className="flex gap-1 mt-2">
          {post?.tags.map((tag: string, index: string) => (
            <li key={`${tag}${index}`} className="text-light-3 small-regular">
              #{tag}
            </li>
          ))}
        </ul>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="flex justify-center">
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post-image"
            className="post-card_img"
          />
        </div>
      </Link>

      <PostStatus post={post} />
    </div>
  );
};

export default PostCard;
