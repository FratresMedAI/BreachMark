export type EducationMode = "learning" | "challenge";

export interface EducationEntry {
  title: string;
  term: string;
  mapping: string;
  body: string;
  why: string;
  link?: string;
}

export const LEARN_ACCENT = "#c026d3";

export const nodeEducation: Record<string, EducationEntry> = {
  "gw-edge": {
    title: "Internet Edge Gateway",
    term: "Gateway",
    mapping: "NIST Respond: Containment",
    body: "This is where internet-facing traffic enters the company network.",
    why: "Why it matters: perimeter devices shape blast radius before attackers reach endpoints.",
  },
  "gw-vpn": {
    title: "VPN Gateway",
    term: "Remote access",
    mapping: "MITRE T1078 - Valid Accounts",
    body: "A stolen VPN token lets an attacker look like a legitimate remote user.",
    why: "Why it matters: identity controls can be just as important as malware controls.",
  },
  "ws-finance": {
    title: "Finance Workstation",
    term: "Endpoint",
    mapping: "MITRE T1566 - Phishing",
    body: "This endpoint is compromised by the payroll lure and becomes the first foothold.",
    why: "Why it matters: one user click can become a ransomware entry point.",
  },
  "ws-hr": {
    title: "HR Workstation",
    term: "Endpoint",
    mapping: "MITRE T1078 - Valid Accounts",
    body: "The second ingress path lands on HR through token replay, separate from the finance phish.",
    why: "Why it matters: incidents often have more than one door open.",
  },
  "ws-ops": {
    title: "Operations Workstation",
    term: "Endpoint",
    mapping: "MITRE TA0008 - Lateral Movement",
    body: "Operations hosts are valuable pivot points because they often touch internal services.",
    why: "Why it matters: attackers move toward systems with broader access.",
  },
  "ws-eng": {
    title: "Engineering Workstation",
    term: "Staging host",
    mapping: "MITRE T1021 - Remote Services",
    body: "Engineering becomes a staging point after the domain controller is abused.",
    why: "Why it matters: deployment tools can spread both fixes and malware.",
  },
  "dc-01": {
    title: "Domain Controller",
    term: "Identity core",
    mapping: "MITRE T1003 - OS Credential Dumping",
    body: "The domain controller is the identity control plane for the environment.",
    why: "Why it matters: once identity falls, many downstream systems are exposed.",
  },
  "s3-backup": {
    title: "Object Storage",
    term: "Data store",
    mapping: "MITRE TA0010 - Exfiltration",
    body: "Backup storage represents the sensitive data attackers want to steal.",
    why: "Why it matters: response success is measured by data protected, not just hosts cleaned.",
  },
};

export const controlEducation: Record<string, EducationEntry> = {
  "reset-user-creds": {
    title: "Force Password Reset",
    term: "Credential reset",
    mapping: "NIST SP 800-61 - Eradication",
    body: "Invalidate cached credentials so stolen passwords stop working for lateral movement.",
    why: "Why it costs credits: resets disrupt users but can quickly cut off credential reuse.",
  },
  "block-ioc": {
    title: "Block IOC",
    term: "Indicator blocking",
    mapping: "MITRE TA0011 - Command and Control",
    body: "Block known malicious domains, IPs, or hashes seen during the incident.",
    why: "Why it costs credits: fast blocking buys time, but attackers can rotate infrastructure.",
  },
  "enhanced-logging": {
    title: "Enhanced Logging",
    term: "Detection engineering",
    mapping: "NIST Detect - Anomalies and Events",
    body: "Increase telemetry so the SOC can see suspicious behavior sooner.",
    why: "Why it costs credits: more signal improves response but creates analyst workload.",
  },
  "revoke-sessions": {
    title: "Revoke Sessions",
    term: "Token revocation",
    mapping: "MITRE T1078 - Valid Accounts",
    body: "Kill active sessions so stolen tokens cannot keep accessing VPN or internal apps.",
    why: "Why it costs credits: it is effective but can log out legitimate users mid-work.",
  },
};

export const eventEducation: Record<string, EducationEntry> = {
  "ev-1": {
    title: "Malicious Attachment Opened",
    term: "Phishing",
    mapping: "MITRE T1566 - Phishing",
    body: "A user opens a lure that gives the attacker an initial foothold.",
    why: "Why it matters: phishing is still one of the most common breach entry points.",
  },
  "ev-2": {
    title: "C2 Beacon Established",
    term: "Command and control",
    mapping: "MITRE TA0011 - Command and Control",
    body: "The host calls back to attacker infrastructure for instructions.",
    why: "Why it matters: blocking C2 can prevent a foothold from becoming an operation.",
  },
  "ev-3": {
    title: "Browser Credential Dump",
    term: "Credential access",
    mapping: "MITRE T1555 - Credentials from Password Stores",
    body: "The attacker extracts saved credentials from the compromised workstation.",
    why: "Why it matters: credentials let attackers move without dropping obvious malware.",
  },
  "ev-4": {
    title: "PsExec to HR Workstation",
    term: "Lateral movement",
    mapping: "MITRE T1021.002 - SMB/Windows Admin Shares",
    body: "Stolen credentials are used to execute commands on another workstation.",
    why: "Why it matters: lateral movement turns one compromised host into a network incident.",
  },
  "ev-5": {
    title: "VPN Token Replay to HR",
    term: "Valid accounts",
    mapping: "MITRE T1078 - Valid Accounts",
    body: "A separate stolen token opens a second path into HR-WS-11.",
    why: "Why it matters: responders must check identity paths, not just malware paths.",
  },
  "ev-6": {
    title: "Lateral to Domain Controller",
    term: "Privilege escalation path",
    mapping: "MITRE TA0008 - Lateral Movement",
    body: "The attacker moves from HR toward the domain controller.",
    why: "Why it matters: protecting identity infrastructure is a top incident priority.",
  },
  "ev-7": {
    title: "DCSync Attempt",
    term: "Domain credential theft",
    mapping: "MITRE T1003.006 - DCSync",
    body: "Replication APIs are abused to dump domain secrets.",
    why: "Why it matters: DCSync can give attackers long-term access to the domain.",
  },
  "ev-8": {
    title: "Backup Catalog Staged",
    term: "Collection",
    mapping: "MITRE TA0009 - Collection",
    body: "Sensitive files are grouped before exfiltration.",
    why: "Why it matters: collection is often the last warning before data leaves.",
  },
  "ev-9": {
    title: "Engineering Workstation Seeded",
    term: "Staging",
    mapping: "MITRE T1021 - Remote Services",
    body: "The attacker prepares another host for tooling or ransomware deployment.",
    why: "Why it matters: staging hosts increase speed and blast radius.",
  },
  "ev-10": {
    title: "S3 Sync Exfiltration",
    term: "Exfiltration",
    mapping: "MITRE T1537 - Transfer to Cloud Account",
    body: "Customer records are uploaded to attacker-controlled storage.",
    why: "Why it matters: data loss is often the business impact executives care about most.",
  },
  "ev-11": {
    title: "Ransomware Prep",
    term: "Impact",
    mapping: "MITRE TA0040 - Impact",
    body: "Deployment scripts are staged for broad disruption.",
    why: "Why it matters: stopping earlier stages prevents the most expensive outcome.",
  },
  "ev-12": {
    title: "Secondary Exfil Wave",
    term: "Exfiltration",
    mapping: "MITRE TA0010 - Exfiltration",
    body: "A second data theft wave targets HR payroll records.",
    why: "Why it matters: attackers often steal in waves after the first path succeeds.",
  },
};

export const glossary = [
  ["Phishing", "A social engineering attack that tricks users into opening links or files.", "https://attack.mitre.org/techniques/T1566/"],
  ["Blast Radius", "The set of systems and data that can be affected from one compromise.", "https://www.nist.gov/cyberframework"],
  ["Containment", "Actions that stop an incident from spreading while preserving response options.", "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final"],
  ["Lateral Movement", "Attacker movement from one internal system to another.", "https://attack.mitre.org/tactics/TA0008/"],
  ["Command and Control", "The communication channel an attacker uses to direct compromised systems.", "https://attack.mitre.org/tactics/TA0011/"],
  ["Credential Access", "Techniques used to steal passwords, tokens, or hashes.", "https://attack.mitre.org/tactics/TA0006/"],
  ["Exfiltration", "Moving stolen data out of the victim environment.", "https://attack.mitre.org/tactics/TA0010/"],
  ["DCSync", "A technique that abuses domain replication to steal password hashes.", "https://attack.mitre.org/techniques/T1003/006/"],
  ["IOC", "Indicator of Compromise, such as a malicious IP, domain, file hash, or URL.", "https://www.nist.gov/cyberframework"],
  ["NIST Respond", "The Cybersecurity Framework function focused on containing and mitigating incidents.", "https://www.nist.gov/cyberframework"],
] as const;

export function learningInsight(containmentPct: number): string {
  if (containmentPct >= 80) {
    return "Great job prioritizing early containment; that maps to NIST Detect + Respond.";
  }
  if (containmentPct >= 40) {
    return "You interrupted part of the chain; next, compare identity controls against network indicators.";
  }
  return "The run shows how fast blast radius grows when early signals are missed.";
}
