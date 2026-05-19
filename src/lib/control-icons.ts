import {
  KeyRound,
  LogOut,
  ScanEye,
  ShieldBan,
  type LucideIcon,
} from "lucide-react";

export const CONTROL_ICONS: Record<string, LucideIcon> = {
  "reset-user-creds": KeyRound,
  "block-ioc": ShieldBan,
  "enhanced-logging": ScanEye,
  "revoke-sessions": LogOut,
};
