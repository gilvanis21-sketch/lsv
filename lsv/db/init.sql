create extension if not exists pgcrypto;

create table rendez_vous (
  id              uuid primary key default gen_random_uuid(),
  prenom          text not null,
  nom             text not null,
  email           text not null,
  tel             text not null,
  prestation      text not null,
  date_souhaitee  date not null,
  plage           text not null,
  statut          text not null default 'demande' check (statut in ('demande','confirme','annule')),
  token_annulation text not null default encode(gen_random_bytes(24),'hex'),
  rappel_envoye   boolean not null default false,
  consent_at      timestamptz not null default now(),
  created_at      timestamptz not null default now()
);
create index on rendez_vous (date_souhaitee);
