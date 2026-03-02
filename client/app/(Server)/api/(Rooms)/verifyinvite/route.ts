import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";
export const POST = async (req: NextRequest) => {
  try {
    const { token } = await req.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // find the room invite
    const roomInvite = await db.roomInvite.findUnique({
      where: {
        token,
      },
    });

    if (!roomInvite)
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    // if the user is already a member of the room
    const existingMember = await db.roomMember.findFirst({
      where: {
        userId: session.user.id,
        roomId: roomInvite.roomId,
      },
    });

    if (existingMember)
      return NextResponse.json(
        { error: "User is already a member", roomId: roomInvite.roomId },
        { status: 400 },
      );

    // create the room member
    await db.roomMember.create({
      data: {
        userId: session.user.id,
        roomId: roomInvite.roomId,
        role: "MEMBER",
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Verification successful",
        roomId: roomInvite.roomId,
      },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
};
