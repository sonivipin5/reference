// confirm.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import ModalBox from '../components/Modal';

/**
 * Imperative confirm dialog.
 *
 * Usage:
 *   const ok = await confirm({ title: "Delete?", content: "Are you sure?" });
 *   if (ok) { ... }
 *
 *   // Destructive action:
 *   const ok = await confirm({
 *     title: "Delete item?",
 *     content: "This cannot be undone.",
 *     okText: "Delete",
 *     okColor: "red",
 *   });
 */
export function Confirm({
  title = "Confirm",
  content = "Are you sure?",
  okText = "Ok",
  cancelText = "Cancel",
  okAppearance = "primary",
  okColor,          // e.g. "red" for destructive actions
  cancelAppearance = "subtle",
  cancelColor,
  ...rest
} = {}) {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      container.remove();
    };

    const handleResult = (result) => {
      cleanup();
      resolve(result);
    };

    root.render(
      <ModalBox
        open={true}
        title={title}
        content={content}
        okText={okText}
        cancelText={cancelText}
        okAppearance={okAppearance}
        okColor={okColor}
        cancelAppearance={cancelAppearance}
        cancelColor={cancelColor}
        handleClose={() => handleResult(false)}
        handleOk={() => handleResult(true)}
        {...rest}
      />
    );
  });
}
