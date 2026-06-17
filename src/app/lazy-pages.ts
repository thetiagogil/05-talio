import { lazy } from "react";

export const ActivityPage = lazy(() =>
  import("@/pages/activity/ActivityPage").then((module) => ({
    default: module.ActivityPage,
  })),
);

export const LearnPage = lazy(() =>
  import("@/pages/learn/LearnPage").then((module) => ({
    default: module.LearnPage,
  })),
);

export const LoginPage = lazy(() =>
  import("@/pages/login/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);

export const PersonalPage = lazy(() =>
  import("@/pages/personal/PersonalPage").then((module) => ({
    default: module.PersonalPage,
  })),
);

export const SetupPage = lazy(() =>
  import("@/pages/setup/SetupPage").then((module) => ({
    default: module.SetupPage,
  })),
);

export const TeamPage = lazy(() =>
  import("@/pages/team/TeamPage").then((module) => ({
    default: module.TeamPage,
  })),
);
