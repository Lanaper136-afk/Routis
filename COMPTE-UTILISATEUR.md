# Comptes utilisateurs & synchronisation (Supabase)

Le site permet maintenant de créer un compte (email + mot de passe) pour
sauvegarder sa progression (panneaux appris, scores, historique d'examens,
statistiques de révision) et la retrouver sur n'importe quel appareil.

Ça marche déjà pour tout le monde en local (localStorage) même sans compte —
le compte n'est qu'une option en plus, jamais obligatoire.

## 1. Étape obligatoire avant que les comptes fonctionnent : exécuter le SQL

1. Va sur [supabase.com](https://supabase.com) et ouvre ton projet
   (`wzsfwejmfxuuzljjavdb`).
2. Dans le menu de gauche : **SQL Editor** > **New query**.
3. Ouvre le fichier `supabase-setup.sql` (à la racine de ce dossier `site/`),
   copie tout son contenu, colle-le dans l'éditeur SQL de Supabase.
4. Clique sur **Run**.
5. Vérifie que ça s'est bien passé :
   - **Table Editor** doit maintenant afficher une table `progress`.
   - **Authentication > Policies** doit lister 4 policies pour cette table
     (`progress_select_own`, `progress_insert_own`, `progress_update_own`,
     `progress_delete_own`).

Sans cette étape, la création de compte et la connexion peuvent fonctionner
(c'est géré par Supabase Auth, indépendant de cette table), mais la
synchronisation de la progression échouera silencieusement (le site reste
utilisable en local uniquement, sans erreur visible côté utilisateur).

Ce script est rejouable sans risque si tu dois le relancer un jour.

## 2. Emails de confirmation à l'inscription

Par défaut, Supabase envoie un email de confirmation à chaque création de
compte : le compte n'est utilisable pour se connecter qu'après avoir cliqué
sur le lien reçu par email. C'est le comportement standard et recommandé en
production (ça évite les faux comptes avec des emails qui n'appartiennent à
personne).

**Pour tester plus vite pendant le développement**, tu peux désactiver
temporairement cette confirmation :

1. Dashboard Supabase > **Authentication** > **Providers**.
2. Clique sur **Email**.
3. Désactive l'option **"Confirm email"**.
4. Sauvegarde.

Pense à la réactiver avant la mise en ligne définitive si tu veux éviter les
faux comptes.

Tu peux aussi personnaliser le contenu de l'email de confirmation dans
**Authentication > Email Templates**.

## 3. Comment tester que ça marche, une fois déployé

1. Ouvre le site déployé, clique sur **Se connecter** (en haut à droite).
2. Onglet **Créer un compte** : renseigne un email que tu peux consulter,
   et un mot de passe d'au moins 6 caractères, puis valide.
3. Si la confirmation par email est activée (comportement par défaut, voir
   ci-dessus) : va relever cet email, clique sur le lien de confirmation.
4. Reviens sur le site, clique sur **Se connecter**, connecte-toi avec le
   même email/mot de passe.
5. Le bouton doit maintenant afficher ton adresse email ("Mon compte").
6. Apprends quelques panneaux, fais un mini quiz ou un examen blanc : ces
   actions déclenchent une synchronisation automatique vers Supabase
   (avec un léger délai de 2-3 secondes, pour ne pas spammer l'API).
7. Vérifie dans Dashboard Supabase > **Table Editor** > `progress` qu'une
   ligne existe bien pour cet utilisateur et que ses colonnes
   (`sign_status`, `q_stats`, etc.) se remplissent après quelques actions.
8. Pour vérifier la synchronisation entre appareils : connecte-toi avec le
   même compte dans un autre navigateur (ou en navigation privée) — la
   progression déjà enregistrée doit apparaître automatiquement.
9. Pour vérifier le mode hors-ligne : coupe le réseau (ou utilise le mode
   avion), continue à utiliser le site normalement (tout doit continuer à
   fonctionner en local, sans erreur visible), puis reconnecte le réseau —
   la synchronisation doit reprendre automatiquement en arrière-plan.

## 4. Limites connues

- La synchronisation compare un horodatage côté serveur et un horodatage
  local (`localUpdatedAt`) pour décider quelle copie garder : c'est une
  stratégie simple ("la plus récente gagne"), pas une vraie fusion
  champ par champ. Si tu modifies ta progression en parallèle sur deux
  appareils hors-ligne en même temps, la copie la plus ancienne des deux
  sera écrasée au prochain passage en ligne.
- La réinitialisation de mot de passe envoie un email avec un lien qui
  renvoie vers l'URL du site telle que configurée dans Dashboard Supabase >
  **Authentication > URL Configuration** (Site URL / Redirect URLs) : pense
  à renseigner l'URL réelle de ton site déployé là-bas.
- La clé utilisée côté client (`sb_publishable_...`) est volontairement
  publique — la vraie protection des données vient des policies RLS créées
  par `supabase-setup.sql`. Ne mets jamais la clé "service_role" dans le
  code du site.
