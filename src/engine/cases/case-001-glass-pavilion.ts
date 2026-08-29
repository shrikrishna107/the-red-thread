import { CaseBible } from "../schema";

export const CASE_001_GLASS_PAVILION: CaseBible = {
  case_id: "case-001-glass-pavilion",
  case_number: "CASE #001",
  title: "The Drowning of Lilly Mehra",
  subtitle: "Cold water, old secrets, and a locked audit at the Glass Pavilion",
  difficulty: "Medium",
  setting: {
    estate_name: "The Glass Pavilion, Blackwood Ridge",
    location_description: "A modernist cliffside estate of tinted glass and dark slate, surrounded by coastal pine and pounding rain.",
    weather: "Heavy coastal rainstorm, thunder, wind gusts up to 45 mph",
    time_of_discovery: "9:18 PM, October 24",
    atmosphere: "Rain lashing against double-height glass panels. The halogen pool lights cast an eerie cyan glow onto the wet flagstones. Inside, jazz still hums softly from the living room sound system."
  },
  victim: {
    victim_id: "victim-lilly",
    name: "Lilly Mehra",
    age: 32,
    occupation: "CEO & Co-Founder, Mehra Biologics",
    background: "Brilliant, uncompromising biotech entrepreneur. She was hours away from submitting a forensic accounting audit to federal regulators and her board.",
    last_seen: "8:40 PM arguing with Daniel in the conservatory; last seen walking toward the outdoor covered pool colonnade at 8:50 PM."
  },
  truth: {
    killer_id: "suspect-cam",
    killer_name: "Cam Sterling",
    motive_category: "greed",
    motive_details: "Cam systematically embezzled $4.2 million from Mehra Biologics research grants into offshore shell accounts. Lilly discovered the ledger anomalies and gave him an ultimatum: sign a full confession and step down before tomorrow's 9:00 AM board audit, or face federal indictment.",
    method: "Confronted Lilly at the pool gazebo at 8:52 PM. When she refused his bribe, he seized the heavy bronze estate paperweight from the outdoor console table, struck her across the back of the head, and pushed her unconscious body into the pool where she drowned at 8:56 PM. He wiped the weapon and placed it on the study bookshelf, then entered the wine cellar at 9:04 PM to fabricate an alibi with Rebecca.",
    weapon_id: "evidence_paperweight",
    weapon_name: "Heavy Bronze Estate Paperweight",
    cause_of_death: "Asphyxiation due to freshwater drowning, preceded by blunt force craniocerebral trauma",
    murder_location: "Poolside Gazebo / Shallow End of the Infinity Pool",
    murder_timestamp: "8:56 PM",
    body_disposal: "Submerged in the illuminated infinity pool",
    complete_narrative: "On the night of October 24 during an intimate gathering celebrating patent approvals, Lilly confronted Daniel at 8:40 PM about his secret affair with Maya. Daniel stormed out and left the estate at 8:48 PM. Cam Sterling followed Lilly to the pool gazebo at 8:52 PM, pleading with her not to submit the audit files. When Lilly called him a thief and turned to walk away, Cam struck her with the bronze paperweight from the side table. As she fell limp into the poolside, he pushed her into the water to simulate an accidental fall or drowning. He rushed through the side terrace into the study, cleaned the paperweight with a bar towel, and hurried down to the wine cellar at 9:04 PM, pretending he had been browsing vintages with Rebecca Cole."
  },
  solution_criteria: {
    required_killer_id: "suspect-cam",
    accepted_motive_keywords: ["embezzle", "audit", "fraud", "money", "4.2", "steal", "financial", "grant", "offshore"],
    accepted_weapon_ids: ["evidence_paperweight"],
    accepted_timeline_events: ["event_murder_attack", "event_cam_cellar"],
    critical_evidence_ids: ["evidence_paperweight", "evidence_usb_audit", "evidence_wet_footprints", "evidence_rebecca_log"],
    key_contradictions: [
      "Cam claims he was in the wine cellar from 8:45 PM onwards, but Rebecca's log and testimony prove he only arrived at 9:04 PM out of breath.",
      "Cam claims he never left the heated indoor rooms, but chlorinated damp tracks lead from the pool directly into the study bookshelf where the paperweight sits."
    ]
  },
  relationships: [
    {
      source_character_id: "suspect-cam",
      target_character_id: "victim-lilly",
      relation_type: "Business Partner & Co-Founder",
      public_status: "Close collegiate corporate allies",
      hidden_truth: "Bitter confrontation over Cam's $4.2M grant fraud; Lilly gave him until morning to resign.",
      tension_level: 10
    },
    {
      source_character_id: "suspect-daniel",
      target_character_id: "victim-lilly",
      relation_type: "Estranged Husband",
      public_status: "Separated for 4 months",
      hidden_truth: "Lilly discovered Daniel's secret affair with Maya hours before dinner.",
      tension_level: 9
    },
    {
      source_character_id: "suspect-daniel",
      target_character_id: "suspect-maya",
      relation_type: "Clandestine Affair",
      public_status: "Colleagues / Social acquaintances",
      hidden_truth: "Ongoing 6-month affair; both were frantically deleting texts after the conservatory argument.",
      tension_level: 8
    },
    {
      source_character_id: "suspect-vance",
      target_character_id: "victim-lilly",
      relation_type: "Personal Physician",
      public_status: "Family doctor and medical advisor",
      hidden_truth: "Supplying off-record Zolpidem sedatives in exchange for high consulting retainers.",
      tension_level: 5
    },
    {
      source_character_id: "witness-rebecca",
      target_character_id: "suspect-cam",
      relation_type: "Sommelier / House Manager to Executive",
      public_status: "Professional estate service",
      hidden_truth: "Logged Cam entering the wine cellar at 9:04 PM winded and sweating, contradicting his alibi.",
      tension_level: 6
    }
  ],
  characters: [
    {
      character_id: "suspect-cam",
      name: "Cam Sterling",
      age: 35,
      occupation: "COO & Co-Founder, Mehra Biologics",
      relation_to_victim: "Long-time business partner, co-executor of biotech patents",
      role: "suspect",
      avatar_code: "CS",
      description: "Immaculately groomed in a bespoke charcoal blazer. His posture is stiff, his tone measured and corporate. He speaks with deliberate poise, but his hands periodically tense into tight fists.",
      personality: {
        temperament: "Calculated, narcissistic, outwardly polite, inwardly volatile when cornered",
        communication_style: "Articulate, evasive, legalistic, redirects blame toward Daniel or Maya",
        baseline_confidence: 75,
        baseline_cooperativeness: 60,
        baseline_aggression: 25,
        vulnerability_triggers: ["audit", "embezzlement", "4.2 million", "wine cellar timing", "poolside footsteps", "bronze paperweight", "Lilly's ledger"],
        tell_patterns: [
          "Straightens his left cufflink when lying about his whereabouts.",
          "Pauses unnaturally before answering questions about the study or pool.",
          "Tightens his jaw and glances toward the terrace doors when pressed about the 8:50 PM window."
        ]
      },
      murder_involvement: {
        is_killer: true,
        is_accomplice: false,
        knows_killer_identity: true,
        knows_murder_occurred: true
      },
      known_facts: [
        "fact_cam_embezzlement",
        "fact_lilly_ultimatum",
        "fact_attack_poolside",
        "fact_paperweight_cleaned",
        "fact_rebecca_cellar_delay",
        "fact_daniel_left_early"
      ],
      hidden_facts: [
        "fact_cam_embezzlement",
        "fact_lilly_ultimatum",
        "fact_attack_poolside",
        "fact_paperweight_cleaned"
      ],
      secrets: [
        {
          secret_id: "sec_cam_1",
          topic: "Financial Fraud",
          description: "Stole $4.2M in grant funds to cover gambling debts in Macau and Cayman shell companies.",
          reason_to_hide: "Direct motive for first-degree murder.",
          trigger_keywords: ["audit", "money", "funds", "grant", "offshore", "cayman", "ledger"]
        },
        {
          secret_id: "sec_cam_2",
          topic: "Cellar Alibi Fabrication",
          description: "Was not in the wine cellar until 9:04 PM. Sneaked in through the pantry back stairs.",
          reason_to_hide: "Destroys his only alibi for the time of murder (8:56 PM).",
          trigger_keywords: ["cellar", "rebecca", "9:04", "wine", "stairs", "arrival", "breath"]
        }
      ],
      lies: [
        {
          lie_id: "lie_cam_alibi",
          claim: "I was down in the wine cellar with Rebecca Cole from roughly 8:45 PM until the scream at 9:18 PM, selecting a 2012 Margaux.",
          actual_truth: "He arrived at the wine cellar at 9:04 PM, sweating and winded, after killing Lilly at 8:56 PM and cleaning the paperweight.",
          motivation_for_lie: "To establish an ironclad alibi during the murder window.",
          contradicting_evidence_ids: ["evidence_rebecca_log", "evidence_wet_footprints"],
          break_threshold_stress: 70
        },
        {
          lie_id: "lie_cam_paperweight",
          claim: "That bronze paperweight has been sitting on the study bookshelf untouched all evening.",
          actual_truth: "He used it to strike Lilly at 8:56 PM by the gazebo, then wiped it and put it on the shelf.",
          motivation_for_lie: "Hide the murder weapon.",
          contradicting_evidence_ids: ["evidence_paperweight"],
          break_threshold_stress: 80
        }
      ],
      fears: ["Federal prison", "Forensic traces on the paperweight felt", "Rebecca revealing his true arrival time"],
      motivations: ["Survive the night without being arrested", "Frame Daniel as the volatile jealous husband"],
      alibi: {
        claimed_location: "Wine Cellar",
        claimed_activity: "Browsing vintage wines with Rebecca Cole",
        claimed_time_range: "8:45 PM - 9:18 PM",
        is_true: false,
        vulnerabilities: ["Rebecca only logged him entering at 9:04 PM", "He had pool water residue on his cuff"]
      },
      initial_state: {
        stress: 45,
        fear: 40,
        anger: 20,
        defensiveness: 55,
        confidence: 70,
        cooperation: 60
      }
    },
    {
      character_id: "suspect-daniel",
      name: "Daniel Mehra",
      age: 34,
      occupation: "Visual Artist & Landscape Architect",
      relation_to_victim: "Estranged husband (separated 4 months)",
      role: "suspect",
      avatar_code: "DM",
      description: "Disheveled hair, dark wool sweater, exhausted red-rimmed eyes. He smells of black coffee and nicotine. He is jittery, defensive, and deeply grieving despite their estrangement.",
      personality: {
        temperament: "Emotional, reactive, guilt-ridden, easily provoked by accusations",
        communication_style: "Blunt, defensive, passionate, interrupts frequently",
        baseline_confidence: 40,
        baseline_cooperativeness: 45,
        baseline_aggression: 50,
        vulnerability_triggers: ["affair", "Maya", "conservatory argument", "divorce settlement", "8:40 PM"],
        tell_patterns: [
          "Rubs his temples vigorously when stressed.",
          "Voice cracks when speaking of Lilly.",
          "Crosses arms tightly and glares when asked about Maya."
        ]
      },
      murder_involvement: {
        is_killer: false,
        is_accomplice: false,
        knows_killer_identity: false,
        knows_murder_occurred: true
      },
      known_facts: [
        "fact_daniel_maya_affair",
        "fact_conservatory_fight",
        "fact_daniel_left_estate"
      ],
      hidden_facts: [
        "fact_daniel_maya_affair"
      ],
      secrets: [
        {
          secret_id: "sec_dan_1",
          topic: "Secret Affair with Maya",
          description: "Had been having an affair with Maya Lin for 6 months. Lilly found the texts on his old tablet earlier today.",
          reason_to_hide: "Ashamed, fears being viewed as the primary suspect with a domestic passion motive.",
          trigger_keywords: ["maya", "affair", "texts", "conservatory", "argument", "cheating", "phone"]
        }
      ],
      lies: [
        {
          lie_id: "lie_dan_argument",
          claim: "Lilly and I just talked about the estate maintenance in the conservatory. It was completely civil.",
          actual_truth: "Lilly confronted him with evidence of his affair with Maya, cursed him, and told him to get out forever.",
          motivation_for_lie: "Does not want police to think he killed her in a rage over the affair.",
          contradicting_evidence_ids: ["evidence_phone_daniel"],
          break_threshold_stress: 55
        }
      ],
      fears: ["Being convicted for a murder he didn't commit", "The public humiliation of the affair"],
      motivations: ["Find who actually killed Lilly", "Clear his name"],
      alibi: {
        claimed_location: "Driving on Highway 1 toward his downtown studio",
        claimed_activity: "Driving away after the argument",
        claimed_time_range: "Left estate at 8:48 PM, reached studio at 9:25 PM",
        is_true: true,
        vulnerabilities: ["Left in extreme anger right before the murder occurred"]
      },
      initial_state: {
        stress: 70,
        fear: 60,
        anger: 65,
        defensiveness: 75,
        confidence: 35,
        cooperation: 40
      }
    },
    {
      character_id: "suspect-maya",
      name: "Maya Lin",
      age: 27,
      occupation: "Executive Assistant & Confidential Secretary",
      relation_to_victim: "Lilly's primary aide and confidante",
      role: "suspect",
      avatar_code: "ML",
      description: "Young, pale, wrapped in a trench coat over a silk blouse. Her mascara is slightly smeared and she clutches a paper handkerchief. She discovered the body at 9:18 PM.",
      personality: {
        temperament: "Anxious, observant, guilt-stricken, hyper-vigilant",
        communication_style: "Quiet, hesitant, apologetic, carefully chooses words",
        baseline_confidence: 30,
        baseline_cooperativeness: 65,
        baseline_aggression: 10,
        vulnerability_triggers: ["Daniel affair", "deleted texts", "body discovery", "Lilly's audit drive"],
        tell_patterns: [
          "Avoids eye contact and looks down at her hands.",
          "Shreds the paper napkin in her fingers.",
          "Voice drops to a whisper when talking about the pool."
        ]
      },
      murder_involvement: {
        is_killer: false,
        is_accomplice: false,
        knows_killer_identity: false,
        knows_murder_occurred: true
      },
      known_facts: [
        "fact_daniel_maya_affair",
        "fact_maya_body_discovery",
        "fact_audit_drive_existence",
        "fact_lilly_ultimatum"
      ],
      hidden_facts: [
        "fact_daniel_maya_affair"
      ],
      secrets: [
        {
          secret_id: "sec_maya_1",
          topic: "Affair with Daniel",
          description: "Was sleeping with Daniel. Lilly sent her a text at 8:42 PM saying 'We will deal with your betrayal tomorrow.'",
          reason_to_hide: "Devastated by guilt; terrified of looking like she had a motive to silence Lilly.",
          trigger_keywords: ["daniel", "affair", "texts", "betrayal", "phone", "guilt"]
        }
      ],
      lies: [
        {
          lie_id: "lie_maya_phone",
          claim: "I was just doing paperwork in the library from 8:30 PM until I went out to bring Lilly her chamomile tea at 9:18 PM.",
          actual_truth: "She spent 20 minutes in the library frantically deleting text message threads between herself and Daniel.",
          motivation_for_lie: "Hiding evidence of the affair.",
          contradicting_evidence_ids: ["evidence_phone_daniel"],
          break_threshold_stress: 50
        }
      ],
      fears: ["Being accused of murder", "Facing the Mehra family after the affair is revealed"],
      motivations: ["Protect herself from wrongful accusation", "Pay penance for betraying Lilly"],
      alibi: {
        claimed_location: "Library",
        claimed_activity: "Reviewing schedules and making tea",
        claimed_time_range: "8:35 PM - 9:18 PM",
        is_true: true,
        vulnerabilities: ["No one was in the library to corroborate except her phone activity"]
      },
      initial_state: {
        stress: 80,
        fear: 75,
        anger: 15,
        defensiveness: 60,
        confidence: 25,
        cooperation: 65
      }
    },
    {
      character_id: "suspect-vance",
      name: "Dr. Arthur Vance",
      age: 58,
      occupation: "Concierge Physician & Family Doctor",
      relation_to_victim: "Lilly's personal physician and family advisor",
      role: "suspect",
      avatar_code: "AV",
      description: "Distinguished silver-haired man wearing gold spectacles and a tweed jacket. He speaks with practiced bedside calmness, but has a subtle tremor in his right hand.",
      personality: {
        temperament: "Pompous, defensive of reputation, condescending, secretive",
        communication_style: "Formal, clinical, deflects personal inquiries into medical confidentiality",
        baseline_confidence: 65,
        baseline_cooperativeness: 50,
        baseline_aggression: 30,
        vulnerability_triggers: ["sedatives", "zolpidem", "prescription kickbacks", "medical license", "toxicology"],
        tell_patterns: [
          "Adjusts his gold spectacles repeatedly.",
          "Clears his throat with a dry cough before evading.",
          "Taps his leather notebook impatiently."
        ]
      },
      murder_involvement: {
        is_killer: false,
        is_accomplice: false,
        knows_killer_identity: false,
        knows_murder_occurred: true
      },
      known_facts: [
        "fact_vance_prescriptions",
        "fact_lilly_sleeplessness"
      ],
      hidden_facts: [
        "fact_vance_prescriptions"
      ],
      secrets: [
        {
          secret_id: "sec_vance_1",
          topic: "Off-Book Prescriptions",
          description: "Had been prescribing excessive Zolpidem and experimental sedatives to Lilly off the medical record in exchange for biotech consulting retainers.",
          reason_to_hide: "Could lose medical license and face criminal negligence charges.",
          trigger_keywords: ["sedative", "zolpidem", "drugs", "prescription", "consulting", "toxicology", "vial"]
        }
      ],
      lies: [
        {
          lie_id: "lie_vance_drugs",
          claim: "Lilly was on no medication whatsoever. She was in supreme physical condition.",
          actual_truth: "He gave her a fresh vial of Zolpidem that very afternoon at 4:00 PM.",
          motivation_for_lie: "Protect his medical license from malpractice and toxicology inquiry.",
          contradicting_evidence_ids: ["evidence_sedative_vial"],
          break_threshold_stress: 60
        }
      ],
      fears: ["Medical board investigation", "Being blamed if sedatives contributed to drowning"],
      motivations: ["Protect his high-society medical practice"],
      alibi: {
        claimed_location: "Guest Suite / Balcony Lounge",
        claimed_activity: "Reading medical journals and taking a private phone call with Zurich",
        claimed_time_range: "8:40 PM - 9:15 PM",
        is_true: true,
        vulnerabilities: ["Was alone in the guest suite during the crucial window"]
      },
      initial_state: {
        stress: 50,
        fear: 45,
        anger: 35,
        defensiveness: 65,
        confidence: 65,
        cooperation: 45
      }
    },
    {
      character_id: "witness-rebecca",
      name: "Rebecca Cole",
      age: 41,
      occupation: "Estate Sommelier & House Manager",
      relation_to_victim: "Estate employee for 6 years",
      role: "witness",
      avatar_code: "RC",
      description: "Crisp white shirt and dark apron. Highly observant, precise, and uncompromising about estate protocols. Holds a brass cellar key on her lanyard.",
      personality: {
        temperament: "Methodical, honest, detail-oriented, unimpressed by wealth",
        communication_style: "Factual, orderly, provides exact timestamps and observations without embellishment",
        baseline_confidence: 80,
        baseline_cooperativeness: 85,
        baseline_aggression: 10,
        vulnerability_triggers: ["estate negligence", "broken glasses", "cellar security"],
        tell_patterns: [
          "Checks her wrist watch when recalling times.",
          "Maintains direct, steady eye contact.",
          "Folds hands neatly in front of her."
        ]
      },
      murder_involvement: {
        is_killer: false,
        is_accomplice: false,
        knows_killer_identity: false,
        knows_murder_occurred: true
      },
      known_facts: [
        "fact_rebecca_cellar_delay",
        "fact_rebecca_log_signed",
        "fact_cam_out_of_breath",
        "fact_footprints_terrace"
      ],
      hidden_facts: [],
      secrets: [],
      lies: [],
      fears: ["Estate reputation being dragged into scandal"],
      motivations: ["Provide accurate facts to police", "Protect the estate staff"],
      alibi: {
        claimed_location: "Wine Cellar",
        claimed_activity: "Logging bottle inventory and auditing case stock",
        claimed_time_range: "8:50 PM - 9:15 PM",
        is_true: true,
        vulnerabilities: []
      },
      initial_state: {
        stress: 30,
        fear: 20,
        anger: 10,
        defensiveness: 20,
        confidence: 85,
        cooperation: 90
      }
    },
    {
      character_id: "witness-briggs",
      name: "Officer Thomas Briggs",
      age: 49,
      occupation: "Senior Patrol Officer, County Sheriff",
      relation_to_victim: "First official responder on scene",
      role: "investigator",
      avatar_code: "TB",
      description: "Weathered patrol officer in a drenched high-vis raincoat. His radio crackles intermittently. He stands guard near the pool cordon tape with a clipboard.",
      personality: {
        temperament: "Gruff, pragmatic, procedural, helpful to detectives",
        communication_style: "Direct police jargon, summarizes forensic and perimeter findings cleanly",
        baseline_confidence: 85,
        baseline_cooperativeness: 95,
        baseline_aggression: 15,
        vulnerability_triggers: ["tampered crime scenes", "chain of custody"],
        tell_patterns: [
          "Taps his flashlight on his duty belt.",
          "Flips through carbon incident sheets."
        ]
      },
      murder_involvement: {
        is_killer: false,
        is_accomplice: false,
        knows_killer_identity: false,
        knows_murder_occurred: true
      },
      known_facts: [
        "fact_pool_water_temp",
        "fact_initial_coroner_blunt_force",
        "fact_perimeter_secure",
        "fact_footprints_terrace"
      ],
      hidden_facts: [],
      secrets: [],
      lies: [],
      fears: ["Contamination of physical evidence in the downpour"],
      motivations: ["Assist the detective in securing a clean conviction"],
      alibi: {
        claimed_location: "Patrol Sector 4 until dispatch call at 9:22 PM",
        claimed_activity: "Road duty",
        claimed_time_range: "All evening",
        is_true: true,
        vulnerabilities: []
      },
      initial_state: {
        stress: 20,
        fear: 10,
        anger: 15,
        defensiveness: 10,
        confidence: 90,
        cooperation: 95
      }
    }
  ],
  facts: [
    {
      fact_id: "fact_cam_embezzlement",
      category: "motive",
      summary: "Cam embezzled $4.2M from grant accounts",
      details: "Cam redirected Mehra Biologics federal research grant funds through shell corporations registered in the Cayman Islands.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_lilly_ultimatum",
      category: "motive",
      summary: "Lilly gave Cam a deadline until tomorrow morning to confess",
      details: "Lilly presented Cam with printed bank audit statements at 8:52 PM, demanding his resignation and surrender to authorities.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_attack_poolside",
      category: "timeline",
      summary: "Lilly was struck by the pool gazebo at 8:56 PM",
      details: "Cam used the heavy bronze paperweight to strike Lilly on the back of the head, then pushed her into the pool.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_paperweight_cleaned",
      category: "forensic",
      summary: "Bronze paperweight was wiped and returned to study shelf",
      details: "Cam quickly wiped the paperweight with a bar towel. Microscopic traces of pool water and blood remain on the felt underside.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_rebecca_cellar_delay",
      category: "timeline",
      summary: "Cam only entered the wine cellar at 9:04 PM",
      details: "Rebecca Cole was in the cellar from 8:50 PM. Cam did not appear until 9:04 PM, visibly winded and sweating despite the cool cellar.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_cam_out_of_breath",
      category: "behavior",
      summary: "Cam arrived in the cellar breathing heavily",
      details: "Rebecca noticed Cam's damp shirt sleeves and labored breathing when he asked for a bottle of wine at 9:04 PM.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_daniel_maya_affair",
      category: "relationship",
      summary: "Daniel and Maya were having an affair",
      details: "Daniel Mehra and Maya Lin had been having a clandestine affair for 6 months. Lilly discovered it hours before her death.",
      is_canonical_truth: true,
      is_red_herring: true
    },
    {
      fact_id: "fact_conservatory_fight",
      category: "timeline",
      summary: "Daniel and Lilly had a fierce argument at 8:40 PM",
      details: "Lilly confronted Daniel about the affair in the conservatory. Daniel stormed out.",
      is_canonical_truth: true,
      is_red_herring: true
    },
    {
      fact_id: "fact_daniel_left_early",
      category: "timeline",
      summary: "Daniel drove away through the front gate at 8:48 PM",
      details: "The gate automated license scanner registered Daniel's SUV exiting at 8:48 PM, placing him miles away when Lilly was killed at 8:56 PM.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_daniel_left_estate",
      category: "timeline",
      summary: "Daniel departed estate before 8:50 PM",
      details: "Daniel left the grounds in his vehicle prior to the estimated time of death.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_maya_body_discovery",
      category: "timeline",
      summary: "Maya found the body at 9:18 PM",
      details: "Maya walked out to the pool colonnade carrying chamomile tea and saw Lilly face down in the shallow water.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_audit_drive_existence",
      category: "motive",
      summary: "Lilly kept a forensic audit flash drive in her study safe",
      details: "A black encrypted USB drive contains full ledger reconciliations proving Cam's fraudulent transfers.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_vance_prescriptions",
      category: "relationship",
      summary: "Dr. Vance prescribed off-book sedatives to Lilly",
      details: "Dr. Vance supplied Zolpidem without formal prescriptions in exchange for high retainer payments.",
      is_canonical_truth: true,
      is_red_herring: true
    },
    {
      fact_id: "fact_lilly_sleeplessness",
      category: "behavior",
      summary: "Lilly suffered from severe insomnia due to stress",
      details: "Lilly frequently walked the pool garden late at night when unable to sleep.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_rebecca_log_signed",
      category: "timeline",
      summary: "Cellar stock log signed by Rebecca with exact timestamps",
      details: "Rebecca Cole maintains a strict logbook documenting her cellar audit from 8:50 PM to 9:15 PM.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_footprints_terrace",
      category: "forensic",
      summary: "Faint damp footprints leading from pool into the study",
      details: "Chlorinated water droplets and shoe tread impressions lead from the pool gazebo across the terrace and into the study French doors.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_pool_water_temp",
      category: "forensic",
      summary: "Pool water heated to 84 degrees Fahrenheit",
      details: "The infinity pool was heated, preventing immediate cold shock rigor.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_initial_coroner_blunt_force",
      category: "forensic",
      summary: "Coroner notes blunt force laceration on occipital skull",
      details: "The head wound occurred prior to submersion; bone contusion dimensions match a rectangular heavy object with rounded corners.",
      is_canonical_truth: true
    },
    {
      fact_id: "fact_perimeter_secure",
      category: "forensic",
      summary: "Estate perimeter security remained active with no external breaches",
      details: "High-voltage fence sensors and motion cameras confirm no outsider entered the estate grounds.",
      is_canonical_truth: true
    }
  ],
  timeline: [
    {
      event_id: "event_dinner_end",
      timestamp: "8:20 PM",
      time_numeric: 1220,
      location: "Formal Dining Room",
      summary: "Dinner concludes. Guests and household members disperse to various wings of the estate.",
      involved_character_ids: ["victim-lilly", "suspect-cam", "suspect-daniel", "suspect-maya", "suspect-vance", "witness-rebecca"],
      is_murder_event: false,
      witness_character_ids: ["witness-rebecca"],
      canonical_truth: "Lilly seemed tense and asked Cam and Daniel to speak with her separately before the night ended.",
      public_initial_knowledge: true
    },
    {
      event_id: "event_conservatory_fight",
      timestamp: "8:40 PM",
      time_numeric: 1240,
      location: "Conservatory",
      summary: "Heated argument between Lilly and Daniel over text messages found on an old iPad.",
      involved_character_ids: ["victim-lilly", "suspect-daniel"],
      is_murder_event: false,
      witness_character_ids: ["suspect-maya"],
      canonical_truth: "Lilly confronted Daniel with proof of his affair with Maya. Daniel shouted in frustration and stormed out toward his car.",
      public_initial_knowledge: true
    },
    {
      event_id: "event_daniel_gate_exit",
      timestamp: "8:48 PM",
      time_numeric: 1248,
      location: "Front Security Gate",
      summary: "Daniel drives off estate grounds in his dark grey SUV.",
      involved_character_ids: ["suspect-daniel"],
      is_murder_event: false,
      witness_character_ids: [],
      canonical_truth: "Gate cameras timestamp Daniel's vehicle passing through the gates at 8:48:12 PM.",
      public_initial_knowledge: false
    },
    {
      event_id: "event_rebecca_enters_cellar",
      timestamp: "8:50 PM",
      time_numeric: 1250,
      location: "Wine Cellar",
      summary: "Rebecca begins her evening inventory in the subterranean wine cellar.",
      involved_character_ids: ["witness-rebecca"],
      is_murder_event: false,
      witness_character_ids: ["witness-rebecca"],
      canonical_truth: "Rebecca unlocks the cellar at 8:50 PM. She is alone until 9:04 PM.",
      public_initial_knowledge: false
    },
    {
      event_id: "event_lilly_gazebo",
      timestamp: "8:52 PM",
      time_numeric: 1252,
      location: "Poolside Gazebo",
      summary: "Lilly walks out to the pool gazebo; Cam follows her with audit documentation.",
      involved_character_ids: ["victim-lilly", "suspect-cam"],
      is_murder_event: false,
      witness_character_ids: [],
      canonical_truth: "Cam tries to persuade Lilly to delay the audit. Lilly refuses flatly and demands his resignation.",
      public_initial_knowledge: false
    },
    {
      event_id: "event_murder_attack",
      timestamp: "8:56 PM",
      time_numeric: 1256,
      location: "Poolside Gazebo / Infinity Pool",
      summary: "The Fatal Assault. Lilly is struck with the bronze paperweight and pushed into the pool.",
      involved_character_ids: ["victim-lilly", "suspect-cam"],
      is_murder_event: true,
      witness_character_ids: [],
      canonical_truth: "Cam strikes Lilly on the back of the head with the bronze paperweight, rendering her unconscious, then shoves her into the pool water where she drowns.",
      public_initial_knowledge: false
    },
    {
      event_id: "event_cam_cleans_weapon",
      timestamp: "9:00 PM",
      time_numeric: 1300,
      location: "Study",
      summary: "Cam enters study from terrace, wipes weapon, and places it on bookshelf.",
      involved_character_ids: ["suspect-cam"],
      is_murder_event: false,
      witness_character_ids: [],
      canonical_truth: "Cam tracks damp footprints into the study, hastily wipes the paperweight, and leaves via the service hallway.",
      public_initial_knowledge: false
    },
    {
      event_id: "event_cam_cellar",
      timestamp: "9:04 PM",
      time_numeric: 1304,
      location: "Wine Cellar",
      summary: "Cam arrives in the wine cellar where Rebecca is conducting inventory.",
      involved_character_ids: ["suspect-cam", "witness-rebecca"],
      is_murder_event: false,
      witness_character_ids: ["witness-rebecca"],
      canonical_truth: "Cam enters the cellar flushed and breathing heavily, claiming he has been looking for Rebecca for ten minutes to choose a vintage.",
      public_initial_knowledge: false
    },
    {
      event_id: "event_body_discovery",
      timestamp: "9:18 PM",
      time_numeric: 1318,
      location: "Infinity Pool",
      summary: "Maya discovers Lilly's body floating in the shallow end and screams.",
      involved_character_ids: ["suspect-maya", "victim-lilly"],
      is_murder_event: false,
      witness_character_ids: ["suspect-maya", "suspect-cam", "witness-rebecca", "suspect-vance"],
      canonical_truth: "Maya brings tea out to the pool and sees Lilly submerged face down. Her screams alert the household.",
      public_initial_knowledge: true
    },
    {
      event_id: "event_police_arrival",
      timestamp: "9:32 PM",
      time_numeric: 1332,
      location: "Glass Pavilion Front Courtyard",
      summary: "First responder patrol unit (Officer Briggs) arrives and secures the scene.",
      involved_character_ids: ["witness-briggs"],
      is_murder_event: false,
      witness_character_ids: ["witness-briggs"],
      canonical_truth: "Officer Briggs arrives, confirms victim is deceased, tapes off pool and study, and logs all present persons.",
      public_initial_knowledge: true
    }
  ],
  evidence: [
    {
      evidence_id: "evidence_paperweight",
      name: "Heavy Bronze Estate Paperweight",
      category: "physical",
      location_found: "Study Bookshelf (Third shelf, beside Mehra Biologics patent awards)",
      initial_description: "A solid cast-bronze decorative block with rounded beveled edges, weighing approximately 3.4 lbs. Features an engraved crest of the Glass Pavilion.",
      canonical_truth: "The murder weapon used by Cam Sterling. Cam wiped the exterior brass surfaces, but failed to realize that microscopic saline pool water and traces of blood soaked into the porous green felt base.",
      discoverable_facts: [
        "Weighs 3.4 lbs with sharp beveled edges matching the skull fracture dimensions.",
        "Normally kept on the outdoor gazebo console table, not in the study bookshelf.",
        "Smells faintly of citrus bar cleaner used in the study wet bar."
      ],
      forensic_facts: [
        "Luminol test on the green felt underside tests positive for trace human blood matching Lilly Mehra (Type A+).",
        "Micro-spectroscopy detects chlorinated pool water salts embedded in the underside felt."
      ],
      related_characters: ["suspect-cam"],
      related_events: ["event_murder_attack", "event_cam_cleans_weapon"],
      examined_initially: false
    },
    {
      evidence_id: "evidence_phone_daniel",
      name: "Daniel's Encrypted Smartphone",
      category: "digital",
      location_found: "Recovered from Daniel's vehicle during preliminary traffic stop",
      initial_description: "A slate-black smartphone with a cracked screen protector.",
      canonical_truth: "Contains intimate text exchanges with Maya Lin dating back 6 months, and an angry text from Lilly sent at 8:42 PM: 'Get out of my house. Maya is finished too.'",
      discoverable_facts: [
        "Reveals ongoing romantic affair between Daniel Mehra and Maya Lin.",
        "Shows outgoing text to Maya at 8:45 PM: 'She knows everything. I'm leaving before I lose my mind.'",
        "GPS tracking log confirms device left estate radius at 8:48 PM."
      ],
      forensic_facts: [
        "Cell tower triangulation confirms the phone connected to Tower 14 (Highway 1 North) at 8:54 PM, 6.2 miles from the estate."
      ],
      related_characters: ["suspect-daniel", "suspect-maya"],
      related_events: ["event_conservatory_fight", "event_daniel_gate_exit"],
      examined_initially: false,
      is_red_herring: true
    },
    {
      evidence_id: "evidence_usb_audit",
      name: "Encrypted Flash Drive (Mehra Biologics Audit)",
      category: "document",
      location_found: "Inside Lilly's leather briefcase in the master bedroom",
      initial_description: "A matte-black ironkey encrypted USB storage drive labeled 'CONFIDENTIAL — Q4 FORENSIC AUDIT'.",
      canonical_truth: "Contains spreadsheets and wire transfer records proving Cam Sterling diverted $4.2 million from research grant accounts into 'Silverline Holdings Ltd' in Grand Cayman.",
      discoverable_facts: [
        "Detailed transaction ledger showing systematic transfers authorized solely by Cam Sterling's credentials.",
        "Draft letter to the Department of Justice requesting criminal embezzlement charges against Cam Sterling.",
        "Timestamped note from Lilly created at 5:14 PM today: 'Cam must resign tonight or the DOJ receives this file at 9:00 AM.'"
      ],
      forensic_facts: [
        "Digital forensics verify all spreadsheet metadata was compiled and signed by external forensic auditors 48 hours ago."
      ],
      related_characters: ["suspect-cam"],
      related_events: ["event_lilly_gazebo", "event_murder_attack"],
      examined_initially: false
    },
    {
      evidence_id: "evidence_pool_chlorine",
      name: "Smart Pool Chlorinator & Flow Telemetry",
      category: "digital",
      location_found: "Estate Utility Room Server",
      initial_description: "Automated telemetry dashboard recording water temperature, pH, chemical dosing, and surface wave displacement.",
      canonical_truth: "Records water displacement and wave sensor agitation beginning at 8:56:14 PM and subsiding at 9:01:20 PM.",
      discoverable_facts: [
        "A sudden high-amplitude water displacement event is recorded at 8:56 PM.",
        "The automated surface wave alarm was triggered for 4 minutes and 50 seconds before calming.",
        "Pool water temperature was maintained at a constant 84.2°F."
      ],
      forensic_facts: [
        "Confirms physical entry into the pool water occurred precisely between 8:56 PM and 8:57 PM."
      ],
      related_characters: ["suspect-cam"],
      related_events: ["event_murder_attack"],
      examined_initially: false
    },
    {
      evidence_id: "evidence_broken_glass",
      name: "Shattered Crystal Tumbler",
      category: "physical",
      location_found: "Stone flagstones beside the poolside gazebo",
      initial_description: "Heavy crystal rocks glass broken into four large shards, smelling of 18-year single malt scotch.",
      canonical_truth: "Dropped by Lilly when Cam surprised her by the gazebo. Traces of Cam's fingerprints on the gazebo wooden rail nearby.",
      discoverable_facts: [
        "Contains residue of expensive single malt scotch identical to the bottle in Cam's study.",
        "The glass fell from waist height and shattered against the slate."
      ],
      forensic_facts: [
        "Latent palm print on the adjacent mahogany railing belongs to Cam Sterling."
      ],
      related_characters: ["suspect-cam"],
      related_events: ["event_lilly_gazebo", "event_murder_attack"],
      examined_initially: false
    },
    {
      evidence_id: "evidence_gate_log",
      name: "Automated Security Gate Registry",
      category: "digital",
      location_found: "Guardhouse Terminal",
      initial_description: "Automated ANPR (Automatic Number Plate Recognition) logs for all inbound and outbound estate vehicles.",
      canonical_truth: "Proves Daniel Mehra's vehicle exited through the main gates at 8:48:12 PM, corroborating that he was not present when the murder occurred at 8:56 PM.",
      discoverable_facts: [
        "Plate #7XYZ49 (Daniel Mehra - Audi Q7) recorded OUTBOUND at 8:48 PM.",
        "No vehicles entered or left between 8:48 PM and 9:22 PM (First Responder Patrol Unit)."
      ],
      forensic_facts: [
        "System timestamp calibrated against atomic clock; zero margin of error."
      ],
      related_characters: ["suspect-daniel"],
      related_events: ["event_daniel_gate_exit"],
      examined_initially: true
    },
    {
      evidence_id: "evidence_wet_footprints",
      name: "Damp Chlorinated Shoe Impressions",
      category: "physical",
      location_found: "Covered terrace walkway leading from Pool Gazebo to Study French Doors",
      initial_description: "Faint damp tread patterns visible under oblique angled lighting along the slate paving.",
      canonical_truth: "Left by Cam Sterling as he fled the pool after pushing Lilly into the water, carrying the weapon back into the study.",
      discoverable_facts: [
        "Tread corresponds to size 11 Italian leather oxford shoes (the style and size worn by Cam Sterling).",
        "Footprints head in one direction: FROM pool TO study, ending right at the bookshelf."
      ],
      forensic_facts: [
        "Chemical swab tests positive for pool chlorine and trace carpet fibers from the study rug."
      ],
      related_characters: ["suspect-cam"],
      related_events: ["event_cam_cleans_weapon"],
      examined_initially: false
    },
    {
      evidence_id: "evidence_sedative_vial",
      name: "Empty Glass Vial of Zolpidem Tartrate",
      category: "physical",
      location_found: "Guest Powder Room Vanity Bin",
      initial_description: "Small amber pharmaceutical vial labeled 10mg Zolpidem with Dr. Arthur Vance's private clinic stamp.",
      canonical_truth: "Prescribed informally by Dr. Vance to Lilly earlier in the day. Lilly took one dose at 4:30 PM, leaving trace therapeutic levels in her system that caused minor drowsiness but was not lethal.",
      discoverable_facts: [
        "Dispensed directly by Dr. Vance without a pharmacy registry barcode.",
        "Dr. Vance had previously denied prescribing any medication to Lilly."
      ],
      forensic_facts: [
        "Toxicology confirms sub-clinical therapeutic level of Zolpidem in victim's blood (0.04 mg/L) — insufficient to cause unconsciousness without the head strike."
      ],
      related_characters: ["suspect-vance"],
      related_events: [],
      examined_initially: false,
      is_red_herring: true
    },
    {
      evidence_id: "evidence_rebecca_log",
      name: "Sommelier Cellar Audit Sheet",
      category: "document",
      location_found: "Wine Cellar Desk Clipboard",
      initial_description: "A handwritten ledger of vintage wine bottles inspected during Rebecca Cole's inventory shift.",
      canonical_truth: "Written and timestamped continuously by Rebecca Cole from 8:50 PM to 9:15 PM. Records Cam Sterling's entry precisely at 9:04 PM.",
      discoverable_facts: [
        "Rebecca entered the cellar alone at 8:50 PM.",
        "Cam Sterling is logged arriving at 9:04 PM requesting a 2012 Margaux.",
        "Directly disproves Cam's claim that he was in the cellar since 8:45 PM."
      ],
      forensic_facts: [
        "Ink analysis confirms entry was made in chronological sequence with no subsequent alterations."
      ],
      related_characters: ["witness-rebecca", "suspect-cam"],
      related_events: ["event_rebecca_enters_cellar", "event_cam_cellar"],
      examined_initially: false
    },
    {
      evidence_id: "evidence_lilly_earring",
      name: "Torn Pearl Drop Earring",
      category: "physical",
      location_found: "Wedged in the drainage grate beside the shallow pool edge",
      initial_description: "A South Sea pearl earring with a bent platinum post and torn clasp.",
      canonical_truth: "Ripped from Lilly's ear when she collapsed against the stone coping after being struck by Cam.",
      discoverable_facts: [
        "The post is violently bent, indicating sudden mechanical force rather than falling off.",
        "Matches the single pearl earring still attached to the victim's left ear."
      ],
      forensic_facts: [
        "Traces of micro-tissue on the clasp confirm blunt mechanical detachment."
      ],
      related_characters: ["suspect-cam"],
      related_events: ["event_murder_attack"],
      examined_initially: false
    }
  ],
  forensics: {
    autopsy_id: "AUT-2026-0882",
    estimated_time_of_death: "8:50 PM - 9:05 PM",
    official_cause_of_death: "Asphyxiation secondary to freshwater drowning following concussive craniocerebral blunt force injury.",
    contusions_and_wounds: [
      "Transverse laceration (4.2 cm) over the right occipital-parietal region of the scalp.",
      "Depressed linear skull fracture beneath the laceration consistent with a heavy, rectangular blunt object with beveled perimeter.",
      "Bruising on the upper right clavicle indicating forceful grip or push immediately prior to water entry.",
      "No defensive wounds on palms, forearms, or fingernails, indicating the victim was struck from behind without warning."
    ],
    toxicology_findings: [
      "Blood Alcohol: 0.03 g/dL (trace, consistent with half glass of wine with dinner).",
      "Zolpidem: 0.04 mg/L (therapeutic sedative level, not toxic or debilitating on its own).",
      "No narcotics, paralyzing agents, or other poisons detected."
    ],
    stomach_contents: "Partially digested salmon and risotto consistent with dinner consumed at approximately 8:00 PM.",
    pool_water_analysis: "Lungs contain 480 mL of chlorinated freshwater containing the exact ionic chemical composition and cyanuric acid stabilizer ratio of the Glass Pavilion infinity pool, proving the victim was still breathing when submerged.",
    initial_examiner_notes: "Victim did not drown simply from slipping. The severe occipital fracture rendered her instantly unconscious before she entered the water. The object used to strike her possessed significant mass and defined geometric edges.",
    deep_forensics_revealed: true
  },
  red_herrings: [
    {
      herring_id: "herring_affair",
      title: "The Clandestine Affair of Daniel and Maya",
      description: "Daniel and Maya were having an affair and frantically concealing texts. Daniel fought fiercely with Lilly at 8:40 PM.",
      apparent_suspicion: "Daniel had passion motive and explosive temperament; Maya was at the scene and found the body.",
      innocent_explanation: "Daniel left at 8:48 PM as proven by security gate ANPR and cell tower telemetry. Maya was deleting texts out of shame, not complicity in murder."
    },
    {
      herring_id: "herring_vance_sedatives",
      title: "Dr. Vance's Illicit Prescription Scheme",
      description: "Dr. Vance gave Lilly illicit sleeping pills and lied about her medical history.",
      apparent_suspicion: "Could have poisoned or drugged Lilly into drowning.",
      innocent_explanation: "Vance was merely covering his malpractice liability; toxicology proves the drug level was far below incapacitating thresholds."
    }
  ],
  opening_scene: {
    title: "The Crime Scene at the Glass Pavilion",
    briefing: "At 9:18 PM on October 24, Lilly Mehra was found submerged in the illuminated shallow end of the estate's infinity pool. County patrol units secured the perimeter. Heavy rain lashes the glass walls of the modern mansion. You have just arrived to take over the primary investigation.",
    initial_observations: [
      "The victim's body has been recovered to the pool deck and covered under a forensic sheet.",
      "A heavy storm is raging outside; all guests and staff have been gathered inside the main salon.",
      "First responder Officer Briggs has secured the immediate perimeter and recorded the initial gate logs.",
      "The Glass Pavilion's study, library, and wine cellar remain open for inspection."
    ],
    available_characters: ["suspect-cam", "suspect-daniel", "suspect-maya", "suspect-vance", "witness-rebecca", "witness-briggs"],
    available_evidence: ["evidence_gate_log", "evidence_broken_glass"]
  }
};
