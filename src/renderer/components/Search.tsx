import React, { useState } from 'react';
import styles from '../styles/search.module.scss';

interface Props {
  onSearch: (term: string) => void;
}

export default function Search({ onSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Trigger search whenever the search term changes
  };

  return (
    <form>
      <div className={styles.group}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    </form>
  );
}
