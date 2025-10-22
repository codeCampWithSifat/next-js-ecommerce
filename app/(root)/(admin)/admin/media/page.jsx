"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Media from "@/components/Application/Admin/Media";

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: "",
    label: "Media",
  },
];

const MediaPage = () => {
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`
    );

    return response;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });

  console.log("data", data);

  const handleDelete = () => {
    console.log("Button Clicked");
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <div className="flex items-center justify-between w-full">
        <h4 className="font-semibold text-xl uppercase">Media</h4>
        <div className="flex items-center gap-5 ">
          <UploadMedia />
        </div>
      </div>

      <div>
        <CardContent>
          {status === "pending" ? (
            <div>Loading...</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-5 mb-5 mt-20">
              {data?.pages?.map((page, index) => (
                <React.Fragment key={index}>
                  {page?.mediaData?.map((media) => (
                    <Media
                      key={media._id}
                      media={media}
                      handleDelete={handleDelete}
                      deleteType={deleteType}
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default MediaPage;
