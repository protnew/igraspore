# iGraSpore — Architecture

## Concept
Simulation de la vie des micro-organismes dans une flaque. 100 espèces réelles de bactéries, protozoaires, champignons.
Carte 2D infinie avec lumière solaire, nutriments, température.
Le joueur contrôle un organisme, évolue, mange les autres.

## Stack technique
- **Un seul fichier HTML** (Canvas + JS) — fonctionne sans serveur, file:// OK
- **Aucune dépendance** — JS pur
- **GitHub Pages** — déploiement

## Architecture du moteur
1. **World** — carte infinie (chunk-based), chaque chunk 512×512 px
2. **Environment** — lumière solaire (profondeur/heure), température, pH, nutriments
3. **Organism** — classe de base : position, énergie, taille, vitesse, ADN (paramètres)
4. **Species** — 100 espèces prédéfinies avec caractéristiques réelles
5. **Player** — contrôle de l'organisme du joueur (WASD + souris)
6. **Ecosystem** — réseau trophique : producteurs → consommateurs → décomposeurs
7. **Renderer** — Canvas 2D, caméra suit le joueur, zoom

## Niveaux d'organisation
- **Producteurs** (photosynthétiques) : cyanobactéries, algues
- **Consommateurs I** : bactéries prédatrices, petits flagellés
- **Consommateurs II** : amibes, ciliés
- **Consommateurs III** : gros protozoaires, rotifères
- **Décomposeurs** : champignons, bactéries destructrices

## Mécaniques clés
- Division cellulaire (reproduction)
- Phagocytose (alimentation)
- Photosynthèse (producteurs)
- Chimosynthèse
- Mouvement : flagelles, cils, pseudopodes
- Kystes (dormance en conditions défavorables)
- Taxis : phototaxie, chimiotaxie
- Slime et biofilms

## Contrôles
- WASD — mouvement
- Souris — direction d'attaque/mouvement
- Espace — sprint (consomme de l'énergie)
- E — manger/phagocytose
- Q — division (quand l'énergie est suffisante)
- Tab — tableau des espèces
- Scroll — zoom
