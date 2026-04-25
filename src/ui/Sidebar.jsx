import React from 'react';

export default function Sidebar({ children, side = 'right' }) {
  return <aside className={`sidebar ${side}`}>{children}</aside>;
}
