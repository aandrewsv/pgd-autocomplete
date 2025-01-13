import { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';
import { Character } from '../../types';
import { searchCharacters } from '../../services/api';
import './Autocomplete.css';

interface CacheItem {
  timestamp: number;
  data: Character[];
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ENTER = 'Enter';
const ESCAPE = 'Escape';

const Autocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<number>();
  const searchCache = useRef<Map<string, CacheItem>>(new Map());
  const listRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const searchWithDebounce = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    const now = Date.now();

    // Limpiar caché antiguo
    Array.from(searchCache.current.entries()).forEach(([key, value]) => {
      if (now - value.timestamp > CACHE_DURATION) {
        searchCache.current.delete(key);
      }
    });

    // Verificar caché
    const cachedResult = searchCache.current.get(normalizedQuery);
    if (cachedResult && now - cachedResult.timestamp < CACHE_DURATION) {
      setSuggestions(cachedResult.data);
      setIsOpen(true);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const results = await searchCharacters(searchQuery);
      
      // Guardar en caché
      searchCache.current.set(normalizedQuery, {
        timestamp: now,
        data: results
      });
      
      setSuggestions(results);
      setIsOpen(true);
    } catch (error) {
      console.error('Error searching characters:', error);
      setError('Error al buscar personajes');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const scrollIntoView = useCallback((index: number) => {
    if (listRef.current) {
      const items = listRef.current.getElementsByClassName('autocomplete-item');
      if (items[index]) {
        items[index].scrollIntoView({ block: 'nearest' });
      }
    }
  }, []);

  const handleSelect = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setQuery(character.name);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedCharacter(null);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  const handleInputClick = () => {
    if (query.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key !== ESCAPE) {
      setIsOpen(true);
    }

    switch (e.key) {
      case ARROW_DOWN:
        e.preventDefault();
        setActiveIndex(prev => {
          const next = prev < suggestions.length - 1 ? prev + 1 : 0;
          scrollIntoView(next);
          return next;
        });
        break;
      case ARROW_UP:
        e.preventDefault();
        setActiveIndex(prev => {
          const next = prev > 0 ? prev - 1 : suggestions.length - 1;
          scrollIntoView(next);
          return next;
        });
        break;
      case ENTER:
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case ESCAPE:
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, suggestions, scrollIntoView, activeIndex, handleSelect]);

  useEffect(() => {
    if (debounceTimeout.current) {
      window.clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      searchWithDebounce(query);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        window.clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, searchWithDebounce]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  return (
    <div 
      className="autocomplete-container" 
      ref={autocompleteRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="autocomplete-list"
    >
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="autocomplete-input"
          value={query}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder="Buscar personaje de Dragon Ball..."
          aria-label="Buscar personaje"
          aria-autocomplete="list"
          aria-controls={isOpen ? "autocomplete-list" : undefined}
          aria-activedescendant={activeIndex >= 0 ? `character-${suggestions[activeIndex]?.id}` : undefined}
        />
        {selectedCharacter && (
          <div className="selected-indicator" aria-hidden="true">
            <img 
              src={selectedCharacter.image} 
              alt=""
              className="selected-image"
              loading="lazy"
            />
          </div>
        )}
      </div>
      
      {isOpen && (suggestions.length > 0 || loading || error) && (
        <div 
          id="autocomplete-list"
          ref={listRef}
          className="autocomplete-list"
          role="listbox"
          aria-label="Sugerencias de personajes"
        >
          {loading && <div className="loading">Buscando...</div>}
          
          {error && <div className="error" role="alert">{error}</div>}
          
          {!loading && !error && suggestions.map((character, index) => (
            <div 
              key={character.id}
              id={`character-${character.id}`}
              className={`autocomplete-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleSelect(character)}
              role="option"
              aria-selected={index === activeIndex}
              tabIndex={-1}
            >
              <img 
                src={character.image} 
                alt="" 
                loading="lazy"
                aria-hidden="true"
              />
              <div className="autocomplete-item-info">
                <div 
                  className="autocomplete-item-name"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(character.name, query)
                  }}
                />
                <div className="autocomplete-item-race">{character.race}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;