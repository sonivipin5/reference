import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Fully custom Modal — no external UI library required.
 *
 * Props:
 *  - open, title, content/children, footer
 *  - handleClose, handleOk
 *  - okText, cancelText, showOk, showCancel
 *  - okColor: "primary" | "red" | "green" | ... (maps to CSS below)
 *  - size: "sm" | "md" | "lg" | "full"
 *  - closeOnBackdrop, closeOnEsc
 */
export default function ModalBox({
  open = false,
  title,
  content,
  children,
  footer,
  header = true,
  handleClose = () => {},
  handleOk = () => {},
  okText = "Ok",
  cancelText = "Cancel",
  showOk = true,
  showCancel = true,
  okDisabled = false,
  cancelDisabled = false,
  loading = false,
  okColor = "primary",     // primary | red | green | gray
  cancelColor = "gray",
  size = "sm",              // sm | md | lg | full
  closeOnBackdrop = true,
  closeOnEsc = true,
}) {
  const dialogRef = useRef(null);

  const close = useCallback(() => handleClose(), [handleClose]);
  const ok = useCallback(() => handleOk(), [handleOk]);

  // Close on Escape
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, close]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  // Basic focus on open
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const body =
    typeof children === "function"
      ? children({ close, ok })
      : children ?? content;

  const renderFooter = () => {
    if (footer === null) return null;
    if (typeof footer === "function") return footer({ close, ok });
    if (footer) return footer;

    return (
      <>
        {showCancel && (
          <button
            className={`mb-btn mb-btn--${cancelColor}`}
            onClick={close}
            disabled={cancelDisabled}
          >
            {cancelText}
          </button>
        )}
        {showOk && (
          <button
            className={`mb-btn mb-btn--${okColor}`}
            onClick={ok}
            disabled={okDisabled || loading}
          >
            {loading ? <span className="mb-spinner" /> : okText}
          </button>
        )}
      </>
    );
  };

  const footerContent = renderFooter();

  return createPortal(
    <div
      className="mb-overlay"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) close();
      }}
    >
      <div
        className={`mb-dialog mb-dialog--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mb-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        {header !== false && (
          <div className="mb-header">
            {typeof header === "boolean" ? (
              <h3 className="mb-title" id="mb-title">{title}</h3>
            ) : (
              header
            )}
            <button className="mb-close" onClick={close} aria-label="Close">
              ×
            </button>
          </div>
        )}

        <div className="mb-body">{body}</div>

        {footerContent && <div className="mb-footer">{footerContent}</div>}
      </div>

      <style>{modalStyles}</style>
    </div>,
    document.body
  );
}

const modalStyles = `
.mb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: mb-fade-in 0.15s ease-out;
}

.mb-dialog {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: mb-slide-in 0.18s ease-out;
  outline: none;
}

.mb-dialog--sm { max-width: 420px; }
.mb-dialog--md { max-width: 600px; }
.mb-dialog--lg { max-width: 900px; }
.mb-dialog--full { max-width: 100%; height: 100%; border-radius: 0; }

.mb-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 12px;
}

.mb-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.mb-close {
  background: none;
  border: none;
  font-size: 22px;
  line-height: 1;
  color: #888;
  cursor: pointer;
  padding: 0 4px;
  border-radius: 4px;
}
.mb-close:hover { background: #f0f0f0; color: #333; }

.mb-body {
  padding: 4px 24px 20px;
  overflow-y: auto;
  color: #444;
  font-size: 14px;
  line-height: 1.5;
}

.mb-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px;
  border-top: 1px solid #eee;
}

.mb-btn {
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease, background 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.mb-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.mb-btn:hover:not(:disabled) { filter: brightness(0.95); }

.mb-btn--primary { background: #3b82f6; color: #fff; }
.mb-btn--red     { background: #ef4444; color: #fff; }
.mb-btn--green   { background: #22c55e; color: #fff; }
.mb-btn--gray    { background: #f0f0f0; color: #333; }

.mb-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: mb-spin 0.6s linear infinite;
}

@keyframes mb-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes mb-slide-in { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes mb-spin { to { transform: rotate(360deg); } }
`;
