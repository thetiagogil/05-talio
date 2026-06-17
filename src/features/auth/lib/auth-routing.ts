import type { User } from "@/types/talents";

export const getPostLoginRoute = (user: User) =>
  user.role && user.avatar ? "/personal/profile" : "/setup";
