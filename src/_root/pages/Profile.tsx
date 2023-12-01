import Loader from "@/components/shared/Loader";
import StatBlock from "@/components/shared/StatBlock";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { LikedPosts } from ".";
import GridPostList from "@/components/shared/GridPostList";

const Profile = () => {
  const { id } = useParams();
  const { data: user } = useGetUserById(id || "");
  const { user: currentUser } = useUserContext();
  const { pathname } = useLocation();

  if (!user) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="w-28 h-28 lg:w-36 lg:h-36 rounded-full"
        />
        <div className="flex flex-col justify-between md:mt-2">
          <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
            {user.name}
          </h1>
          <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
            @{user.username}
          </p>

          <div className="flex-center gap-8 xl:justify-start mt-6 flex-wrap">
            <StatBlock value={user.posts.length} label="Posts" />
            <StatBlock value={20} label="Followers" />
            <StatBlock value={20} label="Followings" />
          </div>

          <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
            {user.bio}
          </p>
        </div>
        <div className="flex justify-center gap-4 mt-2.5">
          <div className={`${user.$id !== currentUser.id && "hidden"}`}>
            <Link
              to={`/update-profile/${user.$id}`}
              className={`flex-center bg-dark-4 px-5 text-light-1 gap-2 rounded-lg h-12 ${
                user.$id !== currentUser.id && "hidden"
              }`}
            >
              <img src="/assets/icons/edit.svg" alt="edit" width={20} />
              <p className="flex whitespace-nowrap small-medium">
                Edit profile
              </p>
            </Link>
          </div>
          <div className={`${user.$id === currentUser.id && "hidden"}`}>
            <Button type="button" className="shad-button_primary px-5">
              Follow
            </Button>
          </div>
        </div>
      </div>

      <div className="flex max-w-5xl w-full">
        <Link
          to={`/profile/${id}`}
          className={`profile-tab rounded-l-lg ${
            pathname === `/profile/${id}` && "!bg-dark-3"
          }`}
        >
          <img src="/assets/icons/posts.svg" alt="posts" width={20} /> Posts
        </Link>
        <Link
          to={`/profile/${id}/liked-posts`}
          className={`profile-tab rounded-l-lg ${
            pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
          }`}
        >
          <img src="/assets/icons/like.svg" alt="like" width={20} />
          Liked Posts
        </Link>
      </div>

      <Routes>
        <Route
          index
          element={<GridPostList posts={user?.posts} showUser={false} />}
        />

        <Route path="/liked-posts" element={<LikedPosts />} />
      </Routes>
    </div>
  );
};

export default Profile;
