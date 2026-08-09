import fs from "fs";
import path from "path";

import initSqlJs from "sql.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Cyberpunk Mystery III", () => {
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

  it("description narrows to one incident for Cyberpunk Mystery III", () => {
    const res = db.exec(`
      SELECT * FROM incident_report
      WHERE date = 21470312 AND type = 'breach' AND sector = 'Sector 6'
    `);
    expect(res[0].values).toHaveLength(1);
  });

  it("should find the runner Nyx Arclight using combined device signatures", () => {
    const result = db.exec(`
      WITH device_hits AS (
        SELECT p.id
        FROM person p
        JOIN device d ON p.id = d.person_id
        JOIN digital_log dl ON d.id = dl.device_id
        WHERE d.device_type = 'Ghost Deck'
          AND dl.anomaly_count = 6
        INTERSECT
        SELECT p.id
        FROM person p
        JOIN device d ON p.id = d.person_id
        JOIN digital_log dl ON d.id = dl.device_id
        WHERE d.device_type = 'Neural Deck'
          AND dl.anomaly_count = 4
      )
      SELECT p.name
      FROM person p
      JOIN device_hits dh ON p.id = dh.id
      JOIN neural_implant ni ON p.id = ni.person_id
      JOIN location_log ll ON p.id = ll.person_id
      WHERE p.role = 'Neural Broker'
        AND ll.sector = 'Sector 6'
        AND ni.last_sync <= 21470301
      GROUP BY p.id, p.name
      HAVING COUNT(ni.id) = 5
    `);

    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(1);
    expect(result[0].values[0][0]).toBe("Nyx Arclight");
  });

  it("should find the insider Keira Voss using payment and implant clues", () => {
    const result = db.exec(`
      SELECT p.name
      FROM person p
      JOIN neural_implant ni ON p.id = ni.person_id
      JOIN crypto_transaction ct ON p.id = ct.person_id
      JOIN location_log ll ON p.id = ll.person_id
      WHERE p.role = 'Security Chief'
        AND ni.cyberware_type IN ('Clearance Lattice', 'Command Mesh')
        AND ct.amount = 45000
        AND ct.crypto_type = 'SpectraCoin'
        AND ll.sector = 'Core Deck'
      GROUP BY p.id, p.name
      HAVING COUNT(DISTINCT ni.cyberware_type) = 2
    `);

    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(1);
    expect(result[0].values[0][0]).toBe("Keira Voss");
  });

  it("should find the mastermind Dr. Solene Korr using command unit anomaly clues", () => {
    const result = db.exec(`
      SELECT p.name
      FROM person p
      JOIN device d ON p.id = d.person_id
      JOIN digital_log dl ON d.id = dl.device_id
      JOIN neural_implant ni ON p.id = ni.person_id
      WHERE p.role = 'Exec'
        AND d.device_type = 'Command Unit'
        AND dl.anomaly_count = 2
        AND ni.cyberware_type = 'Directive Stack'
      GROUP BY p.id, p.name
    `);

    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(1);
    expect(result[0].values[0][0]).toBe("Dr. Solene Korr");
  });
});
