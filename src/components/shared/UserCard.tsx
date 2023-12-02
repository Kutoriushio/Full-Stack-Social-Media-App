import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  useFollowUser,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations";
import { useState } from "react";
import Loader from "./Loader";

type UserCardProps = {
  creator: Models.Document;
};

const UserCard = ({ creator }: UserCardProps) => {
  // followerId: string,   User who is following other user
  // followingId: string,   User who is being followed
  // followerArray: string[],   Being followed user's followers
  // followingArray: string[]  User's following users
  const { data: currentUser } = useGetCurrentUser();
  const followingList = currentUser?.following;
  const followerList = creator?.follower;
  const [following, setFollowing] = useState(
    currentUser?.following.includes(creator.$id)
  );

  const { mutate: follow, isPending: isFollowing } = useFollowUser();

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let followingArray = [...followingList];
    let followerArray = [...followerList];
    if (currentUser) {
      if (!following) {
        setFollowing(true);
        followingArray.push(creator.$id);
        followerArray.push(currentUser.$id);
      } else {
        setFollowing(false);
        followingArray = followingArray.filter((id) => id !== creator?.$id);
        followerArray = followerArray.filter((id) => id !== currentUser?.$id);
      }
      follow({
        followerId: currentUser?.$id,
        followingId: creator.$id,
        followerArray: followerArray,
        followingArray: followingArray,
      });
    }
  };
  return (
    <Link to={`/profile/${creator.$id}`} className="user-card">
      <img
        src={creator.imageUrl || "/assets/icons/placeholder.svg"}
        alt="creator"
        className="w-14 h-14 rounded-full object-cover object-top"
      />

      <div>
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {creator.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{creator.username}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        className={`shad-button_primary px-4 ${
          following ? "!bg-gray-500" : ""
        }`}
        onClick={handleFollow}
      >
        {isFollowing ? <Loader /> : following ? "Followed" : "Follow"}
      </Button>
    </Link>
  );
};

export default UserCard;
