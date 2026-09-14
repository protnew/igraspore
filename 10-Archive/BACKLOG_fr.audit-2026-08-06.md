# iGraSpore — Backlog d'idées pour le redémarrage

## Condition de redémarrage
Se démarquer de Thrive. NE PAS faire un « clone de Spore ». Créer un produit unique.

## Propositions concrètes

### 1. 🔬 BioLab Simulator — Simulation éducative en navigateur
**Créneau :** Module éducatif intégrable pour les écoles/cours de biologie
- 100 espèces réelles avec précision scientifique
- Paramètres : taille réelle en μm, température réelle, pH réel
- L'enseignant intègre un `<iframe>` sur la page du cours
- L'élève observe l'évolution de l'écosystème
- **Monétisation :** Vente B2B aux écoles/universités
- **Techniquement :** Un fichier HTML, compatible iframe, sans serveur

### 2. 📱 Microcosm — PWA mobile « une flaque dans votre poche »
**Créneau :** Simulateur casual sur téléphone (navigateur, sans installation)
- Ouvrir un lien → voir une flaque avec des bactéries
- Contrôle tactile : le doigt déplace l'organisme
- Caméra du téléphone = « microscope » (overlay AR ?)
- Partager la flaque avec des amis (seed unique par flaque)

### 3. 🧬 Taxonomy Explorer — Carte interactive de 100 espèces
**Créneau :** Encyclopédie visuelle des micro-organismes
- Pas un jeu, mais un atlas interactif
- Carte : qui mange qui, qui vit où
- Filtres : température, pH, profondeur, environnement
- Chaque espèce = fiche avec données réelles
- Possibilité de « lancer la simulation » pour un ensemble d'espèces

### 4. 🎓 Professeur de biologie IA basé sur la simulation
- Simulation comme support visuel en cours
- Les étudiants voient comment l'IA contrôle les organismes
- Possibilité de modifier les paramètres et observer les conséquences
- Format : un fichier HTML, fonctionne depuis un projecteur

## Ce qu'il faut conserver
- Base de données de 100 espèces réelles (spécifications déjà prêtes)
- Tableaux paramétriques (42 décisions déjà prises)
- Stack : JS pur + Canvas 2D, un fichier HTML
