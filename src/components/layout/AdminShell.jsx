import { Check, ChevronDown, LogOut } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BrandMark } from "@/components/layout/BrandMark";
import { NAV_ITEMS } from "@/components/layout/nav";
import { useAuth } from "@/context/AuthContext";
import { useClub } from "@/context/ClubContext";
import { cn } from "@/lib/utils";

export function AdminShell() {
  return (
    <div className="flex h-svh overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r bg-white">
      <NavLink to="/schedule" className="flex h-14 items-center gap-2 border-b px-4">
        <BrandMark className="size-5" />
        <span className="text-[13px] font-semibold tracking-[0.16em]">SAMPLE</span>
      </NavLink>
      <nav className="no-scrollbar flex-1 overflow-auto py-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "mx-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px]",
                isActive ? "bg-accent font-medium text-ink" : "text-[#5e675f] hover:bg-secondary",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function Topbar() {
  const { clubs, club, setClubId } = useClub();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b bg-white px-4">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="inline-flex h-9 items-center gap-2 rounded-full border bg-white px-3 text-sm outline-none hover:bg-secondary">
          <span className="size-2 rounded-full bg-lime" />
          <span className="max-w-56 truncate">{club?.name}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-50 w-64 rounded-xl bg-white p-1 shadow-lg ring-1 ring-border"
          >
            {clubs.map((item) => (
              <DropdownMenu.Item
                key={item.id}
                onSelect={() => setClubId(item.id)}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-secondary"
              >
                <span>
                  <span className="block font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.area}</span>
                </span>
                {item.id === club?.id ? <Check className="size-4" /> : null}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className="flex size-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white outline-none"
          aria-label="Akun"
        >
          {user?.initials}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-50 w-56 rounded-xl bg-white p-1 shadow-lg ring-1 ring-border"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <DropdownMenu.Item
              onSelect={() => {
                logout();
                navigate("/login");
              }}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-secondary"
            >
              <LogOut className="size-4" />
              Keluar
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
