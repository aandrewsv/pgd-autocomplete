import { Character, APIResponse } from '../types';

const API_BASE_URL = 'https://dragonball-api.com/api/characters';

export const fetchCharacters = async (page: number = 1): Promise<APIResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=20`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

export const searchCharacters = async (query: string): Promise<Character[]> => {
  try {
    const allCharacters: Character[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await fetchCharacters(currentPage);
      allCharacters.push(...response.items);
      
      hasMorePages = currentPage < response.meta.totalPages;
      currentPage++;
    }

    return allCharacters.filter(character => 
      character.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching characters:', error);
    throw error;
  }
};