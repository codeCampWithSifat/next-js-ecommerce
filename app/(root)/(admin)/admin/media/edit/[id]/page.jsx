"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoutes";
import { useParams } from "next/navigation";
import { use } from "react";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: "Media",
  },
  {
    href: "",
    label: "Edit Media",
  },
];

const EditMedia = ({ params }) => {
  const { id } = use(params);
  console.log("Edit Page", id);

  const { data: mediaData } = useFetch(`/api/media/get/${id}`);

  console.log("Media Data", mediaData);
  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="font-semibold text-xl">Edit Media</h4>
        </CardHeader>

        <CardContent className="pb-5"></CardContent>
      </Card>
    </div>
  );
};

export default EditMedia;
