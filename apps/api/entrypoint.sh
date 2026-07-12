#!/bin/sh
set -e

# Point d'entrée api — ajoute ici les migrations DB ou autres étapes
# d'initialisation avant de lancer le serveur NestJS.
exec pnpm run start:prod
