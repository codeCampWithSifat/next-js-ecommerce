import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { Card, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes";

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
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="border border-red-500">
        <CardHeader className="pt-3 px-3 border border-b [.border-b]:pb-2">
          <div className="flex justify-between w-full items-center">
            <h4 className="font-semibold text-xl uppercase">Media</h4>

            <div className="flex items-center gap-5">
              <UploadMedia />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MediaPage;
