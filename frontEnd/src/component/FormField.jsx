import React from 'react';

export default function FormField({ label, type, name, register, rules, errors, placeholder, className = '' }) {
  const inputClass = `w-full rounded-xl bg-gray-300 px-3 py-2 sm:px-4 sm:py-3 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${className}`;

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          {...register(name, rules)}
          className={inputClass}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          {...register(name, rules)}
          className={inputClass}
          placeholder={placeholder}
        />
      )}
      {errors[name] && (
        <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>
      )}
    </div>
  );
}