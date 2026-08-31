# Missing RLS on the plan tables

## How it was found

While reviewing whether `session_sets` needs its own `user_id`, the anon key from
`.env.local` was used to hit the REST API with no authenticated user — exactly what any
visitor can do, since that key ships in the public bundle served by GitHub Pages.

| Table | Anonymous read | Rows |
| --- | --- | --- |
| `workouts` | blocked | - |
| `day_sessions` | blocked | - |
| `session_sets` | blocked | - |
| `days` | **readable** | 39 |
| `day_exercises` | **readable** | 142 |
| `day_exercise_sets` | **readable** | 440 |
| `exercises_catalog` | readable | 115, all global (0 rows with a non-null `user_id`) |

The tables created by `docs/2026-08-05/migration-training-sessions.sql` are correctly
protected. The three plan tables predate the migrations kept in `docs/` and have no
effective RLS, exposing day names, exercises and every set (weights, target reps).

The anon role also holds an INSERT grant on those three (`Allow: GET, HEAD, POST, OPTIONS`),
so anonymous writes are likely possible. This was NOT tested — it would mean writing rows
into the live database.

## Fix

`docs/2026-08-31/migration-rls-plan-tables.sql` enables RLS and adds the four policies per
table, inheriting ownership up the chain rather than denormalising `user_id`:

    day_exercise_sets -> day_exercises -> days -> workouts.user_id

This matches the pattern already used by `session_sets` -> `day_sessions`. Supporting
indexes on the FK columns are created so each policy check is an index lookup.

No application code changes: every query already relies on RLS for scoping, so the policies
are transparent to the client when logged in.

## Open points

- Whether RLS is disabled on those tables or enabled with a permissive policy cannot be told
  from outside. Run `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';`
  before applying; if a permissive policy exists it must be dropped by name.
- `exercises_catalog` leaked no user-owned rows, but that may be because none exist rather
  than because a policy hides them. Worth confirming with the same query.
- The migration is untested against the live schema; it needs database credentials this
  session does not have. Apply against a backup first and verify the app while logged in.
