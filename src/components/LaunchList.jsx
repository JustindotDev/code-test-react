import { motion } from "framer-motion";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const LaunchList = ({ launches, lastLaunchRef, search }) => {
  const [isViewing, setIsViewing] = useState(null);

  const handleToggle = (id) => {
    setIsViewing((prev) => (prev === id ? null : id));
  };

  const filteredLaunches = launches.filter((launch) =>
    launch.mission_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {filteredLaunches.map((launch, index) => {
        const isExpanded = isViewing === launch.flight_number;

        const launchDate = new Date(launch.launch_date_utc);
        const now = new Date();

        let status = "Upcoming";
        if (launch.launch_date_utc && launchDate <= now) {
          if (launch.launch_success === true) {
            status = "Success";
          } else if (launch.launch_success === false) {
            status = "Failed";
          }
        }

        const content = (
          <motion.div
            key={launch.flight_number}
            className="mb-6 p-4 bg-white shadow-lg rounded-lg text-black"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-lg font-bold flex items-center justify-between">
              {launch.mission_name}
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  status === "Success"
                    ? "bg-green-100 text-green-700"
                    : status === "Failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {status}
              </span>
            </h2>

            {isExpanded && (
              <div className="mt-4">
                <div className="mb-4 text-sm text-gray-500 font-medium space-x-2">
                  <span>
                    {launch.launch_year
                      ? `${
                          new Date().getFullYear() -
                          parseInt(launch.launch_year)
                        } years ago`
                      : "Year Unknown"}
                  </span>

                  {launch.links?.article_link ? (
                    <>
                      <span>|</span>
                      <a
                        href={launch.links.article_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Article
                      </a>
                    </>
                  ) : (
                    <span>| No Article</span>
                  )}

                  {launch.links?.video_link ? (
                    <>
                      <span>|</span>
                      <a
                        href={launch.links.video_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Video
                      </a>
                    </>
                  ) : (
                    <span>| No Video</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {launch.links?.mission_patch_small ? (
                    <img
                      src={launch.links.mission_patch_small}
                      alt={launch.mission_name}
                      className="w-full h-40 object-contain rounded"
                    />
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No mission patch available.
                    </div>
                  )}

                  <div>
                    {launch.details ? (
                      <p className="mt-2 text-md text-gray-700 text-justify">
                        {launch.details}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-gray-400 italic">
                        No description available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-start">
              <button
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: "#3b82f6" }}
                onClick={() => handleToggle(launch.flight_number)}
              >
                {isExpanded ? "Hide" : "View"}
              </button>
            </div>
          </motion.div>
        );

        return index === filteredLaunches.length - 1 ? (
          <div ref={lastLaunchRef}>{content}</div>
        ) : (
          content
        );
      })}
    </>
  );
};

export default LaunchList;
