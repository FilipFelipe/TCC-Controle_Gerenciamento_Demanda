import React from 'react';
import style from './Input.module.css';

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  onBlur,
  placeholder,
}) => {
  return (
    <>
      <div className={style.formField}>
        <label htmlFor={name} className={style.label}>
          {label}
        </label>
        <input
          placeholder={placeholder}
          id={name}
          name={name}
          type={type}
          className={style.input}
          onChange={onChange}
          value={value}
          onBlur={onBlur}
        />
      </div>
      {error && <p className={style.error}>{error}</p>}
    </>
  );
};

export default Input;
