import { auth } from "@/lib/auth";
import { redirectAfterSignin } from "@/lib/utils/redirectAfterSignin";
import { headers } from "next/headers";
import RoomPageComponent from "../../_RoomComponents/RoomPageComponent";

const RoomPage = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return redirectAfterSignin(`/room/${roomId}`);
  return (
    <RoomPageComponent roomId={roomId} user={session.user} />
  );
};

export default RoomPage;
