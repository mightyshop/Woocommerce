import { createSlidersTable } from './db';

const initDatabase = async () => {
  try {
    await createSlidersTable();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDatabase();