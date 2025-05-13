import React, { useEffect, useState, useRef, useCallback } from "react";
import Loading from "./components/Loading.jsx";
import LaunchList from "./components/LaunchList.jsx";
import SearchBar from "./components/SearchBar.jsx";

const API_URL = "https://api.spacexdata.com/v3/launches";

function App() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [page, setPage] = useState(0);

  const loaderRef = useRef();

  const sortLaunches = (launchesToSort) => {
    return launchesToSort.sort((a, b) => {
      const getStatus = (launch) => {
        const launchDate = new Date(launch.launch_date_utc);
        const now = new Date();

        if (!launch.launch_date_utc || launchDate > now) {
          return "Upcoming";
        }

        if (launch.launch_success === true) {
          return "Success";
        } else if (launch.launch_success === false) {
          return "Failed";
        }

        return "Unknown";
      };

      const statusA = getStatus(a);
      const statusB = getStatus(b);

      const statusOrder = {
        Upcoming: 0,
        Success: 1,
        Failed: 2,
        Unknown: 3,
      };

      if (statusOrder[statusA] !== statusOrder[statusB]) {
        return statusOrder[statusA] - statusOrder[statusB];
      }

      if (statusA === "Upcoming" && statusB === "Upcoming") {
        const dateA = new Date(a.launch_date_utc);
        const dateB = new Date(b.launch_date_utc);
        return dateA - dateB;
      }

      const dateA = new Date(a.launch_date_utc || 0);
      const dateB = new Date(b.launch_date_utc || 0);
      return dateB - dateA;
    });
  };

  const fetchLaunches = async (reset = false) => {
    setLoading(true);
    const limit = 10;
    const offset = reset ? 0 : page * limit;

    const res = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    const sortedData = sortLaunches(data);

    if (reset) {
      setLaunches(sortedData);
    } else {
      setLaunches((prev) => sortLaunches([...prev, ...sortedData]));
    }

    setHasMore(data.length > 0);
    setLoading(false);
    if (!reset) setPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchLaunches(true);
  }, []);

  const observer = useRef();
  const lastLaunchRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchLaunches();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const filteredLaunches = launches.filter((launch) =>
    launch.mission_name.toLowerCase().includes(committedSearch.toLowerCase())
  );

  const clearSearch = () => {
    setSearch("");
    setCommittedSearch("");
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center p-4 bg-gray-100">
      <SearchBar
        search={search}
        onSearchChange={setSearch}
        onSearchCommit={setCommittedSearch}
        onClearSearch={clearSearch}
      />

      <div
        className="w-full max-w-xl h-[80vh] overflow-y-auto p-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
        }}
      >
        <LaunchList
          launches={filteredLaunches}
          lastLaunchRef={lastLaunchRef}
          search={committedSearch}
        />

        {loading && <Loading />}
        {!hasMore && !loading && (
          <p className="text-center text-gray-400 mt-4">End of List.</p>
        )}
      </div>
    </div>
  );
}

export default App;
