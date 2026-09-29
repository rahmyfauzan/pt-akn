'use client';
import { useState, useRef, useEffect } from 'react';

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  options: any[];
  displayKey: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function Autocomplete({ value, onChange, options, displayKey, placeholder, required, className }: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<any[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    
    if (val.length > 0) {
      const match = options.filter(opt => 
        opt[displayKey].toLowerCase().includes(val.toLowerCase())
      );
      setFiltered(match);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (selectedVal: string) => {
    onChange(selectedVal);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (value.length > 0) {
             const match = options.filter(opt => opt[displayKey].toLowerCase().includes(value.toLowerCase()));
             setFiltered(match);
             setIsOpen(true);
          } else {
             setFiltered(options);
             setIsOpen(true);
          }
        }}
        placeholder={placeholder}
        required={required}
        className={className}
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-slate-200 shadow-lg max-h-60 rounded-md mt-1 overflow-auto">
          {filtered.map((opt, idx) => (
            <li 
              key={idx}
              className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-slate-700"
              onClick={() => handleSelect(opt[displayKey])}
            >
              {opt[displayKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
