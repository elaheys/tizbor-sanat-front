import { KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeletePartner, usePartners, useUpdatePartner } from "@/api/partners/queries";
import { Content, Topbar } from "@/components/layout/Topbar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Sheet } from "@/components/ui/Sheet";
import { ListRowSkeleton, SkeletonList } from "@/components/ui/skeletons";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuthStore } from "@/store/authStore";
import type { Partner } from "@/types/partner";
import { toPersianDigits } from "@/utils/persianDigits";
import { PartnerForm } from "./PartnerForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { SetCredentialsForm } from "./SetCredentialsForm";

export function PartnersPage() {
  const currentPartnerId = useAuthStore((state) => state.partner?.id);
  const partners = usePartners();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | undefined>(undefined);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);

  return (
    <div>
      <Topbar
        title="شرکا"
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> شریک جدید
          </Button>
        }
      />
      <Content>
        {partners.isLoading && (
          <Card>
            <SkeletonList count={4} item={ListRowSkeleton} />
          </Card>
        )}
        {partners.isError && <ErrorBanner message={getApiErrorMessage(partners.error)} />}
        {deletePartner.isError && <ErrorBanner message={getApiErrorMessage(deletePartner.error)} />}
        {partners.data && (
          <Card>
            {partners.data.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 border-b border-border p-3.5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} tone={p.role === "admin" ? "edit" : "accent"} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold">{p.name}</div>
                    <div className="mt-0.5 text-[11.5px] text-muted" dir="ltr">
                      {p.username ? `نام کاربری: ${p.username}` : "بدون نام کاربری"}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    {p.role === "admin" ? (
                      <Chip tone="active">حسابدار</Chip>
                    ) : (
                      <>
                        <Chip tone="brand">سهم {toPersianDigits(p.share_percent)}٪</Chip>
                        <Tooltip label={p.is_active ? "غیرفعال کردن" : "فعال کردن"}>
                          <button
                            type="button"
                            onClick={() =>
                              updatePartner.mutate({ id: p.id, data: { is_active: !p.is_active } })
                            }
                            className={cn(
                              "relative h-[19px] w-[34px] rounded-full transition-colors",
                              p.is_active ? "bg-brand" : "bg-border",
                            )}
                            aria-label={p.is_active ? "غیرفعال کردن" : "فعال کردن"}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 size-[15px] rounded-full bg-white shadow transition-all",
                                p.is_active ? "left-[17px]" : "left-0.5",
                              )}
                            />
                          </button>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip label="ویرایش">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setFormOpen(true);
                        }}
                        className="flex size-7 items-center justify-center rounded-lg border border-edit-soft bg-edit-soft text-edit"
                        aria-label="ویرایش"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip label={p.username ? "تغییر رمز عبور" : "تعیین نام کاربری و رمز عبور"}>
                      <button
                        onClick={() => setResettingId(resettingId === p.id ? null : p.id)}
                        className="flex size-7 items-center justify-center rounded-lg border border-edit-soft bg-edit-soft text-edit"
                        aria-label={p.username ? "تغییر رمز عبور" : "تعیین نام کاربری و رمز عبور"}
                      >
                        <KeyRound className="size-3.5" />
                      </button>
                    </Tooltip>
                    {p.id !== currentPartnerId && (
                      <Tooltip label="حذف">
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="flex size-7 items-center justify-center rounded-lg border border-danger-soft bg-danger-soft text-danger"
                          aria-label="حذف"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
                {resettingId === p.id &&
                  (p.username ? (
                    <div className="ps-[46px]">
                      <ResetPasswordForm partnerId={p.id} onDone={() => setResettingId(null)} />
                    </div>
                  ) : (
                    <div className="ps-[46px]">
                      <SetCredentialsForm partnerId={p.id} onDone={() => setResettingId(null)} />
                    </div>
                  ))}
              </div>
            ))}
          </Card>
        )}
      </Content>

      <Sheet
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "ویرایش شریک" : "شریک جدید"}
      >
        <PartnerForm
          key={formOpen ? (editing?.id ?? "new") : "closed"}
          partner={editing}
          onDone={() => setFormOpen(false)}
        />
      </Sheet>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `«${deleteTarget.name}» حذف شود؟` : ""}
        onConfirm={() => {
          if (deleteTarget) deletePartner.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
