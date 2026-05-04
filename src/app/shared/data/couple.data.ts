import { CoupleProfile, Letter, LocalPhoto, TimelineItem } from '../models/memory.models';

export const coupleProfile: CoupleProfile = {
  jhonName: 'JHON ALEX MORALES APAZA',
  behetsaveName: 'BEHETSAVE YOBANA LUZA CABANA',
  jhonBirthday: '2003-11-18',
  behetsaveBirthday: '2003-03-23',
  anniversary: '2025-05-04',
};

export const starterTimeline: TimelineItem[] = [
  {
    date: '2025-03-23',
    title: 'Cumpleanos de Behetsave',
    description: 'Una fecha importante para preparar detalles, cartas y recuerdos especiales.',
    tag: 'Cumpleanos',
  },
  {
    date: '2025-05-04',
    title: 'Nuestro aniversario',
    description: 'El inicio oficial de una historia que merece guardarse con detalle.',
    tag: 'Aniversario',
  },
  {
    date: '2025-05-12',
    title: 'Una foto para recordar',
    description: 'Aqui puedes guardar una salida, una captura o un momento pequeno que se volvio especial.',
    tag: 'Foto',
  },
  {
    date: '2025-06-01',
    title: 'Primera carta guardada',
    description: 'Una carta que queda lista para volver a leerse cuando haga falta recordar lo bonito.',
    tag: 'Carta',
  },
  {
    date: '2025-07-20',
    title: 'Un plan pendiente',
    description: 'Una seccion perfecta para registrar viajes, comidas, peliculas o cosas que quieren hacer juntos.',
    tag: 'Plan',
  },
  {
    date: '2025-09-10',
    title: 'Detalle inesperado',
    description: 'Los momentos sorpresa tambien pueden vivir aqui, con una descripcion corta y una imagen.',
    tag: 'Sorpresa',
  },
  {
    date: '2025-05-05',
    title: 'Primer recuerdo guardado',
    description: 'Un espacio listo para agregar fotos, notas, lugares y momentos importantes.',
    tag: 'Recuerdo',
  },
  {
    date: '2025-11-18',
    title: 'Cumpleanos de Jhon',
    description: 'Otra fecha clave para activar cartas, fotos ocultas o mensajes especiales en la pagina.',
    tag: 'Cumpleanos',
  },
  {
    date: '2026-01-01',
    title: 'Nuevo ano juntos',
    description: 'Un buen punto para guardar metas, promesas y deseos para la siguiente etapa.',
    tag: 'Meta',
  },
  {
    date: '2026-03-23',
    title: 'Otra vuelta al sol',
    description: 'El timeline puede crecer cada ano sin cambiar la estructura de la pagina.',
    tag: 'Fecha',
  },
  {
    date: '2026-05-02',
    title: 'La pagina empieza a tomar forma',
    description: 'Creamos el lugar donde van a vivir sus fotos, cartas, juegos y sorpresas.',
    tag: 'Pagina',
  },
];

export const starterLetters: Letter[] = [
  {
    title: 'Para cuando quieras sonreir',
    date: '2026-05-02',
    preview: 'Una carta corta para guardar palabras bonitas y volver a leerlas despues.',
    body: 'Este espacio es para escribir algo real, algo tuyo. Puedes cambiar esta carta por un mensaje para Behetsave, una promesa o una memoria especial.',
  },
  {
    title: 'Carta sorpresa',
    date: '2026-05-04',
    preview: 'Puedes dejarla bloqueada hasta una fecha especial.',
    body: 'Luego conectaremos esto con Supabase para guardar cartas privadas y desbloquearlas por fecha.',
    lockedUntil: '2026-05-04',
  },
];

export const starterPhotos: LocalPhoto[] = [
  {
    id: 1,
    title: 'Nuestro primer album',
    caption: 'Sube aqui una foto especial para reemplazar esta tarjeta.',
    src: '',
    date: '2025-05-04',
  },
  {
    id: 2,
    title: 'Un lugar importante',
    caption: 'Puedes guardar lugares, fechas y pequenas historias.',
    src: '',
    date: '2026-05-02',
  },
];
