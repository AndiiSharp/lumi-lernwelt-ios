// Lumi Lernwelt – Inhalte (Woerter, Sticker, Texte). Reines Daten-Modul.
'use strict';
var LW = window.LW || (window.LW = {});

// Woerter: [Wort, Silben (mit -), Artikel, Emoji]
LW.WORDS = {
  de: [
    ['Affe', 'Af-fe', 'der', '🐒'], ['Ameise', 'A-mei-se', 'die', '🐜'], ['Apfel', 'Ap-fel', 'der', '🍎'], ['Ananas', 'A-na-nas', 'die', '🍍'], ['Auto', 'Au-to', 'das', '🚗'],
    ['Ball', 'Ball', 'der', '⚽'], ['Banane', 'Ba-na-ne', 'die', '🍌'], ['Baum', 'Baum', 'der', '🌳'], ['Biene', 'Bie-ne', 'die', '🐝'], ['Blume', 'Blu-me', 'die', '🌸'],
    ['Brot', 'Brot', 'das', '🍞'], ['Buch', 'Buch', 'das', '📖'], ['Bus', 'Bus', 'der', '🚌'], ['Dino', 'Di-no', 'der', '🦕'], ['Drache', 'Dra-che', 'der', '🐉'],
    ['Delfin', 'Del-fin', 'der', '🐬'], ['Ei', 'Ei', 'das', '🥚'], ['Eis', 'Eis', 'das', '🍦'], ['Elefant', 'E-le-fant', 'der', '🐘'], ['Ente', 'En-te', 'die', '🦆'],
    ['Eule', 'Eu-le', 'die', '🦉'], ['Fisch', 'Fisch', 'der', '🐟'], ['Frosch', 'Frosch', 'der', '🐸'], ['Fuchs', 'Fuchs', 'der', '🦊'], ['Feder', 'Fe-der', 'die', '🪶'],
    ['Giraffe', 'Gi-raf-fe', 'die', '🦒'], ['Geschenk', 'Ge-schenk', 'das', '🎁'], ['Gitarre', 'Gi-tar-re', 'die', '🎸'], ['Haus', 'Haus', 'das', '🏠'], ['Hase', 'Ha-se', 'der', '🐰'],
    ['Herz', 'Herz', 'das', '❤️'], ['Hund', 'Hund', 'der', '🐶'], ['Hut', 'Hut', 'der', '🎩'], ['Igel', 'I-gel', 'der', '🦔'], ['Insel', 'In-sel', 'die', '🏝️'],
    ['Jacke', 'Ja-cke', 'die', '🧥'], ['Käse', 'Kä-se', 'der', '🧀'], ['Katze', 'Kat-ze', 'die', '🐱'], ['Kuh', 'Kuh', 'die', '🐮'], ['Krone', 'Kro-ne', 'die', '👑'],
    ['Kuchen', 'Ku-chen', 'der', '🍰'], ['Löwe', 'Lö-we', 'der', '🦁'], ['Leiter', 'Lei-ter', 'die', '🪜'], ['Mond', 'Mond', 'der', '🌙'], ['Maus', 'Maus', 'die', '🐭'],
    ['Möhre', 'Möh-re', 'die', '🥕'], ['Nase', 'Na-se', 'die', '👃'], ['Nest', 'Nest', 'das', '🪺'], ['Oma', 'O-ma', 'die', '👵'], ['Opa', 'O-pa', 'der', '👴'],
    ['Ohr', 'Ohr', 'das', '👂'], ['Pinguin', 'Pin-gu-in', 'der', '🐧'], ['Pizza', 'Piz-za', 'die', '🍕'], ['Pilz', 'Pilz', 'der', '🍄'], ['Qualle', 'Qual-le', 'die', '🪼'],
    ['Rakete', 'Ra-ke-te', 'die', '🚀'], ['Regen', 'Re-gen', 'der', '🌧️'], ['Rose', 'Ro-se', 'die', '🌹'], ['Sonne', 'Son-ne', 'die', '☀️'], ['Schaf', 'Schaf', 'das', '🐑'],
    ['Schnecke', 'Schne-cke', 'die', '🐌'], ['Stern', 'Stern', 'der', '⭐'], ['Tiger', 'Ti-ger', 'der', '🐯'], ['Tomate', 'To-ma-te', 'die', '🍅'], ['Tasse', 'Tas-se', 'die', '☕'],
    ['Uhr', 'Uhr', 'die', '⏰'], ['Ufo', 'U-fo', 'das', '🛸'], ['Vogel', 'Vo-gel', 'der', '🐦'], ['Vulkan', 'Vul-kan', 'der', '🌋'], ['Wal', 'Wal', 'der', '🐳'],
    ['Wolke', 'Wol-ke', 'die', '☁️'], ['Wurm', 'Wurm', 'der', '🪱'], ['Zebra', 'Ze-bra', 'das', '🦓'], ['Zug', 'Zug', 'der', '🚂'], ['Zitrone', 'Zi-tro-ne', 'die', '🍋'],
    ['Zahn', 'Zahn', 'der', '🦷'], ['Schildkröte', 'Schild-krö-te', 'die', '🐢'], ['Erdbeere', 'Erd-bee-re', 'die', '🍓'], ['Schmetterling', 'Schmet-ter-ling', 'der', '🦋'], ['Kamel', 'Ka-mel', 'das', '🐫']
  ],
  en: [
    ['Ant', 'ant', 'an', '🐜'], ['Apple', 'ap-ple', 'an', '🍎'], ['Ball', 'ball', 'a', '⚽'], ['Banana', 'ba-na-na', 'a', '🍌'], ['Bee', 'bee', 'a', '🐝'],
    ['Book', 'book', 'a', '📖'], ['Bus', 'bus', 'a', '🚌'], ['Cake', 'cake', 'a', '🍰'], ['Car', 'car', 'a', '🚗'], ['Cat', 'cat', 'a', '🐱'],
    ['Cow', 'cow', 'a', '🐮'], ['Crown', 'crown', 'a', '👑'], ['Dog', 'dog', 'a', '🐶'], ['Duck', 'duck', 'a', '🦆'], ['Dino', 'di-no', 'a', '🦕'],
    ['Dragon', 'drag-on', 'a', '🐉'], ['Egg', 'egg', 'an', '🥚'], ['Elephant', 'el-e-phant', 'an', '🐘'], ['Fish', 'fish', 'a', '🐟'], ['Fox', 'fox', 'a', '🦊'],
    ['Frog', 'frog', 'a', '🐸'], ['Gift', 'gift', 'a', '🎁'], ['Giraffe', 'gi-raffe', 'a', '🦒'], ['Guitar', 'gui-tar', 'a', '🎸'], ['Hat', 'hat', 'a', '🎩'],
    ['Heart', 'heart', 'a', '❤️'], ['House', 'house', 'a', '🏠'], ['Island', 'is-land', 'an', '🏝️'], ['Jacket', 'jack-et', 'a', '🧥'], ['Juice', 'juice', 'a', '🧃'],
    ['Key', 'key', 'a', '🔑'], ['Kite', 'kite', 'a', '🪁'], ['Ladder', 'lad-der', 'a', '🪜'], ['Lemon', 'lem-on', 'a', '🍋'], ['Lion', 'li-on', 'a', '🦁'],
    ['Moon', 'moon', 'a', '🌙'], ['Mouse', 'mouse', 'a', '🐭'], ['Mushroom', 'mush-room', 'a', '🍄'], ['Nest', 'nest', 'a', '🪺'], ['Nose', 'nose', 'a', '👃'],
    ['Octopus', 'oc-to-pus', 'an', '🐙'], ['Owl', 'owl', 'an', '🦉'], ['Penguin', 'pen-guin', 'a', '🐧'], ['Pig', 'pig', 'a', '🐷'], ['Pizza', 'piz-za', 'a', '🍕'],
    ['Queen', 'queen', 'a', '👸'], ['Rabbit', 'rab-bit', 'a', '🐰'], ['Rocket', 'rock-et', 'a', '🚀'], ['Rose', 'rose', 'a', '🌹'], ['Snail', 'snail', 'a', '🐌'],
    ['Star', 'star', 'a', '⭐'], ['Sun', 'sun', 'a', '☀️'], ['Strawberry', 'straw-ber-ry', 'a', '🍓'], ['Tiger', 'ti-ger', 'a', '🐯'], ['Tomato', 'to-ma-to', 'a', '🍅'],
    ['Tree', 'tree', 'a', '🌳'], ['Turtle', 'tur-tle', 'a', '🐢'], ['Umbrella', 'um-brel-la', 'an', '☂️'], ['UFO', 'u-fo', 'a', '🛸'], ['Violin', 'vi-o-lin', 'a', '🎻'],
    ['Volcano', 'vol-ca-no', 'a', '🌋'], ['Whale', 'whale', 'a', '🐳'], ['Worm', 'worm', 'a', '🪱'], ['Yo-yo', 'yo-yo', 'a', '🪀'], ['Zebra', 'ze-bra', 'a', '🦓'],
    ['Butterfly', 'but-ter-fly', 'a', '🦋'], ['Camel', 'cam-el', 'a', '🐫'], ['Cheese', 'cheese', 'a', '🧀'], ['Cloud', 'cloud', 'a', '☁️'], ['Train', 'train', 'a', '🚂']
  ]
};

// Farben fuer "Stimmt das?"-Saetze: [Emoji, richtige Farbe de, en]
LW.COLORFACTS = [
  ['🍌', 'gelb', 'yellow'], ['🍎', 'rot', 'red'], ['🌳', 'grün', 'green'], ['🐸', 'grün', 'green'], ['☀️', 'gelb', 'yellow'], ['🍓', 'rot', 'red'],
  ['🥕', 'orange', 'orange'], ['🐳', 'blau', 'blue'], ['🍋', 'gelb', 'yellow'], ['🍅', 'rot', 'red'], ['🐘', 'grau', 'grey'], ['🍫', 'braun', 'brown']
];
LW.COLORS = { de: ['rot', 'gelb', 'grün', 'blau', 'orange', 'grau', 'braun', 'lila'], en: ['red', 'yellow', 'green', 'blue', 'orange', 'grey', 'brown', 'purple'] };

// Sticker-Album (Belohnungen)
LW.STICKERS = ['🦄', '🐲', '🦖', '🐙', '🦜', '🐼', '🐨', '🦊', '🐯', '🦁', '🐸', '🐵', '🐧', '🦉', '🐢', '🐬',
  '🚀', '🛸', '🌈', '⭐', '🌙', '🪐', '☄️', '🌋', '🎈', '🎨', '🎸', '🥁', '🎮', '🧩', '🪁', '🛹',
  '🍩', '🍉', '🍕', '🧁', '🍭', '🍿', '🥨', '🍓', '👑', '💎', '🏆', '🎁', '🔮', '🧸', '🏰', '🎡'];

// Avatare fuer Kinderprofile
LW.AVATARS = ['🦊', '🐼', '🐯', '🦄', '🐸', '🐧', '🐨', '🦁', '🐰', '🐶', '🐱', '🐵'];

// Lumis Huete (freigeschaltet ueber Sterne)
LW.HATS = [
  { id: 'none', need: 0 }, { id: 'cap', need: 15 }, { id: 'party', need: 40 }, { id: 'crown', need: 80 }, { id: 'wizard', need: 130 }, { id: 'astro', need: 200 }
];

LW.FILES = {};
