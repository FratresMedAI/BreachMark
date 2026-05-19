import {
  controlEducation,
  eventEducation,
  nodeEducation,
} from "@/lib/education";

export const mondayMorningPhishEducation = {
  scenarioId: "monday-morning-phish",
  frameworkMappings: {
    mitre: "ATT&CK: Initial Access, Credential Access, Lateral Movement, Collection, Exfiltration, Impact",
    nist: "Cybersecurity Framework: Detect, Respond, Recover",
  },
  nodes: nodeEducation,
  controls: controlEducation,
  events: eventEducation,
};
