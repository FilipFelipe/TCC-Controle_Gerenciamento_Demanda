import React from 'react';
import styles from './Card.module.css';

const Card = ({ width, children, height, className }) => {
  return (
    <div
      style={{ width: `${width}`, height: `${height}` }}
      className={`${styles.card} ${className ? className : ''}`}
    >
      {children}
    </div>
  );
};

export default Card;
