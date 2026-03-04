"use client";

import axios from "@/lib/axios";
import { StatusCodes } from "@/lib/constants/StatusCodes";
import { AxiosError } from "axios";
import { redirect, RedirectType } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";
import RoomNavbar from "./RoomNavbar";
import { RoomMember } from "@/generated/prisma/client";

type AuthData = RoomMember & {
  roomName: string;
};

interface RoomPageComponentProps {
  roomId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

type RoomRole = "OWNER" | "MEMBER";

interface RoomAccessMeta {
  roomName: string;
  role: RoomRole;
}

const fetchAuth = async (roomId: string) => {
  try {
    const result = await axios.get(`/room/auth/${roomId}`, {
      withCredentials: true,
    });
    return result.data as AuthData;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === StatusCodes.FORBIDDEN) {
        toast.error(`${err.response.data.error}`, {
          description:
            "Please ask the owner of the room to send an invite link.",
        });
        return redirect("/", RedirectType.replace);
      }
    }
  }
};

const RoomPageComponent = ({ roomId, user }: RoomPageComponentProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["roomAuth", roomId],
    queryFn: () => fetchAuth(roomId),
  });

  return <RoomNavbar room={data!} />;
};

export default RoomPageComponent;
