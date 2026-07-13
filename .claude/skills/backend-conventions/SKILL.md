---
name: backend-conventions
description: Structure et règles back-end NestJS (DDD + Clean Architecture). À utiliser pour créer ou modifier du code back-end — use-cases, controllers, repositories, services infra, mappers, errors — ou pour savoir dans quelle couche placer un fichier.
---

# Back-end — DDD + Clean Architecture

L'architecture back-end est organisée en 4 zones à responsabilités distinctes sous `src/`.

```
src/
├── domains/        # ❤️ Logique métier
├── infrastructures/          # 🔌 Implémentations concrètes et services tiers (DB, APIs externes, minio, stripe...)
├── presentations/   # 🚪 Points d'entrée (HTTP, queues, workers)
└── shared/         # 🔧 Utilitaires et types transversaux (non-métier)
```

## `domains/` — Logique métier

```
domains/
├── repository/    # Interfaces d'accès aux données
├── mappers/       # Transformation entité ↔ DTO
├── use-cases/     # Cas d'usage métier (commandes / queries)
├── validators/    # Validation des données entrantes
├── helpers/       # Fonctions utilitaires fonctionnelles qui se limitent au domaine (pures)
├── types/         # Types partagés au sein du domaine
├── errors/        # Classes d'erreurs métier (étendent DomainError)
└── *.const.ts     # Constantes métier
    *.module.ts     # Module NestJS du domaine
```

- ❌ Aucune dépendance vers `presentations/`.
- ✅ Les `use-cases` orchestrent : `repository` + `validators` + `mappers`.
- ✅ Les `errors/` étendent une classe de base commune (`DomainError`).
- ✅ Chaque domaine doit être un module NestJS indépendant
- ❌ Deux domaines ne doivent jamais dépendre l'un de l'autre  dupliquer la logique métier d'un domaine dans un autre. Si un domaine a besoin de la logique d'un autre, il faut créer un `use-case` dans le domaine qui expose cette logique.

## `infrastructures/` — Services externes

```
infrastructures/
├── *.config.ts    # Configuration des services externes
└── *.service.ts   # Implémentation des repositories et services
```

- ✅ Toujours implémenter une interface déclarée dans `domains/`.
- ✅ Un fichier `.config.ts` par service externe.
- ❌ Jamais de logique métier ici — uniquement de l'accès aux données.

## `presentations/` — Points d'entrée

```
presentations/
  <feature-name>/
    ├── controllers/      # Endpoints HTTP (REST)
    ├── workers/          # Traitements de fond (crons, schedulers)
    └── queue-consumers/  # Consommateurs de messages (BullMQ)
```

- ✅ Les controllers **délèguent** aux `use-cases` — rien de plus.
- ✅ Validation des inputs HTTP via les `validators/` du domaine.
- ✅ Une feature est un regroupement de controllers, workers et queue-consumers qui partagent plusieurs domaines sous un nom qui les caractérise.
- ❌ Pas de requête DB ni de logique conditionnelle métier dans un controller.

## `shared/` — Code transversal

`helpers/` (fonctionnel générique), `types/` (globaux), `utils/` (technique : date, string, crypto).

- ✅ Un helper fait un traitement couplé l'application ou logique métier, il ne peut pas être réutilisé dans d'autres projets.
- ✅ Un utils fait un traitement technique, indépendant de l'application, il peut être réutilisé dans d'autres projets.
- ⚠️ Un helper **spécifique à un domaine** va dans `domains/helpers/`, pas dans `shared/`.

## Interdictions

❌ Interdit

- Logique métier dans un controller
- Instancier un `use-case` dans un autre `use-case`

## Où créer mes fichiers ?

| Situation                     | Chemin cible                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nouveau cas d'usage           | `domains/<domain-name>/use-cases/create-[entity].use-case.ts`                                                                                          |
| Nouvel endpoint REST          | `presentations/<feature-name>/[entity].controller.ts`                                                                                                  |
| Nouveau worker / cron         | `presentations/<feature-name>/[entity].worker.ts`                                                                                                      |
| Nouveau consommateur de queue | `presentations/<feature-name>/[entity].consumer.ts`                                                                                                    |
| Nouvelle API externe          | `infrastructures/<service-name>/[service].service.ts` + `infrastructures/<service-name>/[service].config.ts` (+ `packages/<service-name>/` si wrapper) |
| Nouvelle interface de repo    | `domains/<domain-name>/repository/[entity].repository.ts`                                                                                              |
| Nouveau mapper                | `domains/<domain-name>/mappers/[entity].mapper.ts`                                                                                                     |
| Nouvelle erreur métier        | `domains/<domain-name>/errors/[entity].errors.ts`                                                                                                      |

## Nommage

`[entity].repository.ts`, `[entity].mapper.ts`, `create-[entity].use-case.ts`, `[entity].validator.ts`, `[entity].errors.ts`, `[entity].const.ts`.

## Flux de dépendances (règle absolue)

```
presentations/ → domains/use-cases → domains/repository
                                            ↕
                                  infrastructures
```

Les flèches vont **toujours vers `domains/`**, jamais l'inverse.

- `presentation/` connaît `domains/`, mais `domains/` ne connaît pas `presentation/`.
- `infra/` implémente des interfaces de `domains/`, mais `domains/` ne connaît pas `infra/`.
- `shared/` ne dépend d'aucune autre couche.
