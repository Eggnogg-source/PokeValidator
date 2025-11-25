const express = require('express');
const router = express.Router();
const { getAllQuestions, getQuestionById } = require('../models/db');
const hiddenAbilities = require('../data/hiddenAbilities');

// Helper functions

const fetchAbilityDescription = async (abilityUrl) => {
  if (!abilityUrl) return 'No ability description available';
  try {
    const abilityResponse = await fetch(abilityUrl);
    if (abilityResponse.ok) {
      const abilityData = await abilityResponse.json();
      const englishEntry = abilityData.effect_entries.find(
        (entry) => entry.language.name === 'en'
      );
      if (englishEntry) {
        return englishEntry.effect;
      }
    }
  } catch (error) {
    console.error(`Error fetching ability description from ${abilityUrl}:`, error.message);
  }
  return 'No ability description available';
};

const selectPrimaryImage = (sprites) => {
  if (!sprites) return null;
  const candidates = [
    sprites.other?.['official-artwork']?.front_default,
    sprites.other?.home?.front_default,
    sprites.other?.dream_world?.front_default,
    sprites.front_default,
  ];
  return candidates.find(Boolean) || null;
};

const selectDistinctDetailImage = (primary, sprites) => {
  if (!sprites) return null;
  const candidates = [
    sprites.front_shiny,
    sprites.other?.home?.front_shiny,
    sprites.other?.['official-artwork']?.front_shiny,
    sprites.other?.showdown?.front_default,
    sprites.other?.showdown?.front_shiny,
    sprites.back_default,
    sprites.back_shiny,
    sprites.other?.dream_world?.front_default,
    sprites.front_default,
  ];
  return candidates.find((url) => url && url !== primary) || null;
};

// Fetch Pokemon data from PokeAPI
const fetchPokemonData = async (pokemonName) => {
  try {
    const normalizedInput = (pokemonName || '').trim().toLowerCase();
    if (!normalizedInput) {
      console.warn('fetchPokemonData called without a valid pokemon name');
      return null;
    }
    const baseName = normalizedInput;
    
    // List of form suffixes to try
    const formSuffixes = ['', '-incarnate', '-altered', '-therian', '-origin', '-ordinary', '-land', '-sky'];
    
    let response = null;
    let data = null;
    
    // Try different name variations
    for (const suffix of formSuffixes) {
      const fullName = baseName + suffix;
      try {
        response = await fetch(`https://pokeapi.co/api/v2/pokemon/${fullName}`);
        if (response.ok) {
          data = await response.json();
          break; // Found it!
        }
      } catch (err) {
        // Continue to next variation
        continue;
      }
    }
    
    // If still not found, try searching by species
    if (!data) {
      try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${baseName}`);
        if (speciesResponse.ok) {
          const speciesData = await speciesResponse.json();
          // Get the first variety (default form)
          if (speciesData.varieties && speciesData.varieties.length > 0) {
            const defaultForm = speciesData.varieties.find(v => v.is_default) || speciesData.varieties[0];
            const pokemonResponse = await fetch(defaultForm.pokemon.url);
            if (pokemonResponse.ok) {
              data = await pokemonResponse.json();
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching species for ${pokemonName}:`, err.message);
      }
    }
    
    if (!data) {
      console.error(`Pokemon ${pokemonName} not found after trying all variations`);
      return null;
    }
    
    // Get ability details (first available ability)
    const regularAbility = data.abilities.find(ab => !ab.is_hidden)?.ability || data.abilities[0]?.ability;
    const abilityDescription = regularAbility
      ? await fetchAbilityDescription(regularAbility.url)
      : 'No ability description available';

    const hiddenAbilityKey = data.name?.toLowerCase();
    const hiddenAbility = hiddenAbilityKey ? hiddenAbilities[hiddenAbilityKey] : undefined;

    // Get alternative forms if available
    const forms = [];
    if (data.forms && data.forms.length > 1) {
      for (const form of data.forms.slice(0, 3)) { // Limit to 3 forms
        try {
          const formResponse = await fetch(form.url);
          if (formResponse.ok) {
            const formData = await formResponse.json();
            forms.push({
              name: formData.name,
              imageUrl: formData.sprites?.front_default || data.sprites.front_default
            });
          }
        } catch (error) {
          console.error(`Error fetching form for ${pokemonName}:`, error);
        }
      }
    }

    const officialArtworkUrl = data.sprites.other?.['official-artwork']?.front_default || null;
    const primaryImageUrl = selectPrimaryImage(data.sprites);
    const detailImageUrl = selectDistinctDetailImage(primaryImageUrl, data.sprites);

    const result = {
      name: data.name,
      imageUrl: primaryImageUrl,
      alternativeImageUrl: detailImageUrl || primaryImageUrl,
      expandedImageUrl: detailImageUrl,
      officialArtworkUrl: officialArtworkUrl || primaryImageUrl,
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        spAttack: data.stats[3].base_stat,
        spDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat
      },
      ability: {
        name: regularAbility?.name || 'Unknown',
        description: abilityDescription
      },
      hiddenAbility,
      forms: forms.length > 0 ? forms : undefined
    };

    return result;
  } catch (error) {
    console.error(`Error fetching Pokemon ${pokemonName}:`, error.message);
    return null;
  }
};

// Get all quiz questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get a specific question with full Pokemon data
router.get('/question/:id', async (req, res) => {
  try {
    const question = await getQuestionById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Fetch Pokemon data for all Pokemon in the question
    const pokemonData = [];

    // Process exactly pokemon_count Pokemon, getting names directly from question object
    for (let pokemonIndex = 1; pokemonIndex <= question.pokemon_count; pokemonIndex++) {
      const rawName = question[`pokemon${pokemonIndex}_name`];
      const name = rawName ? rawName.trim() : rawName;
      
      if (!name) {
        // Add placeholder to maintain count
        pokemonData.push({
          name: `pokemon${pokemonIndex}`,
          originalName: null, // No original name if database name is missing
          imageUrl: null,
          alternativeImageUrl: null,
          stats: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
          ability: { name: 'Unknown', description: 'Data not available' },
          dialogue: question[`pokemon${pokemonIndex}_dialogue`] || '',
          resultType: question[`pokemon${pokemonIndex}_result_type`] || 'no'
        });
        continue;
      }
      
      try {
        const data = await fetchPokemonData(name);
        if (data) {
          const pokemonEntry = {
            ...data,
            originalName: name, // Store trimmed name for submission matching
            dialogue: question[`pokemon${pokemonIndex}_dialogue`] || '',
            resultType: question[`pokemon${pokemonIndex}_result_type`] || 'no'
          };

          pokemonData.push(pokemonEntry);
        } else {
          // Add placeholder so the index matches
          pokemonData.push({
            name: name,
            originalName: name,
            imageUrl: null,
            alternativeImageUrl: null,
            stats: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
            ability: { name: 'Unknown', description: 'Data not available' },
            dialogue: question[`pokemon${pokemonIndex}_dialogue`] || '',
            resultType: question[`pokemon${pokemonIndex}_result_type`] || 'no'
          });
        }
      } catch (error) {
        console.error(`Error fetching Pokemon ${pokemonIndex} (${name || 'unknown'}):`, error.message);
        // Add placeholder even on error
        pokemonData.push({
          name: name || `pokemon${pokemonIndex}`,
          originalName: name || null,
          imageUrl: null,
          alternativeImageUrl: null,
          stats: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
          ability: { name: 'Unknown', description: 'Data not available' },
          dialogue: question[`pokemon${pokemonIndex}_dialogue`] || '',
          resultType: question[`pokemon${pokemonIndex}_result_type`] || 'no'
        });
      }
    }
    // Safety net: Ensure we have the correct number of Pokemon
    if (pokemonData.length < question.pokemon_count) {
      for (let i = pokemonData.length; i < question.pokemon_count; i++) {
        const pokemonIndex = i + 1;
        const rawName = question[`pokemon${pokemonIndex}_name`];
        const name = rawName ? rawName.trim() : rawName;
        
        if (name) {
          pokemonData.push({
            name: name,
            originalName: name,
            imageUrl: null,
            alternativeImageUrl: null,
            stats: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
            ability: { name: 'Unknown', description: 'Data not available' },
            dialogue: question[`pokemon${pokemonIndex}_dialogue`] || '',
            resultType: question[`pokemon${pokemonIndex}_result_type`] || 'no'
          });
        }
      }
    }

    // Combine question data with Pokemon data
    const result = {
      id: question.id,
      categoryName: question.category_name,
      pokemonCount: question.pokemon_count,
      pokemon: pokemonData
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Submit answer
router.post('/submit', async (req, res) => {
  try {
    const { questionId, selectedPokemon } = req.body;

    if (!questionId || !selectedPokemon) {
      return res.status(400).json({ error: 'Missing questionId or selectedPokemon' });
    }

    // Normalize the selected Pokemon name (trim whitespace)
    const normalizedSelectedPokemon = selectedPokemon.trim();

    const question = await getQuestionById(questionId);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Find which Pokemon was selected and get its dialogue and result type
    // Handle form-specific names (e.g., "giratina-altered" should match "giratina")
    let dialogue = '';
    let resultType = '';
    
    // Normalize the selected Pokemon name by removing form suffixes
    const normalizeName = (name) => {
      if (!name) return '';
      const baseName = name.toLowerCase().trim();
      // Remove common form suffixes
      const formSuffixes = ['-incarnate', '-altered', '-therian', '-origin', '-ordinary', '-land', '-sky'];
      for (const suffix of formSuffixes) {
        if (baseName.endsWith(suffix)) {
          return baseName.slice(0, -suffix.length);
        }
      }
      return baseName;
    };
    
    // Normalize the selected Pokemon name
    const normalizedSelected = normalizeName(normalizedSelectedPokemon);
    const selectedLower = normalizedSelectedPokemon.toLowerCase();

    // Try to match the selected Pokemon with database entries
    for (let i = 1; i <= question.pokemon_count; i++) {
      const pokemonName = question[`pokemon${i}_name`];
      if (pokemonName) {
        const dbNameLower = pokemonName.toLowerCase().trim();
        const normalizedDbName = normalizeName(pokemonName);
        
        // Multiple matching strategies for robustness:
        // 1. Exact match (case-insensitive)
        // 2. Normalized match (handles form variations)
        // 3. Direct comparison of trimmed lowercase names
        if (normalizedDbName === normalizedSelected || 
            dbNameLower === selectedLower ||
            pokemonName.toLowerCase() === selectedPokemon.toLowerCase()) {
          dialogue = question[`pokemon${i}_dialogue`];
          resultType = question[`pokemon${i}_result_type`];
          break;
        }
      }
    }

    if (!dialogue || !resultType) {
      console.error(`Failed to find Pokemon "${selectedPokemon}" in question ${questionId}`);
      console.error(`Available Pokemon:`, Array.from({length: question.pokemon_count}, (_, i) => question[`pokemon${i+1}_name`]));
      return res.status(404).json({ error: 'Selected Pokemon not found in question' });
    }

    res.json({
      resultType,
      dialogue,
      selectedPokemon: normalizedSelectedPokemon
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

module.exports = router;


