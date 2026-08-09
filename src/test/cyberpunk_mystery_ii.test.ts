import fs from "fs";
import path from "path";

import initSqlJs from "sql.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Cyberpunk Mystery II", () => {
  let db: initSqlJs.Database;

  beforeAll(async () => {
    const SQL = await initSqlJs();
    const fileBuffer = fs.readFileSync(path.join(__dirname, "../../public/database/cyberpunk_mystery.db"));
    db = new SQL.Database(fileBuffer);
  });

  afterAll(() => {
    if (db) {
      db.close();
    }
  });

  it("description narrows to one incident for Cyberpunk Mystery II", () => {
    const res = db.exec(`
      SELECT * FROM incident_report
      WHERE date = 21470301
      AND type = 'AI Breach'

    `);
    expect(res[0].values).toHaveLength(1);
  });

  it("should find the ghost-drive runner Shade Fathom using incident and implant clues", () => {
    // Clues (incident briefing): Ghost Deck with 6 anomalies; runner is a Neural Broker in Sector 9;
    // implant sync shows no sync for 10+ days (last_sync on/before 21470220)
    const result = db.exec(`
      SELECT p.name
      FROM person p
      JOIN device d ON p.id = d.person_id
      JOIN digital_log dl ON d.id = dl.device_id
      JOIN neural_implant ni ON p.id = ni.person_id
      WHERE d.device_type = 'Ghost Deck'
        AND dl.anomaly_count = 6
        AND p.sector = 'Sector 9'
        AND p.role = 'Neural Broker'
        AND ni.last_sync <= 21470220
      GROUP BY p.id, p.name
    `);

    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(1);
    expect(result[0].values[0][0]).toBe("Shade Fathom");
  });

  it("should find the insider Rysa Kade using badge clone and payout clues", () => {
    // Clues (Shade's interrogation notes + Core Deck incident):
    // - Security Chief on Core Deck
    // - Clearance Lattice implant
    // - Payment: exactly 45,000 SpectraCoin on 21470301
    const result = db.exec(`
      SELECT p.name
      FROM person p
      JOIN neural_implant ni ON p.id = ni.person_id
      JOIN crypto_transaction ct ON p.id = ct.person_id
      JOIN location_log ll ON p.id = ll.person_id
      WHERE p.role = 'Security Chief'
        AND ni.cyberware_type = 'Clearance Lattice'
        AND ct.amount = 45000
        AND ct.crypto_type = 'SpectraCoin'
        AND ct.timestamp = 21470301
        AND ll.sector = 'Core Deck'
        AND ll.timestamp = 21470301
      GROUP BY p.id, p.name
    `);

    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(1);
    expect(result[0].values[0][0]).toBe("Rysa Kade");
  });

  it("should find the mastermind Dr. Orion Flux using dual-transfer clues", () => {
    // Clues (Rysa's interrogation notes): the same person received BOTH
    // - 50,000 NeoCoin
    // - 20,000 LuminaCredit
    // and is a Lead Scientist in the Research Ring with four implants.
    const result = db.exec(`
      SELECT p.name
      FROM person p
      JOIN neural_implant ni ON p.id = ni.person_id
      JOIN crypto_transaction ct_neo ON p.id = ct_neo.person_id AND ct_neo.amount = 50000 AND ct_neo.crypto_type = 'NeoCoin'
      JOIN crypto_transaction ct_lumi ON p.id = ct_lumi.person_id AND ct_lumi.amount = 20000 AND ct_lumi.crypto_type = 'LuminaCredit'
      WHERE p.role = 'Lead Scientist'
      GROUP BY p.id, p.name
      HAVING COUNT(ni.id) = 4
    `);

    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(1);
    expect(result[0].values[0][0]).toBe("Dr. Orion Flux");
  });
});
