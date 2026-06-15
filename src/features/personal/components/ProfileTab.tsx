import { Box } from "@mui/material";
import { useState } from "react";
import { EditProfileModal } from "@/features/users/components/EditProfileModal";
import { usePersonalProfileViewModel } from "@/features/personal/hooks/usePersonalProfileViewModel";
import { ProfileAtGlance } from "./ProfileAtGlance";
import { ProfileDomainBreakdown } from "./ProfileDomainBreakdown";
import { ProfileHero } from "./ProfileHero";
import { ProfileTalentList } from "./ProfileTalentList";

export function ProfileTab() {
  const profile = usePersonalProfileViewModel();
  const [editing, setEditing] = useState(false);

  if (!profile) return null;

  return (
    <Box
      sx={{
        display: "grid",
        width: "min(100%, 72rem)",
        mx: "auto",
        gap: "2.5rem",
      }}
    >
      <ProfileHero
        dominantDomain={profile.dominantDomain}
        kudosCount={profile.stats.kudosReceived}
        leadingTalentLabel={profile.leadingTalentLabel}
        user={profile.user}
        onEdit={() => setEditing(true)}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "18.75rem 1fr" },
          alignItems: "start",
          gap: "2rem",
        }}
      >
        <Box
          component="aside"
          sx={{
            display: "grid",
            alignContent: "start",
            alignSelf: "start",
            gap: "1.5rem",
          }}
        >
          <ProfileDomainBreakdown
            items={profile.domainBreakdown}
            totalTalents={profile.userTalents.length}
          />
          <ProfileAtGlance stats={profile.stats} />
        </Box>

        <ProfileTalentList talents={profile.userTalents} />
      </Box>

      {editing && <EditProfileModal open onClose={() => setEditing(false)} />}
    </Box>
  );
}
