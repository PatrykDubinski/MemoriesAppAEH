import axios from 'axios';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'https://jsonplaceholder.typicode.com/todos/1';

/**
 * Pobiera przykładowe zadanie z API.
 * Demonstruje operację asynchroniczną z obsługą błędów.
 */
export const fetchSampleTodo = async (): Promise<Todo> => {
  console.log('Fetching sample todo...');
  try {
    const response = await axios.get<Todo>(API_URL);
    console.log('Sample todo fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching sample todo:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`API error: ${error.message}`);
    } else {
      throw new Error('Internal Server Error.');
    }
  }
};