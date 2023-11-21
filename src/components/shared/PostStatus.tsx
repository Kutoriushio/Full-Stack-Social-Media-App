const PostStatus = () => {
  return (
    <div className="flex-between mt-1">
      <div className="flex gap-2">
        <img
          src="/assets/icons/like.svg"
          alt="like"
          width={20}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">0</p>
      </div>

      <img
        src="/assets/icons/save.svg"
        alt="save"
        width={20}
        className="cursor-pointer"
      />
    </div>
  );
};

export default PostStatus;
