import { RotateCcw, Search } from "lucide-react";
import React from "react";

const VideoElement = () => {
  return (
    <div className="w-full flex justify-center px-6 py-4 md:px-12 bg-white dark:bg-black min-h-auto">
      <div className="w-full max-w-6xl bg-white dark:bg-black rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-gray-300 dark:shadow-black">
        <div className="flex flex-col sm:flex-row px-4 py-2 bg-gray-200 dark:bg-[#333333] rounded-t-xl">
          <div className="md:flex flex-row gap-2 items-center mb-2 sm:mb-0 hidden">
            <span className="bg-red-500 h-3 w-3 rounded-full"></span>
            <span className="bg-yellow-500 h-3 w-3 rounded-full"></span>
            <span className="bg-green-500 h-3 w-3 rounded-full"></span>
          </div>
          <div className="w-full sm:w-[90%] flex justify-center">
            <div className="bg-gray-100 dark:bg-[#222222] w-full max-w-sm py-1 rounded-lg px-3 flex flex-row gap-2 items-center text-sm">
              <Search className="text-black dark:text-white" />
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-black dark:text-white">
                http://share-snippets.com
              </span>
              <RotateCcw className="text-black dark:text-white" />
            </div>
          </div>
        </div>
        <div className="relative w-full">
          <video
            src="https://res.cloudinary.com/dynfrkted/video/upload/v1752901775/464699431-88acb765-d329-4908-90a2-6744473fa11e_online-video-cutter.com_wvpnur.mp4"
            controls
            className="w-full h-full"
          ></video>
        </div>
      </div>
    </div>
  );
};

export default VideoElement;
