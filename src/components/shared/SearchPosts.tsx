import GridPostList from "./GridPostList";
import Loader from "./Loader";

type SearchResultProps = {
  isSearching: boolean;
  searchPosts: any;
};

const SearchPosts = ({ isSearching, searchPosts }: SearchResultProps) => {
  if (isSearching) {
    return <Loader />;
  }
  if (searchPosts && searchPosts.documents.length > 0) {
    return <GridPostList posts={searchPosts.documents} />;
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchPosts;
