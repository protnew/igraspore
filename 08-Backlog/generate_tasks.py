import sqlite3
import os

db_path = r'c:\Obsidian\New\Projects\iGraSpore V2\08-Backlog\backlog_iGraSpore_V2.db'
os.makedirs(os.path.dirname(db_path), exist_ok=True)

conn = sqlite3.connect(db_path, timeout=10.0)
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS tasks (
    task_id TEXT PRIMARY KEY,
    block TEXT,
    subblock TEXT,
    title TEXT,
    description TEXT,
    acceptance_criteria TEXT,
    loc_capacity INTEGER,
    user_value INTEGER,
    priority_score INTEGER,
    status TEXT
)''')

tasks = [
    ('TSK-BIO-001', 'Biology', 'Digestion', 'Implement Phagocytosis energy loss', 'Add a dynamic energy cost for predators when prey struggles during phagocytosis. Larger prey should drain more predator energy before being fully consumed.', 'Prey size > 50% predator size costs predator 2 energy/sec during consumption. LOC < 30. Passes Vitest.', 30, 8, 85, 'Backlog'),
    ('TSK-BIO-002', 'Genetics', 'Mutation', 'Starvation-induced hypermutation', 'When parentEnergy < 10% of repEnergy, increase the mutation chance from 15% to 45% during cell division to simulate stress-induced mutagenesis.', 'Hypermutation triggers correctly under starvation. Mutation rates scaled. LOC < 20. Passes Vitest.', 20, 9, 90, 'Backlog'),
    ('TSK-BIO-003', 'Biology', 'Metabolism', 'Cyst formation genetic threshold', 'Make the cyst formation threshold (currently hardcoded <5 energy or extreme temp) dependent on a new genetic variable `cystThreshold`.', 'cystThreshold integrated into doCyst checks. Defaults to 5. LOC < 40.', 40, 7, 75, 'Backlog'),
    ('TSK-BIO-004', 'Genetics', 'Drift', 'Genetic drift over generations', 'Implement passive genetic drift where sizeMult and speedMult slowly shift by +/- 1% every generation even without active mutation events.', 'generation increments trigger 1% drift. LOC < 20. Passes Vitest.', 20, 6, 70, 'Backlog'),
    ('TSK-BIO-005', 'Biology', 'Aging', 'Age-related metabolic degradation for Eukaryotes', 'Scale baseMetab by age for Eukaryotes. After age 500, metab should exponentially increase by 1.05^((age-500)/10).', 'baseMetab multiplier applied based on age > 500 for isEuk. LOC < 15. Passes Vitest.', 15, 8, 80, 'Backlog'),
    ('TSK-BIO-006', 'Genetics', 'Resistance', 'Toxins resistance evolution', 'Utilize the `acidResist` gene to reduce damage and speed penalties when eating toxic phytoplankton or moving through toxic clouds.', 'acidResist reduces toxic speed penalty (0.1 to 0.1+0.8*acidResist). LOC < 30.', 30, 9, 88, 'Backlog'),
    ('TSK-BIO-007', 'Biology', 'Reproduction', 'Reproduction energy cost split scaling', 'Instead of a hard 50/50 energy split during division, allow asymmetric division (e.g., 60/40) based on a new `asymDiv` genetic trait, common in budding.', 'asymDiv trait added. Energy split uses asymDiv ratio. LOC < 30. Passes Vitest.', 30, 7, 78, 'Backlog'),
    ('TSK-BIO-008', 'Biology', 'Predation', 'Venom effect strength linked to size', 'Make the venom effect (speedMult drop) scale dynamically with the ratio of predator size to venomous prey size. Huge predators ignore tiny venom.', 'Venom penalty is inversely proportional to pred.size/prey.size. LOC < 25.', 25, 8, 82, 'Backlog'),
    ('TSK-BIO-009', 'Genetics', 'Adaptation', 'O2 tolerance offset mutation ranges', 'Expand the o2Offset mutation to allow organisms to adapt to anoxic environments (deep water) by reducing their O2 respiration dependency over generations.', 'o2Offset shifts limit by up to -10, reducing respiration O2 cost. LOC < 30. Passes Vitest.', 30, 9, 85, 'Backlog'),
    ('TSK-BIO-010', 'Genetics', 'HGT', 'Horizontal gene transfer between bacteria', 'Implement conjugation. When two prokaryotes are in close proximity and one has high energy, 5% chance to average their tempOffset and acidResist.', 'Conjugation mechanic added for prokaryotes. 5% chance near distance. LOC < 50.', 50, 10, 95, 'Backlog'),
    ('TSK-BIO-011', 'Biology', 'Locomotion', 'Flagella efficiency mutation', 'Link flagella speed boost to a new metabolic cost. Faster flagella (higher speedMult) exponentially increase baseMetab.', 'baseMetab calculation includes speedMult^1.5 for flagella users. LOC < 20. Passes Vitest.', 20, 8, 80, 'Backlog'),
    ('TSK-BIO-012', 'Genetics', 'Morphology', 'Cell wall thickness mutation', 'Introduce `cellWall` thickness trait. Higher thickness increases acidResist and reduces predation damage, but lowers speedMult.', 'cellWall trait added. Impacts speed and damage taken. LOC < 40.', 40, 9, 85, 'Backlog'),
    ('TSK-BIO-013', 'Biology', 'Metabolism', 'Bioluminescence energy consumption', 'If an organism has bioluminescence flags, drain 0.5 energy/sec but reduce predation risk from non-sight predators by blinding them temporarily.', 'Bioluminescence drains energy, flashes attackers. LOC < 30. Passes Vitest.', 30, 7, 75, 'Backlog'),
    ('TSK-BIO-014', 'Genetics', 'Symbiosis', 'Endosymbiosis initial mechanic', 'If a parasite stays attached to a host for >60s without killing it, 1% chance it becomes a permanent organelle (chloroplast or mitochondrion analog).', 'Parasite object converted to bioFlag organelle. LOC < 60. Passes Vitest.', 60, 10, 95, 'Backlog'),
    ('TSK-BIO-015', 'Biology', 'Survival', 'Spore survival time vs DNA points', 'Scale the maximum cyst survival time (currently 25s) with accumulated DNA points or generation number. Older lineages survive longer.', 'cystT limit scaled by generation (25s + gen*2s). LOC < 15.', 15, 6, 70, 'Backlog'),
    ('TSK-BIO-016', 'Genetics', 'Sensors', 'Chemotaxis pheromone sensitivity mutation', 'Add `chemoSens` gene. High sensitivity allows detecting food/danger from 2x distance but consumes slightly more energy.', 'Detection radius multiplied by chemoSens. Energy drain +0.1. LOC < 30. Passes Vitest.', 30, 8, 82, 'Backlog'),
    ('TSK-BIO-017', 'Biology', 'Behavior', 'Biofilm formation genetic trait', 'Organisms with `biofilm` trait aggregate on the bottom (y > PD-50) and reduce their metab by 70%.', 'biofilm behavior logic added near bottom of puddle. LOC < 40.', 40, 8, 85, 'Backlog'),
    ('TSK-BIO-018', 'Genetics', 'Metabolism', 'Photosynthesis efficiency vs depth mutation', 'Introduce `photoAdapt` gene. Determines if algae are optimized for high-light (surface) or low-light (deep water) environments.', 'photoAdapt shifts the optimal light level for photosynthesis. LOC < 35. Passes Vitest.', 35, 9, 88, 'Backlog'),
    ('TSK-BIO-019', 'Genetics', 'Immunity', 'Viral infection resistance gene', 'Implement CRISPR-like gene `virusResist`. Reduces chance of infection upon virus contact from 100% to as low as 20%.', 'virus contact logic checks target.virusResist. LOC < 20. Passes Vitest.', 20, 10, 92, 'Backlog'),
    ('TSK-BIO-020', 'Biology', 'Immunity', 'Colony Macrophages', 'In chain-flagged colony species, 5% of cells differentiate into defensive nodes that actively hunt approaching viruses or small parasites.', 'Flocking AI includes defender differentiation. LOC < 60.', 60, 9, 90, 'Backlog'),
    ('TSK-BIO-021', 'Biology', 'Digestion', 'Predator digestion rate mutation', 'Add `digestSpeed` trait. Faster digestion empties stomach quicker (allowing more eating) but recovers 10% less energy total.', 'digestSpeed modifies stomach energy/size reduction. LOC < 30. Passes Vitest.', 30, 8, 85, 'Backlog'),
    ('TSK-BIO-022', 'Genetics', 'Adaptation', 'Heat shock proteins mutation', 'Allow `tempOffset` mutation to broaden the survivable temperature range, not just shift it. (e.g. tMin-5 to tMax+12 becomes tMin-10 to tMax+20).', 'tempRange dynamically expanded by heatShock gene. LOC < 25.', 25, 9, 88, 'Backlog'),
    ('TSK-BIO-023', 'Biology', 'Parasitism', 'Parasitic infection energy drain scaling', 'Scale the parasite energy drain (currently hardcoded 8/s) based on the relative size of the parasite to the host.', 'Parasite drain formula updated to (parasiteSize/hostSize)*15. LOC < 20.', 20, 7, 78, 'Backlog'),
    ('TSK-BIO-024', 'Genetics', 'Reproduction', 'Separation impulse force mutation', 'Make the DIV_SEPARATION push force a genetic trait `divForce`. Some cells separate violently, others stick together forming chains.', 'pushForce uses divForce trait. Low divForce enables chain forming. LOC < 25. Passes Vitest.', 25, 6, 75, 'Backlog'),
    ('TSK-BIO-025', 'Biology', 'Behavior', 'Cannibalism trait logic', 'Add `cannibal` gene. If starving (energy < 20) and no other food, predators can eat their own species, overriding normal food web rules.', 'AUTO-EAT logic ignores same-species check if starving and cannibal==true. LOC < 30.', 30, 9, 90, 'Backlog')
]

c.executemany('''
    INSERT OR REPLACE INTO tasks 
    (task_id, block, subblock, title, description, acceptance_criteria, loc_capacity, user_value, priority_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', tasks)

conn.commit()
conn.close()
print("Successfully generated and inserted 25 Biology/Genetics tasks into the database.")
