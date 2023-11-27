import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchPosts from "@/components/shared/SearchPosts";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetInfinitePosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();
  const debouncedSearch = useDebounce(searchValue, 300);
  const { data: searchPosts, isFetching: isSearching } =
    useSearchPosts(debouncedSearch);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (hasNextPage && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts) {
    return <Loader />;
  }

  const shouldShowSearchResults = debouncedSearch !== "";

  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="w-full h3-bold md:h2-bold">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" alt="search" width={24} />
          <Input
            type="text"
            placeholder="Search"
            value={searchValue}
            className="explore-search"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-between gap-3 bg-dark-3 rounded-xl px-3 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img src="/assets/icons/filter.svg" alt="filter" width={20} />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-ful max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchPosts isSearching={isSearching} searchPosts={searchPosts} />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of Posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item?.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
