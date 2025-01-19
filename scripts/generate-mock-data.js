import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eventsDir = path.join(__dirname, '../data/events');

// List of participants
const participants = [
  "Thomas Guibert",
  "John Smith",
  "Emma Wilson",
  "Michael Brown",
  "Sarah Davis",
  "David Lee",
  "Lisa Anderson",
  "James Taylor",
  "Laura Martin",
  "Robert White"
];

// Generate random positions ensuring no duplicates
function generatePositions(count) {
  const positions = Array.from({ length: count }, (_, i) => i + 1);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions;
}

// Generate events data
async function generateEvents() {
  try {
    // Create events directory if it doesn't exist
    await fs.mkdir(eventsDir, { recursive: true });

    // Clear existing events
    const files = await fs.readdir(eventsDir);
    await Promise.all(
      files.map(file => fs.unlink(path.join(eventsDir, file)))
    );

    // Generate 10 events
    for (let i = 1; i <= 10; i++) {
      const positions = generatePositions(participants.length);
      const eventDate = new Date(2024, 0, i * 3); // Events every 3 days starting Jan 1, 2024
      
      const event = {
        id: `${Date.now()}-${i}`,
        name: `LHN 25 - Round ${i}`,
        format: "Slalom Racing",
        date: eventDate.toISOString().split('T')[0],
        participants: participants.map((name, index) => ({
          name,
          position: positions[index]
        }))
      };

      const fileName = `${event.id}-${event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
      await fs.writeFile(
        path.join(eventsDir, fileName),
        JSON.stringify(event, null, 2)
      );

      console.log(`Generated event: ${event.name}`);
    }

    console.log('Mock data generation complete!');
  } catch (error) {
    console.error('Error generating mock data:', error);
  }
}

// Run the generator
generateEvents();
