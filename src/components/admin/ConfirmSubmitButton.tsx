"use client";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  message?: string;
  className?: string;
};

export function ConfirmSubmitButton({
  children,
  message = "Esta accion no se puede deshacer. Continuar?",
  className,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
