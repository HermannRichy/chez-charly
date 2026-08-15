"use client";

import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export function PasswordInput({
  value,
  onChange,
  required,
  minLength,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className ?? ""} pr-11 w-full`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-text-tertiary hover:text-deep"
      >
        {visible ? <IconEyeOff size={19} /> : <IconEye size={19} />}
      </button>
    </div>
  );
}
