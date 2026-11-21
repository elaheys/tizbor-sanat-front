import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/authStore";
import { navItemsForRole } from "./navConfig";

const bottomTabItems = (role: "admin" | "partner") =>
  navItemsForRole(role).filter((item) =>
    ["/", "/transactions", "/ledger", "/reports/monthly"].includes(item.to),
  );

export function AppShell() {
  const partner = useAuthStore((state) => state.partner);
  const logout = useAuthStore((state) => state.logout);

  if (!partner) return null;

  const items = navItemsForRole(partner.role);

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden w-[198px] shrink-0 flex-col gap-6 bg-brand-dark p-3.5 text-brand-ink md:flex">
        <div className="flex items-center gap-2.5 px-0.5">
          <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-accent text-[15px] font-extrabold text-white">
            ت
          </div>
          <div>
            <div className="text-[14.5px] font-bold leading-tight">تیزبر صنعت</div>
            <div className="mt-0.5 text-[10.5px] text-brand-ink-muted">دستیار حسابداری کارگاه</div>
          </div>
        </div>

        <nav className="flex flex-col gap-[3px]">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 text-[13px] text-brand-ink-soft transition-colors",
                  isActive ? "bg-white/10 font-semibold text-white" : "hover:bg-white/5",
                )
              }
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 px-0.5 pt-2.5">
          <Avatar name={partner.name} tone="accent" />
          <div className="min-w-0 text-xs leading-tight">
            <b className="block truncate font-semibold text-white">{partner.name}</b>
            <span className="text-[10.5px] text-brand-ink-muted">
              {partner.role === "admin" ? "حسابدار" : "شریک"}
            </span>
          </div>
          <button
            onClick={logout}
            className="ms-auto rounded-md p-1.5 text-brand-ink-muted hover:text-white"
            aria-label="خروج"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface px-1 pb-2.5 pt-2 md:hidden">
        {bottomTabItems(partner.role).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 rounded-[10px] py-1 text-[10.5px] font-medium",
                isActive ? "bg-brand-soft font-bold text-brand-dark" : "text-muted",
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
