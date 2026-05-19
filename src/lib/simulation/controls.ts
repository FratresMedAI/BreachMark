export interface ControlDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  requiresTarget: boolean;
  /** Roles that can be targeted when requiresTarget is true. */
  targetRoles?: Array<"workstation" | "dc" | "storage" | "gateway">;
}

export const CONTROLS: ControlDefinition[] = [
  {
    id: "reset-user-creds",
    name: "Force password reset",
    description: "Invalidate cached credentials on a workstation.",
    cost: 4,
    requiresTarget: true,
    targetRoles: ["workstation"],
  },
  {
    id: "block-ioc",
    name: "Block IOC",
    description: "Firewall block on known C2 and exfil indicators.",
    cost: 4,
    requiresTarget: false,
  },
  {
    id: "enhanced-logging",
    name: "Enhanced logging",
    description: "Raise SIEM fidelity — improves detection signal.",
    cost: 3,
    requiresTarget: false,
  },
  {
    id: "revoke-sessions",
    name: "Revoke sessions",
    description: "Kill active tokens before lateral movement.",
    cost: 5,
    requiresTarget: false,
  },
];

export const CONTROL_MAP = Object.fromEntries(
  CONTROLS.map((c) => [c.id, c]),
) as Record<string, ControlDefinition>;

export function getControlCost(controlId: string): number {
  return CONTROL_MAP[controlId]?.cost ?? 0;
}
