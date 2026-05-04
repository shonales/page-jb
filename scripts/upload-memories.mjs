import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const supabaseUrl = 'https://dqobhcolbbxuuocsyyuq.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;
const photosDir = '/home/shon/Desktop/fotos_page_jb';

if (!serviceRoleKey) {
  throw new Error('Set SUPABASE_SERVICE_ROLE before running this script.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const memories = [
  {
    file: 'jenga.jpeg',
    path: 'memories/2025-04-14-jenga.jpeg',
    title: 'Jenga con Bill',
    description: 'Jugamos jenga con Bill antes de ser enamorados. Fue un momento simple, divertido y bonito de recordar.',
    date: '2025-04-14',
    favorite: false,
    order: 10,
  },
  {
    file: 'Primera foto juntos.jpeg',
    path: 'memories/2025-07-18-primera-foto-juntos.jpeg',
    title: 'Primera foto juntos',
    description:
      'Nuestra primera foto juntos en la parada de la Universidad Nacional de Juliaca, el dia en que ella vio a mis padres.',
    date: '2025-07-18',
    favorite: true,
    order: 20,
  },
  {
    file: 'primer vinito.jpeg',
    path: 'memories/2025-07-25-primer-vinito.jpeg',
    title: 'Primer vinito',
    description: 'Tomamos nuestro primer vino juntos, nos mareamos un poco y ella termino durmiendose.',
    date: '2025-07-25',
    favorite: false,
    order: 30,
  },
  {
    file: 'alitas picantes.jpeg',
    path: 'memories/2025-08-24-alitas-picantes.jpeg',
    title: 'Alitas picantes',
    description: 'Comimos alitas muy picantes; ella ya no podia mas y yo seguia comiendo normal.',
    date: '2025-08-24',
    favorite: false,
    order: 40,
  },
  {
    file: 'feria .jpeg',
    path: 'memories/2025-09-12-feria.jpeg',
    title: 'Feria de noche',
    description: 'Fuimos a la feria de noche y miramos Juliaca desde las alturas.',
    date: '2025-09-12',
    favorite: false,
    order: 50,
  },
  {
    file: 'llavero.jpeg',
    path: 'memories/2025-09-24-llavero.jpeg',
    title: 'Feria y llavero',
    description: 'Fuimos a la feria de juegos mecanicos en Juliaca y quedo este recuerdo bonito.',
    date: '2025-09-24',
    favorite: false,
    order: 60,
  },
  {
    file: 'pizza .jpeg',
    path: 'memories/2025-10-12-pizza.jpeg',
    title: 'Pizza y coctel',
    description: 'La primera vez que a Behetsave le gusto la pizza; tambien tomamos un coctel y casi se duerme.',
    date: '2025-10-12',
    favorite: false,
    order: 70,
  },
  {
    file: 'Cine.jpeg',
    path: 'memories/2025-11-30-cine.jpeg',
    title: 'Salida al cine',
    description: 'Fuimos al cine y pasamos un dia lindo juntos.',
    date: '2025-11-30',
    favorite: false,
    order: 80,
  },
  {
    file: 'cinee.jpeg',
    path: 'memories/2025-11-30-cinee.jpeg',
    title: 'Otro recuerdo del cine',
    description: 'Otra foto de nuestra salida al cine, un dia tranquilo y bonito para guardar.',
    date: '2025-11-30',
    favorite: false,
    order: 81,
  },
  {
    file: 'cita.jpeg',
    path: 'memories/2025-12-04-cita-siete-meses.jpeg',
    title: 'Cita de siete meses',
    description: 'Un dia que salimos para celebrar que cumpliamos siete meses juntos.',
    date: '2025-12-04',
    favorite: true,
    order: 90,
  },
  {
    file: '7 meses.jpeg',
    path: 'memories/2025-12-04-siete-meses.jpeg',
    title: 'Siete meses',
    description: 'Otra foto del mismo dia, celebrando nuestros siete meses.',
    date: '2025-12-04',
    favorite: true,
    order: 91,
  },
  {
    file: 'putina.jpeg',
    path: 'memories/2025-12-25-putina.jpeg',
    title: 'Piscina municipal de Putina',
    description: 'Un momento bonito en la ciudad de Putina, en su piscina municipal.',
    date: '2025-12-25',
    favorite: false,
    order: 100,
  },
  {
    file: 'Plastilina.jpeg',
    path: 'memories/2026-02-14-plastilina.jpeg',
    title: 'Figuras de plastilina',
    description: 'Formamos un pollo, un pulpo y una planta. Fue un dia muy divertido.',
    date: '2026-02-14',
    favorite: false,
    order: 110,
  },
  {
    file: 'Cabanillas.jpeg',
    path: 'memories/2026-02-15-cabanillas.jpeg',
    title: 'Concurso en Cabanillas',
    description: 'Fuimos al concurso de Cabanillas y conoci un poco mas de ese lugar contigo.',
    date: '2026-02-15',
    favorite: false,
    order: 120,
  },
  {
    file: 'Juegos en la mesa.jpeg',
    path: 'memories/2026-02-19-juegos-en-la-mesa.jpeg',
    title: 'Juegos en la mesa',
    description: 'Fuimos a una cafeteria con una mesa tactil Android para jugar. Fue muy divertido.',
    date: '2026-02-19',
    favorite: false,
    order: 130,
  },
  {
    file: 'San miguel.jpeg',
    path: 'memories/2026-02-22-san-miguel.jpeg',
    title: 'Pasacalle en San Miguel',
    description: 'Estuvimos en el concurso de danzas de San Miguel, en un pasacalle lleno de movimiento.',
    date: '2026-02-22',
    favorite: false,
    order: 140,
  },
  {
    file: 'Punito.jpeg',
    path: 'memories/2026-02-24-punito.jpeg',
    title: 'Viaje a Punito',
    description: 'Un dia muy bonito porque nos divertimos viajando juntos.',
    date: '2026-02-24',
    favorite: true,
    order: 150,
  },
  {
    file: 'el bicho.jpeg',
    path: 'memories/2026-04-06-el-bicho.jpeg',
    title: 'El bicho',
    description: 'Behetsave me regalo el peluche de CR7, un detalle que se quedo como recuerdo especial.',
    date: '2026-04-06',
    favorite: false,
    order: 160,
  },
  {
    file: 'taza.jpeg',
    path: 'memories/taza.jpeg',
    title: 'Taza',
    description: 'Un recuerdo pendiente de completar con fecha y descripcion.',
    date: null,
    favorite: false,
    order: 170,
  },
];

const avatars = [
  { file: 'jhon.jpeg', path: 'profiles/jhon.jpeg', username: 'jhon' },
  { file: 'behetsa.jpeg', path: 'profiles/behetsave.jpeg', username: 'behetsave' },
];

async function upload(bucket, objectPath, fileName) {
  const buffer = await readFile(path.join(photosDir, fileName));
  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (error) {
    throw new Error(`${fileName}: ${error.message}`);
  }
}

for (const memory of memories) {
  await upload('album', memory.path, memory.file);
  const { error } = await supabase.from('album_photos').upsert(
    {
      title: memory.title,
      description: memory.description,
      photo_path: memory.path,
      photo_date: memory.date,
      is_favorite: memory.favorite,
      sort_order: memory.order,
    },
    { onConflict: 'photo_path' },
  );

  if (error) {
    throw new Error(`${memory.file}: ${error.message}`);
  }

  console.log(`album: ${memory.file}`);
}

for (const avatar of avatars) {
  await upload('avatars', avatar.path, avatar.file);
  const { error } = await supabase.from('profiles').update({ avatar_url: avatar.path }).eq('username', avatar.username);

  if (error) {
    throw new Error(`${avatar.file}: ${error.message}`);
  }

  console.log(`avatar: ${avatar.file}`);
}
