# Scenario design — Monday Morning Phish

Fictional assets only. No real scanning or live telemetry.

## Attack chain (MITRE-aligned)

| Stage | Time | Event | MITRE-style technique |
|-------|------|-------|---------------------|
| 1 | T+30s | Malicious attachment | Initial Access (phishing) |
| 2 | T+75s | C2 beacon | Command and Control |
| 3 | T+120s | Credential dump | Credential Access |
| 4 | T+180s | Lateral to HR | Lateral Movement |
| 5 | T+240s | Lateral to DC | Lateral Movement |
| 6 | T+300s | DCSync | Credential Access |
| 7 | T+360s | Staging | Collection |
| 8 | T+420s | S3 exfil | Exfiltration |
| 9 | T+480s | Ransomware prep | Impact |
| 10 | T+540s | Secondary exfil | Exfiltration |

## Control economics (12 credits)

| Control | Cost | Blocks |
|---------|------|--------|
| User awareness push | 1 | Initial phish |
| Force password reset | 2 | Credential reuse / lateral via creds |
| Block IOC | 2 | C2 and exfil paths |
| Enhanced logging | 2 | Improves MTTD (detection signal) |
| Isolate host | 3 | Movement from/to isolated host |
| Revoke sessions | 3 | Token replay / lateral |

**Winning paths for recruiters**

- Isolate `FIN-WS-04` before T+180s → DC never reached (reachability + isolation).
- Reset creds on finance before lateral events → contains credential-driven pivots.
- Block IOC before T+420s → prevents record exfil even if DC is lost.

## Engine rules

1. Events fire in time order up to the scrubber position.
2. An event is **contained** if any `blockedBy` control was applied in time, or the source/target host is isolated.
3. Events cannot fire from hosts with `compromise === 0` (except initial access).
4. Timeline scrub **recomputes** deterministically from T+0.
