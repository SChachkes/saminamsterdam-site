-- Tables for posts, comments, photos, albums, notes, classes, assignments, trips, pins, categories, events

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique
);

create table if not exists posts (
  id bigserial primary key,
  title text not null,
  body text default '',
  cover text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists comments (
  id bigserial primary key,
  post_id bigint references posts(id) on delete cascade,
  author text,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists albums (
  id bigserial primary key,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists media (
  id bigserial primary key,
  album_id bigint references albums(id) on delete cascade,
  url text not null,
  type text check (type in ('image','video')) default 'image',
  caption text,
  taken_at timestamptz
);

create table if not exists notes (
  id bigserial primary key,
  author text,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists classes (
  id bigserial primary key,
  name text not null,
  code text,
  schedule text,
  room text
);

create table if not exists assignments (
  id bigserial primary key,
  class_id bigint references classes(id) on delete cascade,
  title text not null,
  due_date date,
  done boolean default false
);

create table if not exists categories (
  key text primary key,
  label text not null,
  color text default '#00B3FF'
);

create table if not exists pins (
  id bigserial primary key,
  name text not null,
  cat text references categories(key),
  note text,
  lng double precision,
  lat double precision,
  visited boolean default false
);

create table if not exists events (
  id bigserial primary key,
  title text not null,
  date date,
  category text,
  venue text,
  url text
);
