import { FaTimes } from "react-icons/fa";

const SearchBar = ({
  search,
  onSearchChange,
  onSearchCommit,
  onClearSearch,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchCommit(search.trim());
    }
  };

  return (
    <div className="flex items-center relative">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="w-90 mb-4  px-4 py-2 rounded  bg-white  shadow-md text-black"
      />

      {search && (
        <FaTimes
          onClick={onClearSearch}
          className="ml-2 text-red-500 absolute right-2 top-3"
        />
      )}
    </div>
  );
};

export default SearchBar;
