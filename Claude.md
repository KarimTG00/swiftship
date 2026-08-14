# Spécification — Application Web de Gestion et de Suivi de Livraisons

## 1. Présentation du projet

L'application est une plateforme web destinée à une agence de livraison.

Elle possède deux grandes parties :

1. Une partie publique/vitrine destinée aux visiteurs et aux clients.
2. Une partie privée destinée aux utilisateurs internes de l'agence.

Le système permet à l'agence d'enregistrer des expéditions, de gérer leur évolution, de permettre aux clients de suivre leurs colis et de communiquer avec l'agence.

Le client final ne possède pas de compte classique avec email/mot de passe.

L'identité du client est gérée de manière anonyme grâce à un identifiant généré côté serveur et conservé dans un cookie persistant.

---

# 2. Acteurs du système

## 2.1 Admin / vendeur / agent de l'agence

C'est un utilisateur interne.

Il possède un système d'authentification classique.

Il peut :

- se connecter à l'application ;
- consulter les expéditions ;
- créer une expédition ;
- consulter les détails d'une expédition ;
- modifier l'évolution/statut d'une expédition ;
- consulter les conversations des clients ;
- répondre aux clients ;
- identifier un client grâce au numéro de tracking communiqué dans la conversation ;
- communiquer avec les livreurs ;
- consulter les informations relatives aux visiteurs/clients anonymes ;
- consulter les statistiques et informations disponibles dans son espace.

---

## 2.2 Client

Le client est le destinataire du colis.

Il ne possède pas de compte classique.

Il peut :

- accéder librement au site ;
- suivre un colis grâce à son numéro de tracking ;
- consulter l'évolution de son colis ;
- consulter l'historique de son colis ;
- envoyer un message à l'agence ;
- retrouver ses conversations lors de visites ultérieures.

Le client n'a pas besoin de :

- créer un compte ;
- fournir un email ;
- définir un mot de passe ;
- se connecter.

---

## 2.3 Livreur

Le livreur est un utilisateur interne chargé de la livraison.

Selon les règles métier existantes, il peut :

- consulter les colis qui lui sont attribués ;
- consulter les informations nécessaires à la livraison ;
- mettre à jour l'évolution d'un colis ;
- communiquer avec l'agence/vendeur.

Le livreur ne doit pas avoir accès aux informations internes qui ne sont pas nécessaires à son travail.

---

# 3. Concept principal : l'expédition

L'objet central de l'application est l'EXPÉDITION.

Une expédition représente un colis enregistré par l'agence.

Lorsqu'un vendeur crée une expédition, il renseigne notamment :

- nom du destinataire ;
- numéro de téléphone ;
- adresse ;
- ville ;
- destination ;
- distance/kilométrage ;
- taille du colis ;
- poids si disponible ;
- description du colis ;
- prix/valeur ;
- type de livraison ;
- informations supplémentaires nécessaires à l'agence.

Le système génère automatiquement :

- un identifiant interne ;
- un numéro de tracking unique ;
- la date de création ;
- le statut initial ;
- l'historique de l'expédition.

---

# 4. Numéro de tracking

Chaque expédition possède un numéro de tracking unique.

Exemple :

CAM-2026-928374

Le tracking sert à :

- identifier une expédition ;
- permettre au client de suivre son colis ;
- permettre au vendeur de retrouver une expédition ;
- permettre au vendeur d'identifier le colis lorsqu'un client lui communique son tracking.

IMPORTANT :

Le numéro de tracking n'est PAS l'identité du client.

Le tracking identifie uniquement le colis.

Il ne doit pas être utilisé comme système d'authentification du client.

---

# 5. Identité anonyme du client

Le client n'a pas de compte classique.

Lors de sa première visite, le serveur génère un identifiant aléatoire.

Exemple :

anonymousClientId = UUID/random identifier

Cet identifiant est associé à un cookie persistant.

Durée souhaitée :

1 an.

Conceptuellement :

Client
↓
Cookie
↓
anonymousClientId
↓
Client anonyme en base
↓
Conversations du client

Lorsqu'il revient sur le site avec le même navigateur/appareil, le cookie permet au serveur de retrouver son identité anonyme et donc ses conversations précédentes.

---

# 6. Pourquoi utiliser un cookie persistant

Le but est d'éviter d'obliger le client à créer un compte.

Exemple :

Jour 1 :

Client arrive
→ système génère anonymousClientId A
→ cookie enregistré
→ client envoie un message
→ conversation enregistrée

Un mois plus tard :

Client revient
→ cookie A envoyé automatiquement
→ serveur retrouve anonymousClientId A
→ serveur retrouve les conversations existantes

Le client peut donc continuer son utilisation sans authentification classique.

---

# 7. Adresse IP

L'adresse IP peut être enregistrée comme information technique.

Elle peut être utilisée pour :

- sécurité ;
- détection de spam ;
- rate limiting ;
- analyse ;
- détection d'activité suspecte.

Mais l'IP ne doit PAS être utilisée comme identité principale du client.

Une IP peut :

- changer ;
- être partagée par plusieurs utilisateurs ;
- appartenir à un réseau mobile ;
- être masquée par un VPN ;
- être partagée via NAT.

L'identité anonyme principale doit donc être basée sur le cookie et l'identifiant généré.

---

# 8. Conversations

Le système possède une messagerie permettant au client de communiquer avec l'agence.

Une conversation peut être associée à :

- anonymousClientId ;
- shipmentId lorsqu'il est connu ;
- vendeur/agent ;
- éventuellement livreur selon les règles métier.

Un même client peut avoir plusieurs conversations correspondant à plusieurs expéditions.

Exemple :

AnonymousClient A
|
├── Conversation 1 → Shipment CAM-001
|
├── Conversation 2 → Shipment CAM-002
|
└── Conversation 3 → Shipment CAM-003

---

# 9. Identification d'un client dans la messagerie

Le client peut envoyer un message sans fournir immédiatement son numéro de tracking.

Exemple :

Client :

"Bonjour, je voudrais savoir où est mon colis."

Le vendeur peut ne pas savoir à quelle expédition le message correspond.

Il peut alors demander :

"Pouvez-vous me communiquer votre numéro de tracking ?"

Le client répond :

"CAM-2026-928374"

Le vendeur utilise alors le tracking pour rechercher l'expédition.

Il peut retrouver :

- le destinataire ;
- le numéro de téléphone ;
- l'adresse ;
- la destination ;
- le statut ;
- le livreur ;
- les informations de l'expédition.

La conversation peut ensuite être associée à l'expédition correspondante.

---

# 10. Important : séparation des conversations

Il faut distinguer les conversations externes et internes.

## Conversation client

Client ↔ Agence / vendeur

Le client peut :

- poser une question ;
- demander l'état du colis ;
- signaler un problème ;
- demander des informations.

## Conversation interne

Vendeur ↔ Livreur

Cette conversation peut contenir des informations internes à l'agence.

Le client ne doit jamais pouvoir consulter les conversations internes.

---

# 11. Suivi d'un colis

La page de suivi permet au client de rechercher son colis.

URL :

/tracking

Le client voit :

Numéro de suivi

[________________________]

[ Suivre mon colis ]

Après validation :

/tracking/:trackingNumber

La page affiche :

- numéro de tracking ;
- statut actuel ;
- origine ;
- destination ;
- informations publiques du colis ;
- historique ;
- événements de livraison ;
- date/heure des événements ;
- estimation de livraison si disponible.
- un itiniraire montrant le lieux de depart du colis , jusqu'a l'adresse de destination
- une barre de progression qui permet de visualiser l'avancer de la livraison

---

# 12. Timeline du colis

Exemple :

✓ Expédition créée
13 août 2026 — 09:24

✓ Colis enregistré
13 août 2026 — 10:15

✓ Colis pris en charge
13 août 2026 — 11:20

✓ Départ de Douala
13 août 2026 — 14:20

● En transit
13 août 2026 — 16:40

○ Arrivée à destination

○ En cours de livraison

○ Livré

Les statuts doivent être définis selon la logique métier réelle de l'agence.

---

# 13. Page d'accueil — /

La page d'accueil est la vitrine principale.

Elle doit être orientée vers :

- présentation de l'agence ;
- confiance ;
- découverte des services ;
- suivi rapide d'un colis ;
- contact.

## Navbar

Contenu recommandé :

- Logo
- Accueil
- Services
- À propos
- Suivi de colis
- Contact
- bouton "Suivre mon colis"

Si nécessaire :

- Connexion

La connexion ne concerne que les utilisateurs internes.

---

# 14. Hero de la page d'accueil

La première section doit immédiatement expliquer l'activité.

Exemple :

# Votre colis, notre priorité.

Sous-titre :

"Une solution simple et fiable pour expédier et suivre vos colis."

Le suivi doit être immédiatement accessible.

Exemple :

Entrez votre numéro de suivi

[ CAM-2026-928374 ]

[ Suivre ]

Le tracking est le CTA principal de la page.

---

# 15. Section "Pourquoi nous choisir ?"

Présenter 3 à 4 avantages.

Exemples :

## Suivi en temps réel

Suivez l'évolution de votre colis à chaque étape.

## Rapidité

Des solutions adaptées à vos besoins et à vos délais.

## Fiabilité

Vos colis sont pris en charge avec attention.

## Transparence

Vous pouvez consulter l'évolution de votre expédition.

---

# 16. Section "Comment ça fonctionne ?"

Présenter le processus en 4 étapes.

### 01 — Enregistrement

L'agence enregistre votre colis.

### 02 — Numéro de tracking

Un numéro de suivi unique est attribué.

### 03 — Acheminement

Le colis est transporté vers sa destination.

### 04 — Livraison

Le colis arrive chez le destinataire.

---

# 17. Section Services sur la homepage

Afficher un aperçu des services.

Exemples :

Chaque service doit avoir :

- icône/image ;
- titre ;
- courte description ;
- bouton "En savoir plus".

Le bouton renvoie vers :

/services

---

# 19. Section chiffres clés

Si des données réelles existent, afficher :

- nombre de colis livrés ;
- nombre de villes desservies ;
- nombre de clients ;
- taux de livraison réussie ;
- années d'expérience.

Ne jamais inventer de chiffres.

---

# 20. Section témoignages

Afficher quelques témoignages clients si l'agence en possède.

Exemple :

"Service rapide et simple. J'ai pu suivre mon colis facilement."

Maximum quelques témoignages afin de ne pas surcharger la page.

---

# 21. CTA final homepage

Exemple :

"Besoin de suivre votre colis ?"

[ Suivre mon colis ]

Ou :

"Une question concernant votre livraison ?"

[ Nous contacter ]

---

# 22. Footer

Le footer doit contenir :

## Navigation

- Accueil
- Services
- À propos
- Suivi
- FAQ
- Contact

## Services

- Livraison standard
- Livraison express
- Livraison à domicile
- Livraison inter-ville

## Contact

- téléphone ;
- email ;
- WhatsApp ;
- adresse ;
- horaires.

## Informations

- Conditions générales ;
- Politique de confidentialité.

## Réseaux sociaux

Afficher uniquement les réseaux sociaux réellement utilisés par l'agence.

---

# 23. Page Services — /services

Cette page présente les services en détail.

## Hero

Titre :

"Nos services de livraison"

Sous-titre expliquant la proposition de valeur.

## Services

Chaque service doit avoir :

- titre ;
- description ;
- avantages ;
- zones ;
- délai indicatif si disponible ;
- conditions éventuelles.

Exemples :

### Livraison standard

Pour les colis ne nécessitant pas une livraison urgente.

### Livraison express

Pour les colis nécessitant un acheminement prioritaire.

### Livraison inter-ville

Pour les expéditions entre différentes villes.

### Livraison à domicile

Livraison directement à l'adresse du destinataire.

---

# 24. Page À propos — /about

Cette page présente l'entreprise.

## Notre histoire

Présenter :

- création ;
- origine ;
- problème initial ;
- évolution ;
- développement.

## Notre mission

Expliquer ce que l'agence cherche à apporter aux clients.

## Nos valeurs

Exemples :

- fiabilité ;
- rapidité ;
- transparence ;
- proximité ;
- professionnalisme.

## Notre réseau

Présenter les villes/régions couvertes.

## Chiffres clés

Utiliser uniquement des données réelles.

## CTA

Suivre un colis ou contacter l'agence.

---

# 25. Page Contact — /contact

Cette page doit être pratique.

## Coordonnées

Afficher :

- téléphone ;
- WhatsApp ;
- email ;
- adresse ;
- horaires.

## Formulaire

Champs :

- nom ;
- téléphone ;
- email ;
- sujet ;
- message ;
- numéro de tracking (optionnel).

Le tracking est optionnel car le client peut contacter l'agence pour une question générale.

---

# 26. Page FAQ — /faq

Questions recommandées :

- Comment suivre mon colis ?
- Où trouver mon numéro de tracking ?
- Que faire si mon tracking est introuvable ?
- Combien de temps prend une livraison ?
- Quelles villes sont desservies ?
- Que faire si mon colis est en retard ?
- Que faire si le destinataire est absent ?
- Comment contacter l'agence ?
- Comment signaler un problème ?
- Comment modifier une information concernant une livraison ?

---

# 27. Authentification interne

L'authentification classique concerne uniquement les utilisateurs internes.

Routes :

/login

/forgot-password

/reset-password

Le client ne doit pas être redirigé vers un système de connexion classique.

---

# 28. Dashboard vendeur

Route :

/dashboard

Le dashboard doit présenter rapidement :

- nombre total d'expéditions ;
- expéditions en cours ;
- expéditions livrées ;
- expéditions en attente ;
- nouveaux messages ;
- dernières expéditions ;
- éventuellement statistiques.

---

# 29. Liste des expéditions

Route :

/shipments

Le vendeur peut voir toutes les expéditions qu'il a enregistrées.

Chaque ligne peut afficher :

- tracking ;
- destinataire ;
- destination ;
- statut ;
- date ;
- livreur ;
- dernière mise à jour.

Fonctionnalités :

- recherche ;
- filtre par statut ;
- filtre par destination ;
- filtre par date ;
- recherche par tracking ;
- ouverture du détail.

---

# 30. Création d'une expédition

Route :

/shipments/new

Formulaire comprenant les informations métier nécessaires.

Après création :

Afficher une confirmation :

Expédition créée avec succès.

Tracking :

CAM-2026-928374

Actions :

- Copier le tracking ;
- partager le tracking ;
- voir l'expédition.

---

# 31. Détail d'une expédition

Route :

/shipments/:id

Afficher :

## Informations générales

- tracking ;
- date ;
- statut ;
- destination ;
- distance.

## Informations destinataire

- nom ;
- téléphone ;
- adresse ;
- ville.

## Informations colis

- taille ;
- poids ;
- description ;
- valeur/prix.

## Évolution

Timeline complète.

## Livreur

Livreur affecté.

## Conversation

Accès à la conversation associée.

---

# 32. Messagerie vendeur

Route :

/messages

Le vendeur voit les conversations des clients.

La liste peut afficher :

- conversation ;
- dernier message ;
- date ;
- nombre de messages non lus ;
- tracking lorsqu'il est connu ;
- client/destinataire lorsqu'il est identifié.

Une conversation inconnue peut apparaître comme :

"Client non identifié"

Lorsque le client communique son tracking, le vendeur peut identifier l'expédition.

---

# 33. Notifications

Le vendeur doit pouvoir être informé :

- nouveau message client ;
- changement important de statut ;
- nouvelle expédition ;
- nouvelle attribution de livraison ;
- autres événements métier.

---

# 34. Espace livreur

Routes :

/driver/dashboard
/driver/shipments
/driver/shipments/:id
/driver/messages

Le livreur peut :

- voir ses livraisons ;
- voir les détails nécessaires ;
- mettre à jour les statuts autorisés ;
- communiquer avec l'agence.

---

# 35. Architecture des routes

## Public

/
/services
/about
/tracking
/tracking/:trackingNumber
/faq
/contact

## Authentification

/login
/forgot-password
/reset-password

## Vendeur

/dashboard
/shipments
/shipments/new
/shipments/:id
/messages
/notifications
/profile

## Livreur

/driver/dashboard
/driver/shipments
/driver/shipments/:id
/driver/messages

---

# 36. Principes UX

## Le tracking doit être extrêmement accessible

Un visiteur doit pouvoir :

Site
→ Suivi
→ entrer le tracking
→ voir le colis

Sans compte.

## Le site public doit être simple

La partie vitrine doit principalement répondre à :

1. Qui êtes-vous ?
2. Que proposez-vous ?
3. Où livrez-vous ?
4. Comment suivre mon colis ?
5. Comment vous contacter ?

## L'espace interne est différent

La partie vendeur/livreur est une application métier.

Elle doit privilégier :

- informations ;
- tableaux ;
- filtres ;
- actions ;
- notifications ;
- messagerie.

Elle ne doit pas être conçue comme une vitrine.

---

# 37. Règles importantes de sécurité

Le numéro de tracking ne doit pas être considéré comme une authentification.

Le client anonyme ne doit pas pouvoir accéder à des informations internes.

La page publique de tracking doit uniquement retourner les informations considérées comme publiques.

Les conversations internes vendeur/livreur doivent être protégées.

Les cookies contenant l'identifiant de session doivent être configurés de manière sécurisée.

L'identifiant anonyme doit être suffisamment aléatoire et impossible à deviner.

L'adresse IP ne doit pas servir d'identifiant principal.

Les données personnelles du destinataire doivent être protégées.

---

# 38. Priorités de développement

## Priorité 1 — Fonctionnalités métier

- authentification interne ;
- création d'expédition ;
- génération du tracking ;
- gestion des expéditions ;
- gestion des statuts ;
- historique ;
- suivi public ;
- identité anonyme ;
- cookie persistant ;
- conversations ;
- messagerie ;
- identification d'une expédition depuis une conversation.

## Priorité 2 — Interface interne

- dashboard ;
- liste des expéditions ;
- détail ;
- messagerie ;
- notifications ;
- gestion des livreurs.

## Priorité 3 — Vitrine

- accueil ;
- services ;
- à propos ;
- suivi ;
- contact ;
- FAQ ;
- footer ;
- responsive design.

---

# 39. Structure finale du produit

Le produit doit être compris comme trois systèmes complémentaires :

                        APPLICATION
                             |
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
           VITRINE       ESPACE AGENCE    CLIENT
              │              │              │
              │              │              │
        Présentation      Gestion        Suivi
        Services          Colis          Tracking
        Contact           Messages       Messages
        À propos          Livreurs
        FAQ               Statistiques
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                         EXPÉDITION
                             │
                  ┌──────────┼──────────┐
                  │          │          │
                  ▼          ▼          ▼
               Tracking   Statuts    Messages

La logique centrale est :

EXPÉDITION
↓
TRACKING
↓
SUIVI PUBLIC

et :

CLIENT ANONYME
↓
COOKIE PERSISTANT
↓
CONVERSATIONS

et :

VENDEUR AUTHENTIFIÉ
↓
GESTION DES EXPÉDITIONS
↓
MESSAGERIE / SUIVI / GESTION

Le système ne doit pas transformer le numéro de tracking en compte utilisateur.

Le tracking identifie le colis.
Le cookie persistant permet de reconnaître le client anonyme.
L'authentification classique est réservée aux utilisateurs internes.
