import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path relative to the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eventsDir = path.join(__dirname, '../../../data/events');

export async function GET() {
  try {
    // Ensure events directory exists
    await fs.mkdir(eventsDir, { recursive: true });
    
    // Read all event files
    const files = await fs.readdir(eventsDir);
    const events = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const content = await fs.readFile(path.join(eventsDir, file), 'utf-8');
          return JSON.parse(content);
        })
    );
    
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request }) {
  try {
    const { eventData } = await request.json();

    // Prepare event data
    const event = {
      id: eventData.id || Date.now().toString(),
      name: eventData.name,
      format: eventData.format,
      date: eventData.date,
      participants: eventData.participants || []
    };
    
    // Ensure events directory exists
    await fs.mkdir(eventsDir, { recursive: true });
    
    const fileName = `${event.id}-${event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    const filePath = path.join(eventsDir, fileName);
    
    await fs.writeFile(
      filePath,
      JSON.stringify(event, null, 2)
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Event created successfully',
      event 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('POST Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT({ request }) {
  try {
    const { eventData } = await request.json();

    // Ensure events directory exists
    await fs.mkdir(eventsDir, { recursive: true });

    // Find existing event file
    const eventFiles = await fs.readdir(eventsDir);
    const existingEventFile = eventFiles.find(file => file.startsWith(`${eventData.id}-`));

    if (!existingEventFile) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Event not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare updated event data
    const event = {
      id: eventData.id,
      name: eventData.name,
      format: eventData.format,
      date: eventData.date,
      participants: eventData.participants || []
    };
    
    const filePath = path.join(eventsDir, existingEventFile);
    
    await fs.writeFile(
      filePath,
      JSON.stringify(event, null, 2)
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Event updated successfully',
      event 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE({ request }) {
  try {
    const { id } = await request.json();
    
    // Ensure events directory exists
    await fs.mkdir(eventsDir, { recursive: true });
    
    const files = await fs.readdir(eventsDir);
    const eventFile = files.find(file => file.startsWith(id));
    
    if (!eventFile) {
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await fs.unlink(path.join(eventsDir, eventFile));
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
