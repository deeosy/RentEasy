import React from 'react';

export default function SelectField({ label, name, register, rules, errors, options }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <select
        {...register(name, rules)}
        className="w-full rounded-xl bg-gray-300 px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>
      )}
    </div>
  );
}