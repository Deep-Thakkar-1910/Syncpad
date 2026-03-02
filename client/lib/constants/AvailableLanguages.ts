import { Languages } from "@/generated/prisma/enums";

export const LanguageMetaMap: Record<
  Languages,
  {
    displayName: string;
    extension: string;
    imageUrl: string;
  }
> = {
  JAVASCRIPT: {
    displayName: "Javascript",
    extension: ".js",
    imageUrl: "/assets/logos/javascript.png",
  },
};
