import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const LikedPosts = () => {
  const { id } = useParams();
  const { data: user } = useGetUserById(id || "");

  if (!user) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  console.log(user);
  return (
    <>
      {user.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={user.liked} showStats={false} />
    </>
  );
};

export default LikedPosts;
