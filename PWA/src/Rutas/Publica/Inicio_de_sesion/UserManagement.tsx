import { useState, useRef, useCallback, useEffect } from "react";
import type {
  User,
  UserStatus,
  UserRole,
  IdType,
  AuditAction,
  AuditEntry,
  AttachedFile,
  CurrentUser,
} from "../types/users";
import { COMPANIES, INITIAL_USERS } from "../data/mockUsers";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<UserStatus, string> = {
  PENDIENTE_VALIDACION: "Pendiente",
  ACTIVO: "Activo",
  RECHAZADO: "Rechazado",
  SUSPENDIDO: "Suspendido",
  DESACTIVADO: "Desactivado",
  BLOQUEADO: "Bloqueado",
};

const STATUS_STYLES: Record<UserStatus, string> = {
  PENDIENTE_VALIDACION: "bg-yellow-100 text-yellow-800 border-yellow-300",
  ACTIVO: "bg-green-100 text-green-800 border-green-300",
  RECHAZADO: "bg-red-100 text-red-800 border-red-300",
  SUSPENDIDO: "bg-orange-100 text-orange-800 border-orange-300",
  DESACTIVADO: "bg-slate-100 text-slate-600 border-slate-300",
  BLOQUEADO: "bg-red-200 text-red-900 border-red-400",
};

const ROLE_LABELS: Record<UserRole, string> = {
  ADMINISTRADOR: "Administrador",
  ADMINISTRADOR_EMPRESA: "Admin. Empresa",
  COORDINADOR: "Coordinador",
  TECNICO: "Técnico",
  DELEGADO: "Delegado",
};

const ID_TYPE_LABELS: Record<IdType, string> = {
  CC: "C.C.",
  CE: "C.E.",
  NIT: "NIT",
  PASAPORTE: "Pasaporte",
  TI: "T.I.",
};

const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREACION: "Creación",
  APROBACION: "Aprobación",
  RECHAZO: "Rechazo",
  SUSPENSION: "Suspensión",
  DESACTIVACION: "Desactivación",
  REACTIVACION: "Reactivación",
  CAMBIO_ROL: "Cambio de rol",
  DESBLOQUEO: "Desbloqueo",
  EDICION: "Edición",
};

const ROLES_WITH_AUTH_LETTER: UserRole[] = ["DELEGADO"];

// Roles that an admin_empresa can assign to delegates they manage
const ASSIGNABLE_ROLES_BY_ROLE: Record<UserRole, UserRole[]> = {
  ADMINISTRADOR: ["ADMINISTRADOR_EMPRESA", "COORDINADOR", "TECNICO", "DELEGADO"],
  ADMINISTRADOR_EMPRESA: ["DELEGADO"],
  COORDINADOR: [],
  TECNICO: [],
  DELEGADO: [],
};

function newId() {
  return `u-${Date.now().toString(36)}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function Badge({ status }: { status: UserStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
      {ROLE_LABELS[role]}
    </span>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
      {children}
    </label>
  );
}

function Req() {
  return <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>;
}

function FieldInput({
  id, type = "text", value, onChange, placeholder, disabled, error, autoComplete,
}: {
  id: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; error?: boolean; autoComplete?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      aria-invalid={error ? "true" : undefined}
      className={[
        "w-full px-3 py-2 rounded-lg border text-sm transition-colors",
        "bg-white placeholder:text-slate-400 text-slate-900",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600",
        "disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400",
        error ? "border-red-400 bg-red-50" : "border-slate-200",
      ].join(" ")}
    />
  );
}

function FieldSelect({
  id, value, onChange, disabled, error, children,
}: {
  id: string; value: string; onChange: (v: string) => void;
  disabled?: boolean; error?: boolean; children: React.ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-invalid={error ? "true" : undefined}
      className={[
        "w-full px-3 py-2 rounded-lg border text-sm bg-white text-slate-900 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600",
        "disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400",
        error ? "border-red-400 bg-red-50" : "border-slate-200",
      ].join(" ")}
    >
      {children}
    </select>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-1 text-xs text-red-600 flex items-center gap-1">
      <svg className="size-3 shrink-0" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm-.75 3.5a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm.75 6a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
      {message}
    </p>
  );
}

function Btn({
  children, onClick, variant = "primary", size = "md", disabled, type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "ghost" | "outline" | "warning" | "success";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base = "inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    warning: "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400",
    ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]}`}>
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children, width = "max-w-xl" }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className={`relative bg-white rounded-2xl border border-slate-200 shadow-xl w-full ${width} max-h-[90vh] flex flex-col`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400" aria-label="Cerrar">
            <svg className="size-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Authorization Letter Upload ──────────────────────────────────────────────

function AuthLetterUpload({
  file,
  onChange,
  disabled,
}: {
  file: AttachedFile | undefined;
  onChange: (f: AttachedFile | undefined) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function simulateUpload(raw: File) {
    const entry: AttachedFile = {
      id: `f-${Date.now()}`,
      name: raw.name,
      size: raw.size,
      status: "uploading",
      progress: 0,
    };
    onChange(entry);
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 30 + 10;
      if (p >= 100) {
        clearInterval(tick);
        onChange({ ...entry, status: "done", progress: 100, url: "#" });
      } else {
        onChange({ ...entry, status: "uploading", progress: Math.min(Math.round(p), 99) });
      }
    }, 200);
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const f = files[0];
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(f.type)) return;
    if (f.size > 5 * 1024 * 1024) return;
    simulateUpload(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
          aria-label="Adjuntar carta de autorización"
          className={[
            "border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors",
            dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50",
            disabled ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
        >
          <svg className="size-8 mx-auto text-slate-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
          </svg>
          <p className="text-sm text-slate-600 font-medium">Arrastra aquí o <span className="text-blue-600">selecciona</span></p>
          <p className="text-xs text-slate-400 mt-1">PDF, JPG o PNG · máx. 5 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" tabIndex={-1}
            onChange={(e) => handleFiles(e.target.files)} disabled={disabled} />
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <svg className="size-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{fmtBytes(file.size)}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {file.status === "done" && (
                <>
                  {file.url && (
                    <a href={file.url} target="_blank" rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded focus-visible:outline-none" aria-label="Vista previa">
                      <svg className="size-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    </a>
                  )}
                  {!disabled && (
                    <button onClick={() => onChange(undefined)} className="p-1.5 text-slate-400 hover:text-red-600 rounded focus-visible:outline-none" aria-label="Eliminar archivo">
                      <svg className="size-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
                    </button>
                  )}
                </>
              )}
              {file.status === "error" && (
                <button onClick={() => onChange(undefined)} className="text-xs text-red-600 font-medium hover:underline">
                  Reintentar
                </button>
              )}
            </div>
          </div>
          {file.status === "uploading" && (
            <div className="px-3 pb-3">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{ width: `${file.progress}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">Cargando… {file.progress}%</p>
            </div>
          )}
          {file.status === "done" && (
            <div className="px-3 pb-2">
              <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-full" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Action Modal (approve / reject / suspend / deactivate / unlock / role change) ──

type ActionType = "approve" | "reject" | "suspend" | "deactivate" | "reactivate" | "unblock" | "change-role";

interface ActionConfig {
  label: string;
  description: string;
  variant: "success" | "danger" | "warning" | "primary";
  auditAction: AuditAction;
  reasonRequired: boolean;
  hasNotify?: boolean;
  hasRoleSelect?: boolean;
}

const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  approve: { label: "Aprobar usuario", description: "El usuario quedará ACTIVO y podrá acceder al sistema.", variant: "success", auditAction: "APROBACION", reasonRequired: false },
  reject: { label: "Rechazar usuario", description: "El usuario no podrá acceder. El motivo se registrará en auditoría.", variant: "danger", auditAction: "RECHAZO", reasonRequired: true, hasNotify: true },
  suspend: { label: "Suspender usuario", description: "El usuario perderá acceso temporalmente. El motivo es obligatorio.", variant: "warning", auditAction: "SUSPENSION", reasonRequired: true },
  deactivate: { label: "Desactivar usuario", description: "Acción irreversible en este flujo. Se registrará en auditoría.", variant: "danger", auditAction: "DESACTIVACION", reasonRequired: true },
  reactivate: { label: "Reactivar usuario", description: "El usuario recuperará el estado ACTIVO.", variant: "success", auditAction: "REACTIVACION", reasonRequired: true },
  unblock: { label: "Desbloquear usuario", description: "Se restablecerán los intentos de acceso del usuario.", variant: "primary", auditAction: "DESBLOQUEO", reasonRequired: false },
  "change-role": { label: "Cambiar rol", description: "El cambio de rol queda registrado en auditoría.", variant: "primary", auditAction: "CAMBIO_ROL", reasonRequired: true, hasRoleSelect: true },
};

function ActionModal({
  open,
  user,
  action,
  currentUser,
  assignableRoles,
  onConfirm,
  onClose,
}: {
  open: boolean;
  user: User | null;
  action: ActionType | null;
  currentUser: CurrentUser;
  assignableRoles: UserRole[];
  onConfirm: (reason: string, notify: boolean, newRole?: UserRole) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>("TECNICO");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) { setReason(""); setNotify(false); setLoading(false); }
  }, [open, action]);

  if (!open || !user || !action) return null;
  const cfg = ACTION_CONFIG[action];

  const isSelf = user.id === currentUser.id;
  const isPrivilegedSelfRoleChange = action === "change-role" && isSelf;

  function handleConfirm() {
    if (cfg.reasonRequired && !reason.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onConfirm(reason.trim(), notify, cfg.hasRoleSelect ? newRole : undefined);
      setLoading(false);
    }, 900);
  }

  const variantBtn: Record<ActionConfig["variant"], "success" | "danger" | "warning" | "primary"> = {
    success: "success", danger: "danger", warning: "warning", primary: "primary",
  };

  return (
    <Modal open={open} onClose={onClose} title={cfg.label} width="max-w-md">
      <div className="px-6 py-5 space-y-4">
        {isPrivilegedSelfRoleChange && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-800">
            No puedes modificar tu propio rol privilegiado.
          </div>
        )}

        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 flex gap-3">
          <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
            {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
            <p className="text-xs text-slate-500">{user.email} · <Badge status={user.status} /></p>
          </div>
        </div>

        <p className="text-sm text-slate-600">{cfg.description}</p>

        {cfg.hasRoleSelect && !isPrivilegedSelfRoleChange && (
          <div>
            <Label htmlFor="action-new-role">Nuevo rol <Req /></Label>
            <FieldSelect id="action-new-role" value={newRole} onChange={(v) => setNewRole(v as UserRole)}>
              {assignableRoles.filter((r) => r !== user.role).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </FieldSelect>
          </div>
        )}

        <div>
          <Label htmlFor="action-reason">
            Motivo {cfg.reasonRequired ? <Req /> : <span className="text-slate-400 font-normal normal-case">(opcional)</span>}
          </Label>
          <textarea
            id="action-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            disabled={isPrivilegedSelfRoleChange}
            placeholder="Describe el motivo de esta acción…"
            className={[
              "w-full px-3 py-2 rounded-lg border text-sm resize-none",
              "bg-white placeholder:text-slate-400 text-slate-900",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600",
              "disabled:bg-slate-50 disabled:cursor-not-allowed",
              cfg.reasonRequired && !reason.trim() ? "border-slate-200" : "border-slate-200",
            ].join(" ")}
          />
          {cfg.reasonRequired && !reason.trim() && (
            <p className="text-xs text-slate-400 mt-0.5">El motivo es obligatorio para esta acción.</p>
          )}
        </div>

        {cfg.hasNotify && (
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)}
              className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-slate-700">Notificar al usuario por correo</span>
          </label>
        )}

        <div className="flex gap-2 pt-1">
          <Btn variant="outline" onClick={onClose}>Cancelar</Btn>
          <Btn
            variant={variantBtn[cfg.variant]}
            onClick={handleConfirm}
            disabled={(cfg.reasonRequired && !reason.trim()) || loading || isPrivilegedSelfRoleChange}
          >
            {loading ? "Guardando…" : cfg.label}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

// ─── User Form Modal ──────────────────────────────────────────────────────────

interface UserFormData {
  fullName: string;
  idType: IdType;
  idNumber: string;
  email: string;
  phone: string;
  role: UserRole;
  company: string;
  authLetter?: AttachedFile;
}

function UserFormModal({
  open,
  editUser,
  currentUser,
  existingUsers,
  onSave,
  onClose,
}: {
  open: boolean;
  editUser: User | null;
  currentUser: CurrentUser;
  existingUsers: User[];
  onSave: (data: UserFormData) => void;
  onClose: () => void;
}) {
  const isEdit = !!editUser;
  const assignableRoles = ASSIGNABLE_ROLES_BY_ROLE[currentUser.role];

  const blank: UserFormData = {
    fullName: "", idType: "CC", idNumber: "", email: "", phone: "",
    role: assignableRoles[0] ?? "TECNICO",
    company: currentUser.company ?? COMPANIES[0],
    authLetter: undefined,
  };

  const [form, setForm] = useState<UserFormData>(blank);
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editUser) {
      setForm({
        fullName: editUser.fullName,
        idType: editUser.idType,
        idNumber: editUser.idNumber,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
        company: editUser.company,
        authLetter: editUser.authLetter,
      });
    } else {
      setForm(blank);
    }
    setErrors({});
    setLoading(false);
  }, [open, editUser]);

  const needsAuthLetter = ROLES_WITH_AUTH_LETTER.includes(form.role);

  function set<K extends keyof UserFormData>(k: K, v: UserFormData[K]) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.fullName.trim()) e.fullName = "El nombre completo es obligatorio.";
    if (!form.idNumber.trim()) e.idNumber = "El número de identificación es obligatorio.";
    if (!form.email.trim()) e.email = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido.";
    else {
      const dup = existingUsers.find((u) => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== editUser?.id);
      if (dup) e.email = "Este correo ya está registrado en el sistema.";
    }
    const dupId = existingUsers.find(
      (u) => u.idType === form.idType && u.idNumber.replace(/\D/g, "") === form.idNumber.replace(/\D/g, "") && u.id !== editUser?.id
    );
    if (dupId) e.idNumber = "Este número de identificación ya está registrado.";
    if (!form.phone.trim()) e.phone = "El teléfono es obligatorio.";
    if (!form.company.trim()) e.company = "La empresa/ámbito es obligatoria.";
    if (needsAuthLetter && !form.authLetter) e.authLetter = "La carta de autorización es obligatoria para delegados.";
    if (form.authLetter?.status === "uploading") e.authLetter = "Espera a que el archivo termine de cargarse.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { onSave(form); setLoading(false); }, 800);
  }

  // Admin empresa is restricted to their company
  const companyOptions = currentUser.role === "ADMINISTRADOR_EMPRESA"
    ? [currentUser.company ?? ""]
    : COMPANIES;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Editar usuario" : "Registrar nuevo usuario"} width="max-w-2xl">
      <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-5">
        {/* Name */}
        <div>
          <Label htmlFor="uf-name">Nombre completo <Req /></Label>
          <FieldInput id="uf-name" value={form.fullName} onChange={(v) => set("fullName", v)}
            placeholder="Ej. María Fernanda Torres" error={!!errors.fullName} />
          {errors.fullName && <FieldError message={errors.fullName} />}
        </div>

        {/* ID */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <Label htmlFor="uf-idtype">Tipo ID <Req /></Label>
            <FieldSelect id="uf-idtype" value={form.idType} onChange={(v) => set("idType", v as IdType)}>
              {(["CC", "CE", "NIT", "PASAPORTE", "TI"] as IdType[]).map((t) => (
                <option key={t} value={t}>{ID_TYPE_LABELS[t]}</option>
              ))}
            </FieldSelect>
          </div>
          <div className="col-span-3">
            <Label htmlFor="uf-idnumber">Número de identificación <Req /></Label>
            <FieldInput id="uf-idnumber" value={form.idNumber} onChange={(v) => set("idNumber", v)}
              placeholder="Ej. 1.023.456.789" error={!!errors.idNumber} />
            {errors.idNumber && <FieldError message={errors.idNumber} />}
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="uf-email">Correo electrónico <Req /></Label>
            <FieldInput id="uf-email" type="email" value={form.email} onChange={(v) => set("email", v)}
              placeholder="usuario@empresa.com" error={!!errors.email} autoComplete="off" />
            {errors.email && <FieldError message={errors.email} />}
          </div>
          <div>
            <Label htmlFor="uf-phone">Teléfono <Req /></Label>
            <FieldInput id="uf-phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)}
              placeholder="+57 310 000 0000" error={!!errors.phone} />
            {errors.phone && <FieldError message={errors.phone} />}
          </div>
        </div>

        {/* Role & Company */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="uf-role">Rol <Req /></Label>
            <FieldSelect id="uf-role" value={form.role} onChange={(v) => set("role", v as UserRole)}>
              {assignableRoles.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </FieldSelect>
          </div>
          <div>
            <Label htmlFor="uf-company">Empresa / Ámbito <Req /></Label>
            {currentUser.role === "ADMINISTRADOR_EMPRESA" ? (
              <FieldInput id="uf-company" value={form.company} onChange={() => { }} disabled />
            ) : (
              <FieldSelect id="uf-company" value={form.company} onChange={(v) => set("company", v)} error={!!errors.company}>
                {companyOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </FieldSelect>
            )}
            {errors.company && <FieldError message={errors.company} />}
          </div>
        </div>

        {/* Auth Letter */}
        {needsAuthLetter && (
          <div>
            <Label htmlFor="uf-auth">Carta de autorización <Req /></Label>
            <AuthLetterUpload
              file={form.authLetter}
              onChange={(f) => set("authLetter", f)}
              disabled={loading}
            />
            {errors.authLetter && <FieldError message={errors.authLetter} />}
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Btn variant="outline" onClick={onClose} type="button">Cancelar</Btn>
          <Btn variant="primary" type="submit" disabled={loading}>
            {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Registrar usuario"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

// ─── User Detail Panel ────────────────────────────────────────────────────────

function UserDetailPanel({
  user,
  currentUser,
  onAction,
  onEdit,
  onClose,
}: {
  user: User;
  currentUser: CurrentUser;
  onAction: (action: ActionType) => void;
  onEdit: () => void;
  onClose: () => void;
}) {
  const isSelf = user.id === currentUser.id;

  const actions: { label: string; action: ActionType; show: boolean }[] = ([
    { label: "Aprobar", action: "approve" as ActionType, show: user.status === "PENDIENTE_VALIDACION" },
    { label: "Rechazar", action: "reject" as ActionType, show: user.status === "PENDIENTE_VALIDACION" },
    { label: "Suspender", action: "suspend" as ActionType, show: user.status === "ACTIVO" && !isSelf },
    { label: "Reactivar", action: "reactivate" as ActionType, show: user.status === "SUSPENDIDO" },
    { label: "Desactivar", action: "deactivate" as ActionType, show: ["ACTIVO", "SUSPENDIDO"].includes(user.status) && !isSelf },
    { label: "Desbloquear", action: "unblock" as ActionType, show: user.status === "BLOQUEADO" },
    { label: "Cambiar rol", action: "change-role" as ActionType, show: user.status === "ACTIVO" && currentUser.role === "ADMINISTRADOR" },
  ] as { label: string; action: ActionType; show: boolean }[]).filter((a) => a.show);

  const variantMap: Record<ActionType, "success" | "danger" | "warning" | "primary" | "outline"> = {
    approve: "success", reject: "danger", suspend: "warning", deactivate: "danger",
    reactivate: "success", unblock: "primary", "change-role": "outline",
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex">
      <div className="w-full sm:w-[400px] bg-white border-l border-slate-200 shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-sm font-bold text-slate-900">Detalle de usuario</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400" aria-label="Cerrar">
            <svg className="size-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Identity */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base shrink-0">
                {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-base leading-tight">{user.fullName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <Badge status={user.status} />
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="px-5 py-4 space-y-3 border-b border-slate-100">
            {[
              { label: "Identificación", value: `${ID_TYPE_LABELS[user.idType]} ${user.idNumber}` },
              { label: "Teléfono", value: user.phone },
              { label: "Empresa / Ámbito", value: user.company },
              { label: "Registrado", value: fmtDate(user.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-2">
                <span className="text-xs text-slate-400 font-medium w-28 shrink-0">{label}</span>
                <span className="text-xs text-slate-700 text-right">{value}</span>
              </div>
            ))}
          </div>

          {/* Auth Letter */}
          {user.authLetter && (
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Carta de autorización</p>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                <svg className="size-4 text-blue-500 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                <span className="text-xs text-slate-700 truncate flex-1">{user.authLetter.name}</span>
                <span className="text-xs text-slate-400 shrink-0">{fmtBytes(user.authLetter.size)}</span>
                {user.authLetter.url && (
                  <a href={user.authLetter.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline shrink-0">Ver</a>
                )}
              </div>
            </div>
          )}

          {/* Audit log */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Auditoría</p>
            <ol className="relative border-l border-slate-200 space-y-4 ml-1">
              {[...user.auditLog].reverse().map((entry) => (
                <li key={entry.id} className="ml-4">
                  <span className="absolute -left-1.5 flex size-3 items-center justify-center rounded-full bg-white border-2 border-blue-400" aria-hidden="true" />
                  <p className="text-xs font-semibold text-slate-800">{AUDIT_ACTION_LABELS[entry.action]}</p>
                  <p className="text-xs text-slate-500">{entry.performedBy} · {fmtDateTime(entry.performedAt)}</p>
                  {entry.reason && <p className="text-xs text-slate-600 mt-0.5 italic">"{entry.reason}"</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-slate-100 shrink-0 space-y-2">
          {!isSelf && (
            <Btn variant="outline" size="sm" onClick={onEdit}>
              <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>
              Editar información
            </Btn>
          )}
          <div className="flex flex-wrap gap-2">
            {actions.map(({ label, action }) => (
              <Btn key={action} variant={variantMap[action]} size="sm" onClick={() => onAction(action)}>
                {label}
              </Btn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main UserManagement Component ───────────────────────────────────────────

export function UserManagement({ currentUser, onLogout }: {
  currentUser: CurrentUser;
  onLogout: () => void;
}) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "ALL">("ALL");
  const [filterRole, setFilterRole] = useState<UserRole | "ALL">("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [actionUser, setActionUser] = useState<User | null>(null);

  const assignableRoles = ASSIGNABLE_ROLES_BY_ROLE[currentUser.role];

  // Admins empresa only see their company's users
  const scopedUsers = currentUser.role === "ADMINISTRADOR_EMPRESA"
    ? users.filter((u) => u.company === currentUser.company && u.role === "DELEGADO")
    : users;

  const filtered = scopedUsers.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.idNumber.includes(q);
    const matchStatus = filterStatus === "ALL" || u.status === filterStatus;
    const matchRole = filterRole === "ALL" || u.role === filterRole;
    return matchSearch && matchStatus && matchRole;
  });

  const pendingCount = scopedUsers.filter((u) => u.status === "PENDIENTE_VALIDACION").length;

  function handleSave(data: UserFormData) {
    if (editingUser) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id
        ? { ...u, ...data, auditLog: [...u.auditLog, { id: `a-${Date.now()}`, action: "EDICION", performedBy: currentUser.fullName, performedAt: new Date().toISOString() }] }
        : u
      ));
      setSelectedUser((prev) => prev ? { ...prev, ...data } : null);
    } else {
      const newUser: User = {
        id: newId(),
        ...data,
        status: "PENDIENTE_VALIDACION",
        createdAt: new Date().toISOString(),
        auditLog: [{ id: `a-${Date.now()}`, action: "CREACION", performedBy: currentUser.fullName, performedAt: new Date().toISOString() }],
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setFormOpen(false);
    setEditingUser(null);
  }

  function handleActionConfirm(reason: string, notify: boolean, newRole?: UserRole) {
    if (!actionUser || !pendingAction) return;
    const cfg = ACTION_CONFIG[pendingAction];
    const newStatus: Record<ActionType, UserStatus | null> = {
      approve: "ACTIVO", reject: "RECHAZADO", suspend: "SUSPENDIDO",
      deactivate: "DESACTIVADO", reactivate: "ACTIVO", unblock: "ACTIVO", "change-role": null,
    };
    const entry: AuditEntry = {
      id: `a-${Date.now()}`,
      action: cfg.auditAction,
      performedBy: currentUser.fullName,
      performedAt: new Date().toISOString(),
      reason: reason || undefined,
      meta: notify ? "Notificación enviada" : undefined,
    };

    setUsers((prev) => prev.map((u) => {
      if (u.id !== actionUser.id) return u;
      const status = newStatus[pendingAction];
      return {
        ...u,
        status: status ?? u.status,
        role: newRole ?? u.role,
        auditLog: [...u.auditLog, entry],
      };
    }));

    if (selectedUser?.id === actionUser.id) {
      setSelectedUser((prev) => {
        if (!prev) return null;
        const status = newStatus[pendingAction];
        return { ...prev, status: status ?? prev.status, role: newRole ?? prev.role, auditLog: [...prev.auditLog, entry] };
      });
    }

    setPendingAction(null);
    setActionUser(null);
  }

  function openAction(user: User, action: ActionType) {
    setActionUser(user);
    setPendingAction(action);
  }

  const canCreate = assignableRoles.length > 0;

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="size-4 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2.5 3A1.5 1.5 0 001 4.5v4A1.5 1.5 0 002.5 10h3.75a.75.75 0 000-1.5H2.5V4.5A.5.5 0 013 4h14a.5.5 0 01.5.5v4h-3.75a.75.75 0 000 1.5H17.5A1.5 1.5 0 0019 8.5v-4A1.5 1.5 0 0017.5 3h-15z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-sm">RiskEval PWA</span>
            <span className="text-slate-300 text-sm hidden sm:block">/</span>
            <span className="text-sm text-slate-600 hidden sm:block">Gestión de usuarios</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              <div className="size-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                {currentUser.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <span className="font-medium">{currentUser.fullName}</span>
              <RoleBadge role={currentUser.role} />
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Usuarios</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {scopedUsers.length} usuario{scopedUsers.length !== 1 ? "s" : ""}
              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          {canCreate && (
            <Btn variant="primary" onClick={() => { setEditingUser(null); setFormOpen(true); }}>
              <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              Registrar usuario
            </Btn>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo o ID…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as UserStatus | "ALL")}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="ALL">Todos los estados</option>
            {(Object.keys(STATUS_LABELS) as UserStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          {currentUser.role === "ADMINISTRADOR" && (
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | "ALL")}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="ALL">Todos los roles</option>
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="size-10 mx-auto text-slate-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <p className="text-sm font-medium text-slate-500">No se encontraron usuarios</p>
              <p className="text-xs text-slate-400 mt-1">Ajusta los filtros o registra un nuevo usuario.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuario</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Identificación</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Empresa</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rol</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Registro</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                            {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate max-w-[160px]">{user.fullName}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[160px]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                        <span className="font-mono text-xs">{ID_TYPE_LABELS[user.idType]} {user.idNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                        <span className="text-xs truncate max-w-[160px] block">{user.company}</span>
                      </td>
                      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-3"><Badge status={user.status} /></td>
                      <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">{fmtDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                          className="text-slate-400 hover:text-blue-600 p-1 rounded focus-visible:outline-none"
                          aria-label={`Ver detalle de ${user.fullName}`}
                        >
                          <svg className="size-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail panel */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 z-30 bg-slate-900/10" onClick={() => setSelectedUser(null)} aria-hidden="true" />
          <UserDetailPanel
            user={selectedUser}
            currentUser={currentUser}
            onAction={(action) => openAction(selectedUser, action)}
            onEdit={() => { setEditingUser(selectedUser); setFormOpen(true); }}
            onClose={() => setSelectedUser(null)}
          />
        </>
      )}

      {/* Form modal */}
      <UserFormModal
        open={formOpen}
        editUser={editingUser}
        currentUser={currentUser}
        existingUsers={users}
        onSave={handleSave}
        onClose={() => { setFormOpen(false); setEditingUser(null); }}
      />

      {/* Action modal */}
      <ActionModal
        open={!!pendingAction}
        user={actionUser}
        action={pendingAction}
        currentUser={currentUser}
        assignableRoles={assignableRoles}
        onConfirm={handleActionConfirm}
        onClose={() => { setPendingAction(null); setActionUser(null); }}
      />
    </div>
  );
}
