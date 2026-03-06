-- Enable uuid extension if needed
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  tags text[] default '{}'::text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Chat sessions (summary only)
create table if not exists public.chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  summary text not null,
  tags text[] default '{}'::text[],
  created_at timestamp with time zone default now()
);

-- Optional: chat messages
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles policies
create policy if not exists "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy if not exists "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy if not exists "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Chat sessions policies
create policy if not exists "chat_sessions_select_own"
  on public.chat_sessions for select
  using (auth.uid() = user_id);

create policy if not exists "chat_sessions_insert_own"
  on public.chat_sessions for insert
  with check (auth.uid() = user_id);

create policy if not exists "chat_sessions_delete_own"
  on public.chat_sessions for delete
  using (auth.uid() = user_id);

-- Chat messages policies
create policy if not exists "chat_messages_select_own"
  on public.chat_messages for select
  using (auth.uid() = (select user_id from public.chat_sessions where id = session_id));

create policy if not exists "chat_messages_insert_own"
  on public.chat_messages for insert
  with check (auth.uid() = (select user_id from public.chat_sessions where id = session_id));

create policy if not exists "chat_messages_delete_own"
  on public.chat_messages for delete
  using (auth.uid() = (select user_id from public.chat_sessions where id = session_id));

-- Trigger to auto-create profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, tags)
  values (new.id, '{}'::text[])
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
