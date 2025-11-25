const hiddenAbilities = {
  bulbasaur: {
    name: 'Chlorophyll',
    description: "Boosts the Pokémon's Speed stat in sunny weather.",
  },
  charmander: {
    name: 'Solar Power',
    description: "In sunny weather, the Pokémon's Sp. Atk is boosted, but HP is taken away every turn.",
  },
  squirtle: {
    name: 'Rain Dish',
    description: "The Pokémon has its HP restored by 1/16th of its maximum HP every turn when it is raining.",
  },
  articuno: {
    name: 'Snow Cloak',
    description: "Boosts the Pokémon's evasion in a snowstorm.",
  },
  zapdos: {
    name: 'Static',
    description: 'Contact with the Pokémon may cause paralysis.',
  },
  moltres: {
    name: 'Flame Body',
    description: 'Contact with the Pokémon may cause a burn.',
  },
  chikorita: {
    name: 'Leaf Guard',
    description: "Prevents the Pokémon from incurring status conditions in sunny weather.",
  },
  cyndaquil: {
    name: 'Flash Fire',
    description: "Powers up Fire-type moves if the Pokémon is hit by one.",
  },
  totodile: {
    name: 'Sheer Force',
    description: 'Removes the added effects of moves to increase their power by 30%.',
  },
  raikou: {
    name: 'Inner Focus',
    description: "The Pokémon's intensely focused mind protects it from flinching.",
  },
  entei: {
    name: 'Inner Focus',
    description: "The Pokémon's intensely focused mind protects it from flinching.",
  },
  suicune: {
    name: 'Water Absorb',
    description: 'Restores HP if the Pokémon is hit by a Water-type move.',
  },
  lugia: {
    name: 'Multiscale',
    description: 'Reduces the amount of damage the Pokémon takes while its HP is full.',
  },
  'ho-oh': {
    name: 'Regenerator',
    description: "Restores a small amount of the Pokémon's HP when it switches out of battle.",
  },
  treecko: {
    name: 'Unburden',
    description: "Boosts the Speed stat if the Pokémon's held item is used or lost.",
  },
  torchic: {
    name: 'Speed Boost',
    description: "The Pokémon's Speed stat is boosted at the end of each turn.",
  },
  mudkip: {
    name: 'Damp',
    description: 'Prevents the use of the moves Self-Destruct and Explosion.',
  },
  regirock: {
    name: 'Sturdy',
    description: 'The Pokémon cannot be knocked out in one hit as long as its HP is full.',
  },
  regice: {
    name: 'Ice Body',
    description: 'The Pokémon gradually recovers HP in a snowstorm.',
  },
  registeel: {
    name: 'Light Metal',
    description: "Halves the Pokémon's weight.",
  },
  latias: {
    name: 'Levitate',
    description: 'Prevents Ground-type moves from affecting the Pokémon.',
  },
  latios: {
    name: 'Levitate',
    description: 'Prevents Ground-type moves from affecting the Pokémon.',
  },
  kyogre: {
    name: 'Drizzle',
    description: 'The Pokémon makes it rain when it enters a battle.',
  },
  groudon: {
    name: 'Drought',
    description: 'The Pokémon makes it sunny when it enters a battle.',
  },
  rayquaza: {
    name: 'Air Lock',
    description: 'Eliminates the effects of weather.',
  },
  turtwig: {
    name: 'Shell Armor',
    description: 'The Pokémon is protected against critical hits.',
  },
  chimchar: {
    name: 'Iron Fist',
    description: 'Powers up punching moves.',
  },
  piplup: {
    name: 'Defiant',
    description: "Boosts the Pokémon's Attack stat the first time its stats are lowered.",
  },
  uxie: {
    name: 'Levitate',
    description: 'The Pokémon is protected from Ground-type moves.',
  },
  mesprit: {
    name: 'Levitate',
    description: 'The Pokémon is protected from Ground-type moves.',
  },
  azelf: {
    name: 'Levitate',
    description: 'The Pokémon is protected from Ground-type moves.',
  },
  dialga: {
    name: 'Telepathy',
    description: "Protects the Pokémon from damaging moves used by its allies.",
  },
  palkia: {
    name: 'Telepathy',
    description: "Protects the Pokémon from damaging moves used by its allies.",
  },
  giratina: {
    name: 'Telepathy',
    description: "Protects the Pokémon from damaging moves used by its allies.",
  },
  cresselia: {
    name: 'Levitate',
    description: 'The Pokémon is protected from Ground-type moves.',
  },
  darkrai: {
    name: 'Bad Dreams',
    description: 'Reduces the HP of sleeping enemies.',
  },
  snivy: {
    name: 'Contrary',
    description: 'Reverses any stat changes affecting the Pokémon.',
  },
  tepig: {
    name: 'Thick Fat',
    description: 'Reduces the damage the Pokémon takes from Fire- and Ice-type moves.',
  },
  oshawott: {
    name: 'Shell Armor',
    description: 'The Pokémon is protected against critical hits.',
  },
  cobalion: {
    name: 'Justified',
    description: "Boosts the Attack stat when the Pokémon is hit by a Dark-type move.",
  },
  terrakion: {
    name: 'Justified',
    description: "Boosts the Attack stat when the Pokémon is hit by a Dark-type move.",
  },
  virizion: {
    name: 'Justified',
    description: "Boosts the Attack stat when the Pokémon is hit by a Dark-type move.",
  },
  keldeo: {
    name: 'Justified',
    description: "Boosts the Attack stat when the Pokémon is hit by a Dark-type move.",
  },
  tornadus: {
    name: 'Defiant',
    description: "Boosts the Pokémon's Attack stat the first time its stats are lowered.",
  },
  landorus: {
    name: 'Sheer Force',
    description: 'Removes the added effects of moves to increase their power by 30%.',
  },
  thundurus: {
    name: 'Defiant',
    description: "Boosts the Pokémon's Attack stat the first time its stats are lowered.",
  },
  reshiram: {
    name: 'Turboblaze',
    description: "The Pokémon's moves are not affected by the abilities of the targets.",
  },
  zekrom: {
    name: 'Teravolt',
    description: "The Pokémon's moves are not affected by the abilities of the targets.",
  },
  kyurem: {
    name: 'Pressure',
    description: "The Pokémon's intimidating presence causes the foe to use more PP.",
  },
  chespin: {
    name: 'Bulletproof',
    description: 'Protects the Pokémon from ball and bomb moves.',
  },
  fennekin: {
    name: 'Magician',
    description: "The Pokémon steals the held item of any Pokémon it hits with an attack.",
  },
  froakie: {
    name: 'Protean',
    description: "The Pokémon changes its type to the type of the move it's about to use.",
  },
  xerneas: {
    name: 'Fairy Aura',
    description: "Powers up the Fairy-type moves of all Pokémon on the field.",
  },
  yveltal: {
    name: 'Dark Aura',
    description: "Powers up the Dark-type moves of all Pokémon on the field.",
  },
  zygarde: {
    name: 'Power Construct',
    description: 'The Pokémon transforms into its 100% Forme when its HP drops below half.',
  },
  rowlet: {
    name: 'Long Reach',
    description: 'The Pokémon can attack without making contact with the target.',
  },
  litten: {
    name: 'Intimidate',
    description: 'Upon entering battle, the Pokémon lowers the Attack of opposing Pokémon.',
  },
  popplio: {
    name: 'Liquid Voice',
    description: 'All sound-based moves become Water-type moves.',
  },
  'tapu-koko': {
    name: 'Electric Surge',
    description: 'The Pokémon creates an Electric Terrain when it enters a battle.',
  },
  'tapu-lele': {
    name: 'Psychic Surge',
    description: 'The Pokémon creates a Psychic Terrain when it enters a battle.',
  },
  'tapu-bulu': {
    name: 'Grassy Surge',
    description: 'The Pokémon creates a Grassy Terrain when it enters a battle.',
  },
  'tapu-fini': {
    name: 'Misty Surge',
    description: 'The Pokémon creates a Misty Terrain when it enters a battle.',
  },
  grookey: {
    name: 'Grassy Surge',
    description: 'The Pokémon creates a Grassy Terrain when it enters a battle.',
  },
  scorbunny: {
    name: 'Libero',
    description: "The Pokémon changes its type to the type of the move it's about to use.",
  },
  sobble: {
    name: 'Sniper',
    description: 'The power of moves is increased if they become critical hits.',
  },
  regieleki: {
    name: 'Transistor',
    description: 'Powers up Electric-type moves.',
  },
  regidrago: {
    name: "Dragon's Maw",
    description: 'Powers up Dragon-type moves.',
  },
  sprigatito: {
    name: 'Protean',
    description: "The Pokémon changes its type to the type of the move it's about to use.",
  },
  fuecoco: {
    name: 'Unaware',
    description: "The Pokémon ignores the opponent's stat changes when attacking or being attacked.",
  },
  quaxly: {
    name: 'Moxie',
    description: "The Pokémon's Attack stat is boosted every time it knocks out a Pokémon.",
  },
};

module.exports = hiddenAbilities;

