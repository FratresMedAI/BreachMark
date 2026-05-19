import {
  KeyRound,
  LogOut,
  Megaphone,
  ScanEye,
  ShieldBan,
  Unplug,
  type LucideIcon,
} from "lucide-react";

export const CONTROL_ICONS: Record<string, LucideIcon> = {
  "isolate-host": Unplug,
  "reset-user-creds": KeyRound,
  "block-ioc": ShieldBan,
  "enhanced-logging": ScanEye,
  "revoke-sessions": LogOut,
  "awareness-push": Megaphone,
};
