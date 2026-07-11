import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AnnouncementLayout } from "#/components/announcement-layout";

export const Route = createFileRoute("/announcement")({
  component: AnnouncementRoute,
});

function AnnouncementRoute() {
  return (
    <AnnouncementLayout>
      <Outlet />
    </AnnouncementLayout>
  );
}
