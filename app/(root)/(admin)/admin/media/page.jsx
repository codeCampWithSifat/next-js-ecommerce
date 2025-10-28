"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoutes";
import axios from "axios";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Media from "@/components/Application/Admin/Media";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import ButtonLoading from "@/components/Application/ButtonLoading";

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

  const [selectAll, setSelectAll] = useState(false);

  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchParams) {
      const trashOf = searchParams.get("trashof");
      setSelectedMedia([]);
      if (trashOf) {
        setDeleteType("PD");
      } else {
        setDeleteType("SD");
      }
    }
  }, [searchParams]);

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

  const deleteMutation = useDeleteMutation("media-data", "/api/media/delete");

  const handleDelete = (ids, deleteType) => {
    console.log("Button Clicked");
    let c = true;
    if (deleteType === "PD") {
      c = confirm("Are you sure . You want to delete the data permanently");
    }
    if (c) {
      deleteMutation.mutate({ ids, deleteType });
    }
    setSelectAll(false);
    setSelectedMedia([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectAll) {
      const ids = data.pages.flatMap((page) =>
        page.mediaData.map((media) => media._id)
      );
      setSelectedMedia(ids);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll]);

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <div className="flex items-center justify-between w-full">
        <h4 className="font-semibold text-xl uppercase">
          {deleteType === "SD" ? "Media" : "Media Trash"}
        </h4>
        <div className="flex  gap-5 ">
          {deleteType === "SD" && (
            <UploadMedia isMultiple={true} queryClient={queryClient} />
          )}
          <div className="flex  gap-3">
            {deleteType === "SD" ? (
              <Button type="button" variant="destructive">
                <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>Trash</Link>
              </Button>
            ) : (
              <Button type="button">
                <Link href={`${ADMIN_MEDIA_SHOW}`}>Back To Media</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {selectedMedia.length > 0 && (
        <div className="py-2  px-3 bg-violet-200 rounded flex justify-between items-center mt-5 text-black">
          <Label>
            <Checkbox
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              className="border-primary"
            />
            Select All
          </Label>

          <div className="flex gap-2">
            {deleteType === "SD" ? (
              <Button
                onClick={() => handleDelete(selectedMedia, deleteType)}
                variant="destructive"
              >
                Move Into Trash
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => handleDelete(selectedMedia, "RSD")}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Restore
                </Button>
                <Button
                  onClick={() => handleDelete(selectedMedia, "RSD")}
                  variant={"destructive"}
                >
                  Delete Permanently
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <div>
        <CardContent>
          {status === "pending" ? (
            <div>Loading...</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-5 mb-5 mt-10">
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
          <div className="flex justify-center items-center mt-5">
            {hasNextPage && (
              <ButtonLoading
                type="button"
                onClick={() => fetchNextPage()}
                text="Load More Product"
                loading={isFetching}
              >
                Load More Product
              </ButtonLoading>
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default MediaPage;
