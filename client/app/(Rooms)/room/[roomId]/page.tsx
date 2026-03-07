import { auth } from "@/lib/auth";
import { redirectAfterSignin } from "@/lib/utils/redirectAfterSignin";
import { headers } from "next/headers";
import RoomPageComponent from "../../_RoomComponents/RoomPageComponent";
import { Suspense } from "react";
import RoomLoadingComponent from "../../_RoomComponents/RoomLoadingComponent";
import { ShieldUser } from "lucide-react";

const RoomPage = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return redirectAfterSignin(`/room/${roomId}`);
  return (
    <Suspense
      fallback={
        <RoomLoadingComponent Icon={ShieldUser} text="Authenticating" />
      }
    >
      <RoomPageComponent roomId={roomId} user={session.user} />
    </Suspense>
  );
};

export default RoomPage;
