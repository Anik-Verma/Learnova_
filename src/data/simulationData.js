export const SIMULATIONS = {

  Motion_9: {
    topicName: 'Motion',
    subject: 'physics',
    standard: 9,
    experiments: [
      {
        id: 'motion_graphs',
        title: 'Motion Graphs Explorer',
        description: 'Visualize how distance and velocity change over time for different types of motion',
        duration: '15 mins',
        difficulty: 'Easy',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/forces-motion.html',
        fallbackUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html',
        learningGoals: [
          'Understand the difference between distance and displacement',
          'Read and interpret distance-time graphs',
          'Read and interpret velocity-time graphs',
          'Identify uniform and non-uniform motion from graphs'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Start the Simulation',
            instruction: 'Click the Play button. Watch the man walk along the number line.',
            checkPoint: 'Can you see the position changing on the graph?'
          },
          {
            step: 2,
            title: 'Observe Uniform Motion',
            instruction: 'Set velocity to a constant value using the slider. Watch the distance-time graph.',
            checkPoint: 'Is the graph a straight line? This means uniform motion!'
          },
          {
            step: 3,
            title: 'Try Accelerating Motion',
            instruction: 'Change the acceleration slider. Watch how the velocity-time graph changes.',
            checkPoint: 'What shape does the distance-time graph make when accelerating?'
          },
          {
            step: 4,
            title: 'Record Your Observations',
            instruction: 'Note down: What does a steeper slope on the distance-time graph mean?',
            checkPoint: 'Write your answer in the observations box below.'
          }
        ],
        observationTemplate: 'Uniform motion graph shape: ___\nAccelerating motion graph shape: ___\nSteeper slope means: ___'
      },
      {
        id: 'forces_motion',
        title: 'Forces and Motion',
        description: 'Apply forces to objects and observe how they move — explore Newton\'s Laws in action',
        duration: '20 mins',
        difficulty: 'Medium',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/forces-motion.html',
        learningGoals: [
          'Understand how force affects motion',
          'See how friction opposes motion',
          'Observe Newton\'s Second Law: F = ma'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Apply a Force',
            instruction: 'Drag the arrow to apply force to the cart. Observe it accelerate.',
            checkPoint: 'Does more force = more acceleration?'
          },
          {
            step: 2,
            title: 'Add Friction',
            instruction: 'Turn on friction using the checkbox. Try pushing the cart again.',
            checkPoint: 'How does friction change the motion?'
          },
          {
            step: 3,
            title: 'Change Mass',
            instruction: 'Add people to the cart to increase mass. Apply the same force.',
            checkPoint: 'With more mass, does the same force cause more or less acceleration?'
          }
        ],
        observationTemplate: 'Force applied: ___ N\nAcceleration observed: ___\nEffect of friction: ___\nEffect of more mass: ___'
      }
    ]
  },

  Laws_of_Motion_9: {
    topicName: 'Laws of Motion',
    subject: 'physics',
    standard: 9,
    experiments: [
      {
        id: 'forces_basics',
        title: 'Newton\'s Laws Interactive',
        description: 'Experience all three of Newton\'s Laws through hands-on simulation',
        duration: '25 mins',
        difficulty: 'Medium',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/forces-motion.html',
        learningGoals: [
          'Demonstrate Newton\'s First Law — inertia',
          'Calculate using Newton\'s Second Law — F=ma',
          'Observe Newton\'s Third Law — action-reaction pairs'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'First Law — Inertia',
            instruction: 'Give the cart a push then remove the force. What happens?',
            checkPoint: 'Does the cart keep moving? This is inertia!'
          },
          {
            step: 2,
            title: 'Second Law — F = ma',
            instruction: 'Note the force, note the mass, calculate expected acceleration.',
            checkPoint: 'Does a = F/m match what you observe?'
          },
          {
            step: 3,
            title: 'Third Law — Action Reaction',
            instruction: 'Switch to the Tug of War screen. Pull the rope.',
            checkPoint: 'Can you see both teams experiencing forces?'
          }
        ],
        observationTemplate: 'First Law observation: ___\nForce = ___ N, Mass = ___ kg\nCalculated a = ___ m/s²\nObserved a = ___ m/s²'
      },
      {
        id: 'friction_sim',
        title: 'Friction Explorer',
        description: 'Discover how friction works between different surfaces',
        duration: '15 mins',
        difficulty: 'Easy',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/friction.html',
        learningGoals: [
          'Understand static and kinetic friction',
          'See how surface texture affects friction',
          'Observe heat generated by friction'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Rub the Surfaces',
            instruction: 'Drag one surface across the other. Watch what happens.',
            checkPoint: 'Can you see atoms being transferred?'
          },
          {
            step: 2,
            title: 'Feel the Heat',
            instruction: 'Rub faster. Watch the thermometer.',
            checkPoint: 'Does more rubbing = more heat?'
          }
        ],
        observationTemplate: 'Friction observation: ___\nHeat generated when: ___'
      }
    ]
  },

  Gravitation_9: {
    topicName: 'Gravitation',
    subject: 'physics',
    standard: 9,
    experiments: [
      {
        id: 'gravity_orbits',
        title: 'Gravity and Orbits',
        description: 'Control gravity to understand how planets orbit the Sun',
        duration: '20 mins',
        difficulty: 'Medium',
        type: 'iframe',
        fullscreen: true,
        url: '/sims/gravity-orbits.html',
        learningGoals: [
          'Understand gravitational force between masses',
          'See how distance affects gravitational force',
          'Observe orbital mechanics'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Observe the Orbit',
            instruction: 'Click Play and watch Earth orbit the Sun. Check "Show Gravity Force".',
            checkPoint: 'Which direction does the gravity arrow point?'
          },
          {
            step: 2,
            title: 'Change the Distance',
            instruction: 'Drag Earth closer to the Sun. Watch the force arrow change.',
            checkPoint: 'Does gravity get stronger or weaker when closer?'
          },
          {
            step: 3,
            title: 'Remove Gravity',
            instruction: 'Set gravity to zero. What happens to Earth?',
            checkPoint: 'Does Earth keep moving in a straight line?'
          }
        ],
        observationTemplate: 'Gravity direction: ___\nWhen distance decreases, force: ___\nWithout gravity, Earth: ___'
      },
      {
        id: 'gravity_force_lab',
        title: 'Gravity Force Lab',
        description: 'Measure gravitational force between two objects',
        duration: '15 mins',
        difficulty: 'Hard',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/gravity-force.html',
        learningGoals: [
          'Verify the Universal Law of Gravitation',
          'See how mass and distance affect gravitational force',
          'Calculate F = Gm₁m₂/r²'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Read the Force',
            instruction: 'Note the gravitational force shown between the two masses.',
            checkPoint: 'Write down the force value shown.'
          },
          {
            step: 2,
            title: 'Double a Mass',
            instruction: 'Double the mass of one object. How does force change?',
            checkPoint: 'Did force double too? This confirms F ∝ m'
          },
          {
            step: 3,
            title: 'Double the Distance',
            instruction: 'Move objects twice as far apart. How does force change?',
            checkPoint: 'Force became 1/4 of original? This confirms F ∝ 1/r²'
          }
        ],
        observationTemplate: 'Initial force: ___ N\nAfter doubling mass: ___ N\nAfter doubling distance: ___ N\nConclusion: ___'
      }
    ]
  },

  Matter_9: {
    topicName: 'Matter in Our Surroundings',
    subject: 'chemistry',
    standard: 9,
    experiments: [
      {
        id: 'states_matter',
        title: 'States of Matter',
        description: 'Watch particles change state as you heat and cool substances',
        duration: '20 mins',
        difficulty: 'Easy',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/states-matter.html',
        learningGoals: [
          'Observe particle arrangement in solid liquid and gas',
          'Understand melting and boiling points',
          'See latent heat effect on temperature graph'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Observe Solid State',
            instruction: 'Keep temperature low. Watch how particles are arranged.',
            checkPoint: 'Are particles close together and vibrating in place?'
          },
          {
            step: 2,
            title: 'Heat to Melting',
            instruction: 'Slowly increase temperature. Watch the temperature graph.',
            checkPoint: 'Does the temperature pause during melting? This is latent heat!'
          },
          {
            step: 3,
            title: 'Continue to Gas',
            instruction: 'Keep heating until particles become gas.',
            checkPoint: 'How do gas particles move compared to solid?'
          }
        ],
        observationTemplate: 'Solid: particles ___\nLiquid: particles ___\nGas: particles ___\nLatent heat observation: ___'
      }
    ]
  },

  Atoms_Molecules_9: {
    topicName: 'Atoms and Molecules',
    subject: 'chemistry',
    standard: 9,
    experiments: [
      {
        id: 'build_molecule',
        title: 'Build a Molecule',
        description: 'Combine atoms to build real molecules and learn their formulas',
        duration: '20 mins',
        difficulty: 'Medium',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/build-molecule.html',
        learningGoals: [
          'Build water H₂O by combining atoms',
          'Understand chemical formulas',
          'Learn about valency through bonding'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Build Water',
            instruction: 'Drag 2 Hydrogen atoms and 1 Oxygen atom together to form water.',
            checkPoint: 'Did the molecule snap together? What is its formula?'
          },
          {
            step: 2,
            title: 'Build CO₂',
            instruction: 'Now build Carbon Dioxide using 1 Carbon and 2 Oxygen atoms.',
            checkPoint: 'What shape does CO₂ have?'
          },
          {
            step: 3,
            title: 'Collect Molecules',
            instruction: 'Switch to the Collect tab and fill the collection boxes.',
            checkPoint: 'How many of each atom do you need?'
          }
        ],
        observationTemplate: 'Water formula: ___\nCO₂ formula: ___\nNH₃ formula: ___\nObservation about bonding: ___'
      }
    ]
  },

  Structure_Atoms_9: {
    topicName: 'Structure of Atoms',
    subject: 'chemistry',
    standard: 9,
    experiments: [
      {
        id: 'build_atom',
        title: 'Build an Atom',
        description: 'Add protons neutrons and electrons to build any element',
        duration: '25 mins',
        difficulty: 'Medium',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/build-atom.html',
        learningGoals: [
          'Understand atomic number = number of protons',
          'Learn electron shell filling rules',
          'Discover how valency relates to outer electrons'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Build Hydrogen',
            instruction: 'Add exactly 1 proton to the nucleus. Add 1 electron to shell 1.',
            checkPoint: 'Does the element name show Hydrogen?'
          },
          {
            step: 2,
            title: 'Build Carbon',
            instruction: 'Add 6 protons, 6 neutrons. Fill electrons: 2 in shell 1, 4 in shell 2.',
            checkPoint: 'What is Carbon\'s valency based on outer shell electrons?'
          },
          {
            step: 3,
            title: 'Build Sodium',
            instruction: 'Add 11 protons, 12 neutrons. Fill 3 shells: 2, 8, 1.',
            checkPoint: 'Why does Sodium have valency 1?'
          },
          {
            step: 4,
            title: 'Switch to Game Mode',
            instruction: 'Click Game tab and try the element identification challenges.',
            checkPoint: 'Can you identify elements from their atomic structure?'
          }
        ],
        observationTemplate: 'Hydrogen: protons=___ electrons=___ valency=___\nCarbon: config=___ valency=___\nSodium: config=___ valency=___'
      },
      {
        id: 'isotopes',
        title: 'Isotopes and Atomic Mass',
        description: 'Explore isotopes and understand why atomic masses are decimals',
        duration: '15 mins',
        difficulty: 'Hard',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/isotopes.html',
        learningGoals: [
          'Understand what isotopes are',
          'Learn how atomic mass is calculated',
          'See natural abundance of isotopes'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Find Isotopes of Hydrogen',
            instruction: 'Select Hydrogen. Add different numbers of neutrons.',
            checkPoint: 'What are the 3 isotopes of Hydrogen called?'
          },
          {
            step: 2,
            title: 'Check Abundance',
            instruction: 'Switch to the Mix of Isotopes tab for Carbon.',
            checkPoint: 'Which Carbon isotope is most common?'
          }
        ],
        observationTemplate: 'Hydrogen isotopes: ___\nCarbon-12 abundance: ___\nCarbon-14 abundance: ___'
      }
    ]
  },

  Cells_9: {
    topicName: 'Fundamental Unit of Life',
    subject: 'biology',
    standard: 9,
    experiments: [
      {
        id: 'virtual_microscope_cell',
        title: 'Virtual Microscope — Cell Study',
        description: 'Use a real virtual microscope to observe plant and animal cells',
        duration: '20 mins',
        difficulty: 'Easy',
        type: 'custom',
        component: 'VirtualMicroscope',
        props: { mode: 'cells' },
        learningGoals: [
          'Learn how to use a microscope',
          'Observe real cell structures',
          'Compare plant and animal cells'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Set Up the Microscope',
            instruction: 'Select a slide from the tray. Turn on the light. Focus using the knobs.',
            checkPoint: 'Can you see cells clearly?'
          },
          {
            step: 2,
            title: 'Increase Magnification',
            instruction: 'Switch to a higher magnification objective lens.',
            checkPoint: 'What new details can you see at higher magnification?'
          },
          {
            step: 3,
            title: 'Identify Cell Parts',
            instruction: 'Look for: cell wall, nucleus, cytoplasm, cell membrane.',
            checkPoint: 'Can you identify the nucleus in each cell?'
          }
        ],
        observationTemplate: 'Magnification used: ___x\nCell parts visible: ___\nDifference from animal cell: ___'
      },
      {
        id: 'cell_organelles_custom',
        title: 'Cell Organelle Explorer',
        description: 'Click on each organelle to discover its structure and function',
        duration: '15 mins',
        difficulty: 'Easy',
        type: 'custom',
        component: 'CellOrganelleExplorer',
        fullscreen: false,
        learningGoals: [
          'Identify all major cell organelles',
          'Learn the function of each organelle',
          'Compare plant and animal cell organelles'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Explore Animal Cell',
            instruction: 'Click on each glowing organelle to learn about it.',
            checkPoint: 'Have you clicked on at least 5 organelles?'
          },
          {
            step: 2,
            title: 'Switch to Plant Cell',
            instruction: 'Toggle to Plant Cell. Find the organelles unique to plants.',
            checkPoint: 'Which 3 organelles are found in plants but not animals?'
          }
        ],
        observationTemplate: 'Nucleus function: ___\nMitochondria function: ___\nPlant-only organelles: ___'
      }
    ]
  },

  Tissues_9: {
    topicName: 'Tissues',
    subject: 'biology',
    standard: 9,
    experiments: [
      {
        id: 'virtual_microscope_tissue',
        title: 'Virtual Microscope — Tissue Study',
        description: 'Observe different types of plant and animal tissues under the microscope',
        duration: '25 mins',
        difficulty: 'Medium',
        type: 'custom',
        component: 'VirtualMicroscope',
        props: { mode: 'tissues' },
        learningGoals: [
          'Identify epithelial muscular connective and nervous tissue',
          'Observe plant tissues — meristematic and permanent',
          'Understand how cell structure relates to tissue function'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Observe Epithelial Tissue',
            instruction: 'Select the epithelial tissue slide. Focus at 40x magnification.',
            checkPoint: 'Are cells tightly packed? Why would this be useful for lining organs?'
          },
          {
            step: 2,
            title: 'Observe Muscular Tissue',
            instruction: 'Switch to muscular tissue slide. Look for striations.',
            checkPoint: 'Can you see the striped pattern? These help muscles contract.'
          },
          {
            step: 3,
            title: 'Observe Nervous Tissue',
            instruction: 'Select nervous tissue. Find the large cell bodies with branches.',
            checkPoint: 'Can you identify the cell body and axon of a neuron?'
          }
        ],
        observationTemplate: 'Epithelial tissue: cells are ___\nMuscular tissue: I can see ___\nNervous tissue: special features ___'
      }
    ]
  },

  Light_10: {
    topicName: 'Light — Reflection and Refraction',
    subject: 'physics',
    standard: 10,
    experiments: [
      {
        id: 'bending_light',
        title: 'Bending Light — Refraction Lab',
        description: 'Shoot a laser beam through different materials and observe refraction',
        duration: '20 mins',
        difficulty: 'Medium',
        type: 'iframe',
        fullscreen: true,
        url: '/sims/bending-light.html',
        learningGoals: [
          'Verify laws of reflection',
          'Observe refraction at different angles',
          'Discover total internal reflection',
          'Measure refractive index'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Verify Reflection Law',
            instruction: 'Shine the laser at the mirror. Measure angle of incidence and reflection.',
            checkPoint: 'Are both angles equal? This is the law of reflection!'
          },
          {
            step: 2,
            title: 'Observe Refraction',
            instruction: 'Switch to two materials. Shine laser from air into glass.',
            checkPoint: 'Does the ray bend toward or away from the normal?'
          },
          {
            step: 3,
            title: 'Find Critical Angle',
            instruction: 'Shine laser from glass to air. Slowly increase angle.',
            checkPoint: 'At what angle does total internal reflection occur?'
          },
          {
            step: 4,
            title: 'Use the Prism',
            instruction: 'Switch to prism tab. Shine white light through the prism.',
            checkPoint: 'What colors do you see? This is dispersion!'
          }
        ],
        observationTemplate: 'Angle of incidence: ___°\nAngle of reflection: ___°\nAngle of refraction: ___°\nCritical angle: ___°\nColors of spectrum: ___'
      },
      {
        id: 'geometric_optics',
        title: 'Geometric Optics — Lens and Mirror Lab',
        description: 'Form images using concave and convex lenses and mirrors',
        duration: '25 mins',
        difficulty: 'Hard',
        type: 'iframe',
        fullscreen: true,
        url: '/sims/geometric-optics.html',
        learningGoals: [
          'Form images using convex and concave lenses',
          'Apply the lens formula: 1/v + 1/u = 1/f',
          'Determine image nature: real/virtual, inverted/erect'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Object Beyond 2F',
            instruction: 'Place object beyond 2F from convex lens. Find image position.',
            checkPoint: 'Is image real or virtual? Inverted or erect? Magnified or diminished?'
          },
          {
            step: 2,
            title: 'Apply Lens Formula',
            instruction: 'Measure u and f. Calculate v using 1/v = 1/f - 1/u.',
            checkPoint: 'Does your calculated v match where image formed?'
          },
          {
            step: 3,
            title: 'Object Between F and Lens',
            instruction: 'Move object between F and the lens.',
            checkPoint: 'Now is the image real or virtual?'
          },
          {
            step: 4,
            title: 'Switch to Concave Lens',
            instruction: 'Change to concave lens. Where does image form now?',
            checkPoint: 'Can concave lens ever form a real image?'
          }
        ],
        observationTemplate: 'u = ___ cm, f = ___ cm\nCalculated v = ___ cm\nActual v = ___ cm\nImage nature: ___'
      }
    ]
  },

  Human_Eye_10: {
    topicName: 'Human Eye and Colourful World',
    subject: 'physics',
    standard: 10,
    experiments: [
      {
        id: 'color_vision',
        title: 'Color Vision Lab',
        description: 'Explore how the human eye perceives color and light',
        duration: '15 mins',
        difficulty: 'Easy',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/color-vision.html',
        learningGoals: [
          'Understand how RGB colors combine',
          'Learn how the eye perceives different wavelengths',
          'See why mixing colored light differs from mixing paint'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Mix Primary Colors',
            instruction: 'Turn on Red and Green lights. What color do you see?',
            checkPoint: 'Red + Green = ___? Surprised?'
          },
          {
            step: 2,
            title: 'Make White Light',
            instruction: 'Turn on all three colors at full intensity.',
            checkPoint: 'Can you make white light from colored light?'
          },
          {
            step: 3,
            title: 'Switch to Single Bulb',
            instruction: 'Use the single bulb tab. Shine white light through filters.',
            checkPoint: 'What does a red filter do to white light?'
          }
        ],
        observationTemplate: 'Red + Green = ___\nRed + Blue = ___\nGreen + Blue = ___\nAll three = ___'
      },
      {
        id: 'eye_defects_custom',
        title: 'Eye Defects Corrector',
        description: 'See how myopia and hypermetropia form and how lenses correct them',
        duration: '15 mins',
        difficulty: 'Medium',
        type: 'custom',
        component: 'EyeDefectsSimulator',
        fullscreen: false,
        learningGoals: [
          'Understand how myopia forms',
          'Understand how hypermetropia forms',
          'See how corrective lenses work'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Normal Vision',
            instruction: 'Observe how light focuses exactly on the retina in normal eye.',
            checkPoint: 'Where does the focal point land?'
          },
          {
            step: 2,
            title: 'Myopia',
            instruction: 'Switch to myopic eye. See where light focuses.',
            checkPoint: 'Does light focus in front of or behind the retina?'
          },
          {
            step: 3,
            title: 'Apply Correction',
            instruction: 'Add the corrective lens. Watch focal point move to retina.',
            checkPoint: 'What type of lens corrects myopia — concave or convex?'
          }
        ],
        observationTemplate: 'Myopia: image forms ___ retina\nCorrected by: ___ lens\nHypermetropia: image forms ___ retina\nCorrected by: ___ lens'
      }
    ]
  },

  Acids_10: {
    topicName: 'Acids, Bases and Salts',
    subject: 'chemistry',
    standard: 10,
    experiments: [
      {
        id: 'ph_scale',
        title: 'pH Scale Interactive Lab',
        description: 'Test common substances and measure their pH using indicators',
        duration: '20 mins',
        difficulty: 'Easy',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/ph-scale.html',
        learningGoals: [
          'Understand the pH scale from 0-14',
          'Test common household substances',
          'See how pH relates to H⁺ ion concentration'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Test Common Liquids',
            instruction: 'Add lemon juice to the beaker. Read the pH meter.',
            checkPoint: 'Is lemon juice acidic or basic? What is its pH?'
          },
          {
            step: 2,
            title: 'Try a Base',
            instruction: 'Empty beaker. Add drain cleaner. Read pH.',
            checkPoint: 'What pH do strong bases have?'
          },
          {
            step: 3,
            title: 'Observe H⁺ Concentration',
            instruction: 'Check "Show H₃O⁺/OH⁻ counts". Compare acid vs base.',
            checkPoint: 'Which has more H⁺ ions — acid or base?'
          },
          {
            step: 4,
            title: 'Neutralisation',
            instruction: 'Add acid to a basic solution slowly. Watch pH change.',
            checkPoint: 'At what pH is neutralisation complete?'
          }
        ],
        observationTemplate: 'Lemon juice pH: ___\nBaking soda pH: ___\nBlood pH: ___\nNeutral pH: ___\nH⁺ in acid is: ___'
      },
      {
        id: 'acid_base_solutions',
        title: 'Acid-Base Solutions',
        description: 'Explore what makes acids and bases — see ionisation in water',
        duration: '20 mins',
        difficulty: 'Hard',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/acid-base.html',
        learningGoals: [
          'Understand strong vs weak acids',
          'See how acids ionise in water',
          'Test conductivity of different solutions'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Add Strong Acid',
            instruction: 'Select Hydrochloric Acid. Look at the particles in water.',
            checkPoint: 'How many H⁺ ions are present?'
          },
          {
            step: 2,
            title: 'Compare Weak Acid',
            instruction: 'Switch to Acetic Acid (weak). Compare H⁺ ion count.',
            checkPoint: 'Which has more H⁺ — HCl or CH₃COOH?'
          },
          {
            step: 3,
            title: 'Test Conductivity',
            instruction: 'Use the conductivity tester. Test strong and weak acid.',
            checkPoint: 'Which conducts electricity better and why?'
          }
        ],
        observationTemplate: 'Strong acid H⁺ count: ___\nWeak acid H⁺ count: ___\nConductivity comparison: ___\nConclusion: ___'
      }
    ]
  },

  Carbon_10: {
    topicName: 'Carbon and Its Compounds',
    subject: 'chemistry',
    standard: 10,
    experiments: [
      {
        id: 'molecule_shapes',
        title: 'Molecule Shapes — Carbon Bonding',
        description: 'Build carbon compounds and visualize their 3D molecular structure',
        duration: '20 mins',
        difficulty: 'Medium',
        type: 'iframe',
        fullscreen: false,
        url: '/sims/molecule-shapes.html',
        learningGoals: [
          'Understand covalent bonding in carbon',
          'Build methane ethane and ethene',
          'See the difference between single and double bonds'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Build Methane CH₄',
            instruction: 'Add Carbon center atom. Add 4 single bonds with Hydrogen.',
            checkPoint: 'What shape does methane make? Tetrahedral?'
          },
          {
            step: 2,
            title: 'Build Ethene C₂H₄',
            instruction: 'Switch to Real Molecules tab. Find Ethene.',
            checkPoint: 'Can you spot the double bond between carbons?'
          },
          {
            step: 3,
            title: 'Compare Ethane vs Ethene',
            instruction: 'Look at Ethane (single bond) vs Ethene (double bond).',
            checkPoint: 'How does the double bond change the molecule shape?'
          }
        ],
        observationTemplate: 'Methane shape: ___\nEthane bonds: ___\nEthene bonds: ___\nDouble bond observation: ___'
      }
    ]
  },

  Life_Processes_10: {
    topicName: 'Life Processes',
    subject: 'biology',
    standard: 10,
    experiments: [
      {
        id: 'photosynthesis_olabs',
        title: 'Photosynthesis — CO₂ Experiment',
        description: 'Prove CO₂ is needed for photosynthesis using the OLabs experiment',
        duration: '25 mins',
        difficulty: 'Medium',
        type: 'custom',
        component: 'PhotosynthesisSim',
        learningGoals: [
          'Prove CO₂ is essential for photosynthesis',
          'Observe starch production as evidence of photosynthesis',
          'Control variables in a scientific experiment'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Set Up Experiment',
            instruction: 'Follow the procedure tab to set up the potted plant experiment.',
            checkPoint: 'Have you read the theory section first?'
          },
          {
            step: 2,
            title: 'Run the Experiment',
            instruction: 'Perform the experiment steps using the simulation.',
            checkPoint: 'Which leaf had starch and which did not?'
          },
          {
            step: 3,
            title: 'Record Results',
            instruction: 'Note your observations about which conditions allowed photosynthesis.',
            checkPoint: 'What does the iodine test result tell you?'
          }
        ],
        observationTemplate: 'Leaf with CO₂: iodine test = ___\nLeaf without CO₂: iodine test = ___\nConclusion: CO₂ is ___ for photosynthesis'
      },
      {
        id: 'circulation_custom',
        title: 'Blood Circulation Model',
        description: 'Follow blood through the heart and understand double circulation',
        duration: '15 mins',
        difficulty: 'Medium',
        type: 'custom',
        component: 'CirculationSimulator',
        fullscreen: false,
        learningGoals: [
          'Understand pulmonary and systemic circulation',
          'Learn the path of blood through the heart',
          'Distinguish oxygenated and deoxygenated blood'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Follow Deoxygenated Blood',
            instruction: 'Click the blue blood path. Follow it from body to lungs.',
            checkPoint: 'Which chambers does deoxygenated blood pass through?'
          },
          {
            step: 2,
            title: 'Follow Oxygenated Blood',
            instruction: 'Click the red blood path. Follow it from lungs to body.',
            checkPoint: 'What happens to blood in the lungs?'
          }
        ],
        observationTemplate: 'Deoxygenated path: ___\nOxygenated path: ___\nWhy is it called double circulation: ___'
      }
    ]
  },

  Control_10: {
    topicName: 'Control and Coordination',
    subject: 'biology',
    standard: 10,
    experiments: [
      {
        id: 'neuron_signal_custom',
        title: 'Neuron Signal Transmission',
        description: 'Fire a signal through a neuron and observe synaptic transmission',
        duration: '15 mins',
        difficulty: 'Medium',
        type: 'custom',
        component: 'NeuronSignalSim',
        fullscreen: false,
        learningGoals: [
          'Understand how electrical signals travel through neurons',
          'See what happens at a synapse',
          'Learn about neurotransmitters'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Fire the Signal',
            instruction: 'Click "Fire Signal" button. Watch the signal travel.',
            checkPoint: 'Which direction does the signal travel?'
          },
          {
            step: 2,
            title: 'Observe the Synapse',
            instruction: 'Use slow motion to see what happens at the synapse.',
            checkPoint: 'What crosses the synaptic gap?'
          },
          {
            step: 3,
            title: 'Trace the Reflex Arc',
            instruction: 'Switch to Reflex Arc mode. Touch the flame.',
            checkPoint: 'Does the signal go to the brain or spinal cord first?'
          }
        ],
        observationTemplate: 'Signal travels from: ___\nAt synapse: ___\nReflex arc bypasses: ___'
      },
      {
        id: 'hormones_custom',
        title: 'Endocrine System Explorer',
        description: 'Discover hormones secreted by each gland and their effects',
        duration: '15 mins',
        difficulty: 'Easy',
        type: 'custom',
        component: 'HormoneExplorer',
        fullscreen: false,
        learningGoals: [
          'Identify major endocrine glands',
          'Learn hormones secreted by each gland',
          'Understand feedback mechanisms'
        ],
        guidedSteps: [
          {
            step: 1,
            title: 'Explore Glands',
            instruction: 'Click each glowing gland on the body diagram.',
            checkPoint: 'Which gland is called the master gland?'
          },
          {
            step: 2,
            title: 'Trigger Adrenaline',
            instruction: 'Click the stress trigger. Watch adrenaline release.',
            checkPoint: 'What changes in the body when adrenaline is released?'
          }
        ],
        observationTemplate: 'Master gland: ___\nInsulin secreted by: ___\nAdrenaline effects: ___'
      }
    ]
  }
}

export const getSimulationsForTopic = (topicId) => {
  return SIMULATIONS[topicId] || null
}

export const SUBJECT_ACCENT = {
  physics: '#00d4ff',
  chemistry: '#ffdd4c',
  biology: '#39ff14'
}
