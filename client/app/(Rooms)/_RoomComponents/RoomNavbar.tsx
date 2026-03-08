import { Button } from "@/components/ui/button";
import { RoomRole } from "@/generated/prisma/enums";
import { RoleLabel } from "@/lib/constants/Roles";
import { LogOut, Play, UserPlus } from "lucide-react";
import Link from "next/link";

interface RoomNavbarProps {
  roomName: string;
  role: RoomRole;
  openInviteModal: () => void;
}
const RoomNavbar = ({ roomName, role, openInviteModal }: RoomNavbarProps) => {
  return (
    <nav className="border-border bg-navbar fixed flex h-16 w-full items-center border-b px-4 backdrop-blur">
      <div className="flex w-1/3 items-center gap-3">
        <Link
          href="/"
          className="bg-primary inline-flex size-10 items-center justify-center rounded-lg"
        >
          <span className="text-primary-foreground text-lg font-bold">
            {"</>"}
          </span>
        </Link>
        <div>
          <p className="text-sm leading-none font-semibold">{roomName}</p>
          <p className="text-muted-foreground text-xs">{RoleLabel[role]}</p>
        </div>
      </div>

      <div className="flex w-1/3 justify-center">
        <Button className="cursor-pointer gap-2 rounded-lg px-6">
          <Play className="size-4" />
          Run
        </Button>
      </div>

      <div className="flex w-1/3 items-center justify-end gap-x-4">
        {role === RoomRole.OWNER && (
          <Button
            variant="outline"
            className="cursor-pointer gap-2"
            onClick={openInviteModal}
          >
            <UserPlus className="size-4" />
            Invite
          </Button>
        )}

        <Button
          variant="outline"
          className="text-destructive/80 hover:text-destructive border-destructive! cursor-pointer gap-2"
          asChild
        >
          <Link href="/">
            <LogOut className="size-4" />
            Leave Room
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default RoomNavbar;
