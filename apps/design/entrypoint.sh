#!/bin/sh
set -e

# Point d'entrée design — ajoute ici d'éventuelles étapes de démarrage
# (warm-up, vérifications) avant de lancer le serveur React Router.
exec pnpm start
