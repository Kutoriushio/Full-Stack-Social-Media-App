import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { data: creators, isLoading } = useGetUsers();
  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex-start w-full max-w-5xl gap-3">
          <img
            src="/assets/icons/people.svg"
            width={36}
            alt="user"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        </div>

        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="">
                <UserCard creator={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
