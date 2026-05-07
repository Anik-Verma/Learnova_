export const SPECIMEN_DATA = {
  onion_peel: {
    name: 'Onion Peel (Allium cepa)',
    stain: 'Iodine Solution',
    category: 'plant',
    color: '#D2AF5A',
    description: 'Onion peel cells are a classic first specimen. They show clear cell walls and nuclei. Being plant cells they have cell walls but no chloroplasts.',
    lookFor: [
      'Rectangular cells arranged in regular rows',
      'Dark stained nucleus in each cell',
      'Thick cell wall at cell boundaries',
      'No chloroplasts (onion stores food not sunlight)'
    ],
    magnificationNotes: {
      10: 'Wait for 40x for better detail.',
      40: 'See the overall regular pattern of cells',
      100: 'Individual cells and nuclei become visible',
      400: 'Nucleus detail and cell wall thickness clear'
    }
  },
  cheek_cells: {
    name: 'Human Cheek Cells (Buccal Epithelium)',
    stain: 'Methylene Blue',
    category: 'animal',
    color: '#C8D7F5',
    description: 'Cells scraped from the inside of the cheek. These are animal cells so they have no cell wall, just a thin flexible membrane. The large nucleus is clearly visible.',
    lookFor: [
      'Irregular flat polygonal shape (no rigid wall)',
      'Large prominent nucleus stained dark blue',
      'No cell wall unlike plant cells',
      'Cells scattered not in neat rows'
    ],
    magnificationNotes: {
      10: 'Blue shapes appearing.',
      40: 'Scattered oval shapes visible',
      100: 'Cell boundary and nucleus clearly seen',
      400: 'Nucleus details and membrane outline visible'
    }
  },
  cork_cells: {
    name: 'Cork Cells (Quercus suber)',
    stain: 'Unstained',
    category: 'plant',
    color: '#EBDCb9',
    description: 'Robert Hooke observed cork cells in 1665 and named them "cells" because they reminded him of monks\' rooms (cellulae). These are dead cells with empty interiors.',
    lookFor: [
      'Regular hexagonal honeycomb pattern',
      'Empty interiors (cells are dead)',
      'Thick dark cell walls',
      'No nucleus or cytoplasm (dead cells)'
    ],
    magnificationNotes: {
      10: 'Low detail grid.',
      40: 'Honeycomb pattern clearly visible',
      100: 'Individual empty cells distinct',
      400: 'Cell wall thickness and texture visible'
    }
  },
  elodea: {
    name: 'Elodea Leaf (Water Plant)',
    stain: 'Unstained (naturally green)',
    category: 'plant',
    color: '#B9E1AA',
    description: 'Elodea is an aquatic plant used to demonstrate chloroplasts. The chloroplasts can actually be seen moving within living cells (cytoplasmic streaming).',
    lookFor: [
      'Green oval chloroplasts inside cells',
      'Multiple chloroplasts per cell',
      'Large central vacuole (clear area)',
      'Cell wall and cell membrane'
    ],
    magnificationNotes: {
      10: 'Green tint visible.',
      40: 'Green cells in neat rectangular rows',
      100: 'Chloroplasts visible as green dots',
      400: 'Individual oval chloroplasts clearly visible'
    }
  },
  epithelial: {
    name: 'Simple Squamous Epithelium',
    stain: 'Haematoxylin and Eosin (H&E)',
    category: 'animal',
    color: '#FFD0D0',
    description: 'Epithelial tissue forms the lining of body surfaces. Simple squamous epithelium is a single layer of flat cells. It lines blood vessels, air sacs of lungs and body cavities.',
    lookFor: [
      'Single layer of flat (squamous) cells',
      'Cells tightly packed with no gaps',
      'Flat oval nucleus in center of each cell',
      'Very thin cells (scale-like)'
    ],
    magnificationNotes: {
      10: 'Thin pink layer.',
      40: 'Uniform layer of cells visible',
      100: 'Individual cells and nuclei seen',
      400: 'Cell boundary detail and flat nuclei visible'
    }
  },
  muscular: {
    name: 'Striated (Skeletal) Muscle Tissue',
    stain: 'Haematoxylin and Eosin (H&E)',
    category: 'animal',
    color: '#FFD2D2',
    description: 'Skeletal muscle tissue is responsible for voluntary movement. The characteristic striations (bands) are caused by the arrangement of actin and myosin protein filaments.',
    lookFor: [
      'Long cylindrical parallel fibres',
      'Alternating dark and light bands (striations)',
      'Multiple nuclei at the edge of each fibre',
      'No cell boundaries between nuclei'
    ],
    magnificationNotes: {
      10: 'Red bundles visible.',
      40: 'Parallel fibre arrangement visible',
      100: 'Striations (banding pattern) appears',
      400: 'Individual bands and peripheral nuclei clear'
    }
  },
  connective: {
    name: 'Loose Connective Tissue (Areolar)',
    stain: 'Haematoxylin and Eosin (H&E)',
    category: 'animal',
    color: '#FFF0E1',
    description: 'Connective tissue binds and supports other tissues. Areolar tissue is the most widely distributed connective tissue. It contains cells scattered in a matrix of fibres.',
    lookFor: [
      'Fibres criss-crossing in all directions',
      'Cells scattered not in contact',
      'Two types of fibres: collagen and elastic',
      'Large spaces between fibres and cells'
    ],
    magnificationNotes: {
      10: 'Fibre mesh visible.',
      40: 'Open mesh of fibres visible',
      100: 'Individual fibre types distinguishable',
      400: 'Cell details and fibre structure visible'
    }
  },
  nervous: {
    name: 'Nervous Tissue (Cerebral Cortex)',
    stain: 'Silver stain (Golgi method)',
    category: 'animal',
    color: '#F0EBD7',
    description: 'Nervous tissue is specialized for transmitting electrical signals. Neurons are the largest cells in the body. The long axons can extend over a metre in length.',
    lookFor: [
      'Large cell bodies with prominent nucleus',
      'Multiple short dendrites branching from body',
      'One long axon extending from cell body',
      'Small neuroglia cells between neurons'
    ],
    magnificationNotes: {
      10: 'Purple dark spots.',
      40: 'Large neuron cell bodies visible',
      100: 'Cell body and main processes seen',
      400: 'Nucleus detail and axon hillock visible'
    }
  },
  xylem: {
    name: 'Xylem Tissue (Sunflower Stem)',
    stain: 'Safranin (stains lignin red)',
    category: 'plant',
    color: '#FFCEC8',
    description: 'Xylem transports water and minerals from roots to leaves. It is made of dead cells with thick lignified walls. The vessels form hollow tubes for water transport.',
    lookFor: [
      'Wide hollow tubes (xylem vessels)',
      'Thick red-stained walls (lignin)',
      'Spiral or ring thickenings on walls',
      'Dead cells with no living contents'
    ],
    magnificationNotes: {
      10: 'Brown tubes visible.',
      40: 'Wide and narrow cell types visible',
      100: 'Wall thickenings become visible',
      400: 'Spiral pattern of wall thickening clear'
    }
  },
  phloem: {
    name: 'Phloem Tissue (Sunflower Stem)',
    stain: 'Fast Green (stains cellulose)',
    category: 'plant',
    color: '#D2EBD2',
    description: 'Phloem transports food (sugars) made in leaves to all parts of plant. Sieve tubes have perforated end walls (sieve plates) that allow food to flow through.',
    lookFor: [
      'Sieve tube cells (large, with thin walls)',
      'Companion cells (smaller, beside sieve tubes)',
      'Sieve plates at ends of sieve tube cells',
      'Pores visible in sieve plates at high magnification'
    ],
    magnificationNotes: {
      10: 'Green vessel lines.',
      40: 'Two cell types side by side visible',
      100: 'Sieve plates at cell ends visible',
      400: 'Individual pores in sieve plates visible'
    }
  }
};
