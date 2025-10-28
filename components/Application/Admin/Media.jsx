import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { ADMIN_MEDIA_EDIT } from "@/routes/AdminPanelRoutes";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosLink } from "react-icons/io";
import { LuTrash } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";

const Media = ({
  media,
  handleDelete,
  deleteType,
  selectedMedia,
  setSelectedMedia,
}) => {
  const handleCheck = (checked) => {
    setSelectedMedia((prev) => {
      if (checked) {
        if (!prev.includes(media._id)) {
          return [...prev, media._id];
        }
        return prev;
      } else {
        return prev.filter((m) => m !== media._id);
      }
    });
  };

  const handleCopyLink = async (url) => {
    await navigator.clipboard.writeText(url);
    showToast("success", "Link Copied");
  };
  return (
    <div className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
      <div className="absolute top-2 left-2 z-20 ">
        <Checkbox
          checked={selectedMedia.includes(media._id)}
          onCheckedChange={handleCheck}
          className="border-indigo-700"
        />
      </div>

      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="h-7 w-7 flex items-center justify-center rounded-full bg-black/50 cursor-pointer">
              <BsThreeDotsVertical color="#fff" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {deleteType === "SD" && (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                    <MdOutlineEdit />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCopyLink(media.secure_url)}
                  className="cursor-pointer"
                >
                  <IoIosLink />
                  Copy Link
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              onClick={() => handleDelete([media._id], deleteType)}
              className="cursor-pointer"
            >
              <LuTrash color="red" />
              {deleteType === "SD" ? "Move Into Trash" : "Delete Permanently"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full h-full absolute z-10 transition-all duration-200 ease-in group-hover:bg-black/30"></div>
      <div>
        <Image
          src={media?.secure_url}
          alt={media?.alt || "I Love You"}
          height={300}
          width={300}
          className="object-cover w-full sm:h-[200px] h-[150px]"
        />
      </div>
    </div>
  );
};

export default Media;
