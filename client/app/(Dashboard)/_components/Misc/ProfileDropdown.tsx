"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftFromLine } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
const ProfileDropDown = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  // extracting first name and last name initals from the user name
  const name = session?.user?.name.split(" ");
  const firstNameInitial = name?.[0]?.[0]?.toUpperCase();
  const lastNameInitial = name?.[1]?.[0]?.toUpperCase();
  const AvatarName = `${firstNameInitial ?? ""}${lastNameInitial ?? ""}`;
  //   return the dropdown menu

  // Handle logout function for user signout
  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer rounded-full outline-0">
        {!isPending ? (
          <Avatar className="size-12">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback>{AvatarName ?? "QS"}</AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="size-12 rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-center">Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session?.user?.email && (
          <DropdownMenuItem className="text-primary truncate">
            <p className="text-balance">{session?.user?.email}</p>
          </DropdownMenuItem>
        )}
        {session?.user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <ArrowLeftFromLine className="mr-2 size-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
