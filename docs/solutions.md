# Puzzle solutions

> **Spoilers:** This document contains the complete clue chains and example queries for every challenge.

Keep these walkthroughs synchronized with the player-facing routes, SQLite databases, accepted solutions, and puzzle tests.

## SQL Murder Mystery I

### Clues

A crime has taken place and the detective needs your help. The detective gave you the crime scene report, but you somehow lost it. You vaguely remember that the crime was a murder that occurred sometime on Jan.15, 2018 and that it took place in SQL City. Start by retrieving the corresponding crime scene report from the police department's database.

Security footage shows that there were 2 witnesses. The first witness lives at the last house on "Northwestern Dr". The second witness, named Annabel, lives somewhere on "Franklin Ave".

I heard a gunshot and then saw a man run out. He had a "Get Fit Now Gym" bag. The membership number on the bag started with "48Z". Only gold members have those bags. The man got into a car with a plate that included "H42W".

I saw the murder happen, and I recognized the killer from my gym when I was working out last week on January the 9th.

I was hired by a woman with a lot of money. I don't know her name but I know she's around 5'5" (65") or 5'7" (67"). She has red hair and she drives a Tesla Model S. I know that she attended the SQL Symphony Concert 3 times in December 2017.

### Queries

```sql
select * from crime_scene_report where date = 20180115 and city = 'SQL City' and type= 'murder'
```

```sql
select * from person p
where p.name like 'Annabel%' and p.address_street_name = 'Franklin Ave'
```

```sql
select * from person where address_street_name = 'Northwestern Dr'
order by address_number desc
limit 1
```

```sql
select * from interview where person_id in (16371, 14887)
```

```sql
select * from person p
inner join get_fit_now_member m on m.person_id = p.id
inner join drivers_license dl on dl.id = p.license_id
where m.id like '48Z%' and m.membership_status = 'gold' and dl.plate_number like '%H42W%'
```

```sql
select * from person p
inner join drivers_license dl on dl.id = p.license_id
inner join facebook_event_checkin ci on ci.person_id = p.id and ci.event_name = 'SQL Symphony Concert'
where dl.height >= 65 and dl.height <= 67 and dl.hair_color = 'red' and car_model = 'Model S'
group by (p.id)
having count(ci.event_id) = 3
```

## SQL Murder Mystery II

### Clues

Another crime has occurred and the detective needs your help once again. You've been handed a case file, but some crucial details are missing.
You remember that the crime was a murder that occurred on Jan.14, 2018 and that it took place in SQL City.
The victim was found at the Get Fit Now gym, and witnesses were present during the incident. Start by retrieving the corresponding crime scene report from the police department's database.

A murder occurred at Get Fit Now gym. Victim found in locker room at 6 AM.
Security cameras captured two witnesses: gym member with brown hair, 70 inches tall, driving Honda Civic, and someone with license plate WHT789.
Check their interview transcripts for what they saw.

I was doing cardio when I heard shouting from the locker room around 11:20 PM. I saw Ryan arguing with someone from behind. The person was tall, around 68 inches, with black hair. They seemed upset about business. I heard "keep your mouth shut about money!"

I witnessed part of the fight. I saw a man arguing with Ryan - he drove a black Dodge Charger. The guy looked young, maybe late twenties, upset about finances. The argument got heated before they went to the locker room. I left after.

I had issues with Ryan over our supplement business. He threatened to expose irregularities to authorities.
I went to confront him but didn't kill him! Someone else pulled the strings.
A woman from Elm Street at the Business Networking Mixer knew about my debts and had money to burn. She drives a BMW.

### Queries

```sql
select * from crime_scene_report where date = '20180114' and city = 'SQL City'
```

```sql
select i.transcript from person p
inner join drivers_license dl on dl.id = p.license_id
inner join interview i on i.person_id = p.id
where (dl.height = 70 and dl.hair_color = 'brown' and dl.car_model = 'Civic') or dl.plate_number = 'WHT789'
```

```sql
select * from person p
inner join drivers_license dl on dl.id = p.license_id
where dl.height = 68 and dl.hair_color = 'black' and dl.car_model = 'Charger'
```

```sql
select * from interview where person_id = 43829
```

```sql
select * from person p
inner join drivers_license dl on dl.id = p.license_id
inner join facebook_event_checkin ci on ci.person_id = p.id
where dl.car_make = 'BMW' and p.address_street_name = 'Elm Street' and ci.event_name = 'Business Networking Mixer'
```

## Cyberpunk Mystery I

### Clues

In the neon-lit sprawl of Neo-Tokyo, a high-tech heist has shaken the corporate elite.
The AI Core has been stolen from the secure vault on February 20, 2147.
Dive into the database to uncover the hacker, the insider, and the mastermind behind this cyberpunk conspiracy. Below is the schema diagram for this database.

The AI Core was stolen from the secure vault. Security drones detected a hacker with 5 neural implants, using a Neural Deck, with over 3 anomalies, in Sector 7 on February 20, 2147.

I broke into the vault. The insider who paid me 30000 in CryptoByte, used Access Implant cyberware, and was spotted in Sector 7 is the one who gave me the codes to get in.

I was just doing my job, but I saw the big boss who had 4 neural implants, paid the hacker 50000 in NeoCoin, and was operating out of Corporate on 21470220. I think that's all I know.

### Queries

```sql
select * from incident_report
where date = '21470220' and type = 'theft'
```

```sql
select * from person p
inner join location_log ll on ll.person_id = p.id
inner join device d on d.person_id = p.id
inner join digital_log dl on dl.device_id = d.id
inner join neural_implant ni on ni.person_id = p.id
where dl.anomaly_count > 3 and ll.sector = 'Sector 7' and ll.timestamp = '21470220'
group by p.name
having count(ni.id) = 5
```

```sql
select * from interrogation_log where person_id = 1025
```

```sql
select * from person p
inner join crypto_transaction ct on ct.person_id = p.id
inner join neural_implant ni on ni.person_id = p.id
where ct.amount = '30000' and ct.crypto_type = 'CryptoByte' and ni.cyberware_type = 'Access Implant'
```

```sql
select * from interrogation_log where person_id = 1050
```

```sql
select * from person p
inner join crypto_transaction ct on ct.person_id = p.id
inner join neural_implant ni on ni.person_id = p.id
inner join location_log ll on ll.person_id = p.id
where ct.amount = '50000' and ct.crypto_type = 'NeoCoin' and ll.sector = 'Corporate' and ll.timestamp = '21470220'
```

## Cyberpunk Mystery II

### Clues

Aegis Station went dark and the quantum failsafe failed. You vaguely remember that the incident happened on March 1, 2147,
and that an AI was moved into a ghost drive during the blackout. Start by finding the incident briefing from that date,
then follow the movement, device, and payment records until you can identify the runner, the insider, and the mastermind.

Failsafe collapsed at 21:09; vault scanners caught a Ghost Deck with six anomalies exiting toward Sector 9.
The runner is a Neural Broker based in Sector 9. Implant sync records show no sync for 10+ days (last sync on or before the 20th of February).

The buyer used a cloned clearance badge. Payment was exactly 45,000 SpectraCoin on March 1, 2147. Next, find the Security Chief on Core Deck with a Clearance Lattice implant.

The operation was funded by TWO payouts to the same person: 50,000 NeoCoin and 20,000 LuminaCredit.
The payer is a Lead Scientist in the Research Ring with four implants. Find who matches all of that.

### Queries

```sql
select * from incident_report where date = '21470301' and type = 'AI Breach'
```

```sql
select * from person p
inner join neural_implant ni on ni.person_id = p.id
inner join device d on d.person_id = p.id
inner join digital_log dl on dl.device_id = d.id
where ni.last_sync <= '21470220' and role = 'Neural Broker' and dl.anomaly_count = 6
```

```sql
select * from interrogation_log where person_id = 1212
```

```sql
select * from person p
inner join crypto_transaction ct on ct.person_id = p.id
inner join location_log ll on ll.person_id = p.id
inner join neural_implant ni on ni.person_id = p.id
where ct.amount = 45000 and ct.crypto_type = 'SpectraCoin' and ct.timestamp = 21470301 and role = 'Security Chief' and ll.sector = 'Core Deck' and ll.timestamp = 21470301 and ni.cyberware_type = 'Clearance Lattice'
```

```sql
select * from interrogation_log where person_id = 1206
```

```sql
select * from person p
inner join crypto_transaction ctn on ctn.person_id = p.id and ctn.amount = 50000 and ctn.crypto_type = 'NeoCoin'
inner join crypto_transaction ctl on ctl.person_id = p.id and ctl.amount = 20000 and ctl.crypto_type = 'LuminaCredit'
inner join neural_implant ni on ni.person_id = p.id
where p.role = 'Lead Scientist'
group by p.id having count(ni.id) = 4
```

## Cyberpunk Mystery III

### Clues

The Mirror Array in Neo-Tokyo was hijacked during a blackout, and the case file is missing the key specifics. You remember that the incident was a breach that occurred on March 12, 2147 and that it took place in Sector 6. Start by retrieving the incident report to recover the details, then use device telemetry, implant records, and interrogation logs to identify the runner, the insider, and the executive sponsor.

Mirror Array breach in Sector 6. Twin telemetry signatures detected: a Ghost Deck with six anomalies and a Neural Deck with four anomalies. The runner is a Neural Broker with five implants; last implant sync on or before March 1, 2147.

I ran the Mirror Array job, but I did not plan it. The buyer used a cloned clearance badge and paid exactly 45,000 SpectraCoin. They were a Security Chief on Core Deck with Clearance Lattice and Command Mesh implants.

The sponsor was a Corporate Exec using a Command Unit device that logged exactly two anomalies, and they had a Directive Stack implant.

### Queries

```sql
select * from incident_report where date = '21470312' and type='breach'
```

```sql
with devices as (
	select p.id from person p
	inner join device d on d.person_id = p.id
	inner join digital_log dl on dl.device_id = d.id
	inner join neural_implant ni on ni.person_id = p.id
	where dl.anomaly_count = 6 and d.device_type = 'Ghost Deck' and p.role = 'Neural Broker' and ni.last_sync <= 21470301
	group by (p.id)
	having count (distinct ni.id) = 5
	intersect
	select p.id from person p
	inner join device d on d.person_id = p.id
	inner join digital_log dl on dl.device_id = d.id
	inner join neural_implant ni on ni.person_id = p.id
	where dl.anomaly_count = 4 and d.device_type = 'Neural Deck' and p.role = 'Neural Broker' and ni.last_sync <= 21470301
	group by (p.id)
	having count (distinct ni.id) = 5
)

select * from person p
inner join devices d on d.id = p.id
inner join neural_implant ni on ni.person_id = p.id
inner join location_log ll on ll.person_id = p.id
where ni.last_sync <= 21470301 and p.role = 'Neural Broker' and ll.sector = 'Sector 6'
group by(p.id)
having count (distinct ni.id) = 5
```

```sql
select * from interrogation_log where person_id = 1301
```

```sql
select * from person p
inner join neural_implant ni on ni.person_id = p.id
inner join crypto_transaction ct on ct.person_id = p.id
inner join location_log ll on ll.person_id = p.id
where ni.cyberware_type in ('Clearance Lattice', 'Command Mesh') and role = 'Security Chief' and ll.sector = 'Core Deck'
and ct.amount = 45000 and ct.crypto_type = 'SpectraCoin'
group by(p.id)
having count(distinct ni.cyberware_type) = 2
```

```sql
select * from interrogation_log where person_id = 1306
```

```sql
select p.name
from person p
inner join device d on d.person_id = p.id
inner join digital_log dl on dl.device_id = d.id
inner join neural_implant ni on ni.person_id = p.id
where dl.anomaly_count = 2 and role = 'Exec' and p.sector = 'Corporate'
	and d.device_type = 'Command Unit' and ni.cyberware_type = 'Directive Stack'
group by(p.id)
```

## Undersea Mystery I

### Clues

A replacement pump never arrived, and the station is humming a worried tune after an alleged theft. Start by finding the incident report from July 18, 2091, then use that report's details to identify the onsite actor, the handler who filed the manifest edit, and the senior engineer who approved the overrides.

A replacement pump went missing. It was labeled as a Type-K coolant crate during the 05:00–06:00 intake window in Intake Bay A. The label swapper was a Cargo Handler who gained access to Intake Bay A twice during that window.

I swapped the label, but I did not plan it. A Logistics Tech in Module C-1 told me to do it and filed a manifest edit ticket for shipment 7002.

The request came from a Senior Engineer who approved two expedite overrides for Intake Bay A between July 15 and July 21, 2091.

### Queries

```sql
select * from incident_report where date = 20910718 and type = 'theft'
```

```sql
select * from person p
inner join access_log al on al.person_id = p.id
where p.role = 'Cargo Handler' and al.date = 20910718 and al.timestamp >= 0500 and al.timestamp <= 0600 and al.module = 'Intake Bay A'
group by (p.id)
having count(al.id) = 2
```

```sql
select * from interrogation_log where person_id = 2197
```

```sql
select * from person p
inner join work_order wo on wo.person_id = p.id
where p.role = 'Logistics Tech' and p.module = 'Module C-1' and wo.work_type = 'manifest edit' and wo.shipment_id = 7002
```

```sql
select * from interrogation_log where person_id = 2173
```

```sql
select * from person p
inner join override_approval ap on ap.person_id = p.id
where p.role = 'Senior Engineer' and ap.date >= 20910715 and ap.date <= 20910721 and ap.module = 'Intake Bay A'
group by(p.id)
having count(ap.id) = 2
```

## Undersea Mystery II

### Clues

Deep Horizon Station experienced catastrophic life support failure, and you've been handed an incomplete case file.
You vaguely remember that the incident was a sabotage that occurred on August 25, 2091 in Module D-7.
Start by retrieving the incident report from the station's database. The report mentions two witnesses who were present during the critical window.
Find them, interview them, and follow the evidence chain to identify both the perpetrator and the mastermind behind the sabotage.

Life support failure at 03:45. Two witnesses identified: Maintenance Tech from Module D-7 with most accesses 03:00-04:00, and Systems Engineer from Module E-2 with 2 Module D-7 diagnostic reports on 8/25.

I was running diagnostics in Module D-7 when I heard someone tampering with the oxygen recycler. I saw a Senior Tech with a specialized bypass tool kit. They had accessed the Security Hub the night before at 22:00 on August 24. The person was also involved in exactly 4 override approvals for safety systems in Module D-7 during the week of August 20-26, 2091. They seemed very familiar with the safety protocols.

I was monitoring systems remotely from Module E-2 when alerts started flooding in. I traced the bypass commands to a Senior Tech account. After cross-referencing, I found they had submitted exactly 3 equipment requisition work orders for Module D-7 between August 20 and August 26. The pattern suggested someone with deep system knowledge and premeditated access.

Look, I did the technical work, but I was following orders. The Station Director who authorized this has been on-station for years. They approved exactly 5 critical system overrides between August 15 and August 25, all for Module D-7. They also filed exactly 2 emergency protocol work orders for Command Center during that same period. The paper trail is there - they signed off on everything and made it look routine.

### Queries

```sql
select * from incident_report where date = 20910825 and type = 'sabotage' and module = 'Module D-7'
```

```sql
select p.name from person p
inner join access_log al on al.person_id = p.id
where p.role = 'Maintenance Tech' and p.module = 'Module D-7' and al.date = 20910825 and al.timestamp between 300 and 400 and al.module = 'Module D-7'
group by p.id, p.name
order by count(al.id) desc
limit 1
```

```sql
select p.name from person p
inner join work_order wo on wo.person_id = p.id
where p.role = 'Systems Engineer' and p.module = 'Module E-2' and wo.work_type = 'diagnostic' and wo.module = 'Module D-7' and wo.date = 20910825
group by p.id, p.name
having count(wo.id) = 2
```

```sql
select * from interrogation_log where person_id in (2333, 2322)
```

```sql
select p.name from person p
inner join access_log al on al.person_id = p.id
inner join override_approval oa on oa.person_id = p.id
inner join work_order wo on wo.person_id = p.id
where p.role = 'Senior Tech' and al.module = 'Security Hub' and al.date = 20910824 and al.timestamp = 2200
and oa.module = 'Module D-7' and oa.override_type = 'safety' and oa.date between 20910820 and 20910826
and wo.module = 'Module D-7' and wo.work_type = 'equipment requisition' and wo.date between 20910820 and 20910826
group by p.id, p.name
having count(distinct oa.id) = 4 and count(distinct wo.id) = 3
```

```sql
select p.name from person p
inner join override_approval oa on oa.person_id = p.id
inner join work_order wo on wo.person_id = p.id
where p.role = 'Station Director' and oa.module = 'Module D-7' and oa.override_type = 'critical' and oa.date between 20910815 and 20910825
and wo.module = 'Command Center' and wo.work_type = 'emergency protocol' and wo.date between 20910815 and 20910825
group by p.id, p.name
having count(distinct oa.id) = 5 and count(distinct wo.id) = 2
```
