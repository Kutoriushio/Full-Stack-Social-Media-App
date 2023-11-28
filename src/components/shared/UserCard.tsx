import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type UserCardProps = {
  creator: Models.Document;
};

const UserCard = ({ creator }: UserCardProps) => {
  return (
    <Link to={`/profile/${creator.$id}`} className="user-card">
      <img
        src={creator.imageUrl || "/assets/icons/placeholder.svg"}
        alt="creator"
        className="w-14 rounded-full"
      />

      <div>
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {creator.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{creator.username}
        </p>
      </div>
      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
