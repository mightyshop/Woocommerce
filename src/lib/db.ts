import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'mighpaya_mobilevivonus',
  password: 'YD4+vOmo57@)',
  database: 'mighpaya_mobile.vivon.us',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export interface Slide {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  clicks: number;
  active: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export const createSlidersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS sliders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      image_url TEXT NOT NULL,
      link_url TEXT NOT NULL,
      clicks INT DEFAULT 0,
      active BOOLEAN DEFAULT TRUE,
      order_position INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.query(query);
    console.log('Sliders table created successfully');
  } catch (error) {
    console.error('Error creating sliders table:', error);
    throw error;
  }
};

export const getSlides = async (): Promise<Slide[]> => {
  try {
    const [rows] = await pool.query<Slide[]>(
      'SELECT * FROM sliders ORDER BY order_position ASC'
    );
    return rows;
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
};

export const createSlide = async (slide: Omit<Slide, 'id' | 'clicks' | 'created_at' | 'updated_at'>) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO sliders (title, image_url, link_url, active, order_position) VALUES (?, ?, ?, ?, ?)',
      [slide.title, slide.image_url, slide.link_url, slide.active, slide.order_position]
    );
    return result;
  } catch (error) {
    console.error('Error creating slide:', error);
    throw new Error('Failed to create slide');
  }
};

export const updateSlide = async (id: number, slide: Partial<Omit<Slide, 'id' | 'created_at' | 'updated_at'>>) => {
  try {
    const [result] = await pool.query(
      'UPDATE sliders SET ? WHERE id = ?',
      [slide, id]
    );
    return result;
  } catch (error) {
    console.error('Error updating slide:', error);
    throw new Error('Failed to update slide');
  }
};

export const deleteSlide = async (id: number) => {
  try {
    await pool.query('DELETE FROM sliders WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw new Error('Failed to delete slide');
  }
};

export const incrementSlideClicks = async (id: number) => {
  try {
    await pool.query(
      'UPDATE sliders SET clicks = clicks + 1 WHERE id = ?',
      [id]
    );
  } catch (error) {
    console.error('Error incrementing clicks:', error);
  }
};