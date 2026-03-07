import { ElementType } from "react";

const RoomLoadingComponent = ({
  Icon,
  text,
}: {
  Icon: ElementType;
  text: string;
}) => {
  return (
    <div className="bg-background flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Icon className="text-primary h-8 w-8 animate-pulse" />
        <p className="text-foreground text-sm">{text}</p>
      </div>
    </div>
  );
};

export default RoomLoadingComponent;
