export const ADMIN_DASHBOARD = "/admin/dashboard";

// media routes
export const ADMIN_MEDIA_SHOW = "/admin/media";
export const ADMIN_MEDIA_EDIT = (id) => (id ? `/admin/media/edit/${id}` : "");
