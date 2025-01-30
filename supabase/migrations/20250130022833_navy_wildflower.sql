/*
  # Create slider management tables

  1. New Tables
    - `sliders`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `image_url` (text, required)
      - `link_url` (text, required)
      - `clicks` (integer, default 0)
      - `active` (boolean, default true)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `order` (integer, default 0)

  2. Security
    - Enable RLS on `sliders` table
    - Add policies for:
      - Authenticated users can read all active sliders
      - Authenticated users can manage sliders
      - Public users can read active sliders
*/

-- Create sliders table
CREATE TABLE IF NOT EXISTS sliders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text NOT NULL,
  clicks integer DEFAULT 0,
  active boolean DEFAULT true,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public users can view active sliders"
  ON sliders
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage sliders"
  ON sliders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_sliders_updated_at
  BEFORE UPDATE ON sliders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment clicks
CREATE OR REPLACE FUNCTION increment_slider_clicks(slider_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE sliders
  SET clicks = clicks + 1
  WHERE id = slider_id;
END;
$$ language 'plpgsql';