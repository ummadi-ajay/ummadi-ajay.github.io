const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HIRING_DIR = path.resolve(__dirname);
const ROLES_DIR = path.join(HIRING_DIR, 'roles');
const SITE_URL = 'https://makerworkslab.in';
const APPLY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSel9jYNHkLD-qDfJa8tSaEQIjKiWooXVjLk1jvDSKzwlztwkg/viewform?usp=publish-editor';
const DATE_POSTED = '2026-05-26';
const LASTMOD = '2026-05-26';
const ORGANIZATION = {
  name: 'MakerWorks Lab',
  url: SITE_URL,
  logo: `${SITE_URL}/makerworks_logo_111_79_1.jpeg`,
  email: 'info@makerworkslab.in'
};
const DEFAULT_DETAILS = {
  location: 'MakerWorks Lab, Malad East, Mumbai',
  stipend: 'INR 10,000 per month',
  duration: '2 months, extendable based on performance and project needs',
  commitment: 'Monday to Friday, 9:00 AM to 6:00 PM; Saturdays optional as mutually agreed',
  reporting: 'Abhay Waghmare, Lab Director'
};

const roles = [
  {
    slug: 'ai-research-intern',
    title: 'AI Research Intern',
    subtitle: 'Deep Learning, Computer Vision, NLP, Physical AI',
    openings: '2 openings',
    openingsNumber: 2,
    mode: 'Onsite',
    icon: 'bi-cpu-fill',
    accent: 'ai',
    suitableFor: 'Computer Engineering, IT, AI/ML, Data Science, Electronics, and students with strong programming fundamentals.',
    selectionFocus: 'Research curiosity, proof of work, programming ability, ownership, and willingness to work toward serious research outcomes.',
    metaDescription: 'Apply for the AI Research Intern role at MakerWorks Lab, Mumbai. Work on deep learning, computer vision, NLP, Physical AI, LeRobot, Reachy Mini, and SOTA AI research.',
    keywords: [
      'AI research internship Mumbai',
      'deep learning internship',
      'computer vision internship',
      'NLP internship',
      'Physical AI internship',
      'LeRobot internship',
      'Reachy Mini research'
    ],
    summary:
      'The AI Research Intern will work on deep learning, computer vision, NLP, Physical AI, and applied ML research for MakerWorks Lab. The role includes research exploration, model development, experimentation, evaluation, and work with open-source AI and robotics systems such as LeRobot, Reachy Mini, ML research workflows, Auto Research tools, and related Physical AI platforms.',
    sections: [
      {
        title: 'Key Responsibilities',
        items: [
          'Work on deep learning, computer vision, NLP, multimodal AI, embodied AI, and Physical AI experiments.',
          'Review papers, reproduce baselines, build experiments, and document research assumptions and results.',
          'Prototype AI workflows using Python, notebooks, APIs, model interfaces, datasets, and agentic tools.',
          'Explore open-source robotics and Physical AI stacks such as LeRobot, Reachy Mini, and related ML research systems.',
          'Compare model outputs for accuracy, robustness, reliability, latency, safety, and practical deployment value.',
          'Coordinate with robotics, teaching, and lab teams wherever AI can support physical systems or student projects.'
        ]
      },
      {
        title: 'Example Work Areas',
        items: [
          'Vision-language-action models, robot learning datasets, object detection, segmentation, pose estimation, and scene understanding.',
          'Retrieval-augmented systems, research agents, model evaluation pipelines, and AI tools for lab automation.',
          'Research writing, experiment tracking, ablation studies, benchmark comparisons, and workshop paper preparation.'
        ]
      },
      {
        title: 'Preferred Skills',
        items: [
          'Strong Python fundamentals and comfort with ML notebooks, scripts, and research code.',
          'Interest in deep learning, computer vision, NLP, multimodal learning, robotics AI, and SOTA research.',
          'Ability to read research papers, implement ideas, run experiments, and write clear technical notes.',
          'Familiarity with PyTorch, TensorFlow, Hugging Face, OpenCV, ROS, or similar tools is a plus.'
        ]
      },
      {
        title: 'Expected Outcomes',
        items: [
          'Research prototypes, reproducible experiments, model evaluations, datasets, and technical reports.',
          'Contributions toward SOTA research publication targets in A* AI conferences and workshops such as NIPS/NeurIPS, ICLR, ICML, CVPR, ICCV, ACL, and related venues.',
          'Working demonstrations involving Physical AI, robotics-AI workflows, LeRobot, Reachy Mini, ML research tools, or autonomous research systems.'
        ]
      }
    ]
  },
  {
    slug: 'autonomous-robotics-intern',
    title: 'Autonomous Robotics Intern',
    subtitle: 'Open-source robotics hardware and competition systems',
    openings: '2 openings',
    openingsNumber: 2,
    mode: 'Onsite',
    icon: 'bi-robot',
    accent: 'robotics',
    suitableFor: 'Mechanical, Electronics, EXTC, Robotics, Mechatronics, Computer Engineering, and hands-on builders.',
    selectionFocus: 'Practical robotics ability, competition experience, teamwork, safety discipline, and ownership.',
    metaDescription: 'Apply for the Autonomous Robotics Intern role at MakerWorks Lab, Mumbai. Build open-source robotics hardware, autonomous systems, and guide competition teams.',
    keywords: [
      'autonomous robotics internship Mumbai',
      'robotics internship',
      'ROBOCON internship',
      'open source robotics hardware',
      'robotics prototyping lab'
    ],
    summary:
      'The Autonomous Robotics Intern will be part of the robotics and prototyping lab, building with open-source robotics hardware, autonomous systems, sensors, actuators, embedded controllers, and competition-style robot platforms. The role also includes supporting and guiding student competition teams.',
    sections: [
      {
        title: 'Key Responsibilities',
        items: [
          'Build and test autonomous robots, mobile platforms, mechanisms, and open-source robotics hardware.',
          'Work with sensors, motor drivers, actuators, batteries, embedded boards, mechanical assemblies, and control logic.',
          'Prototype, assemble, debug, and improve robots through structured lab testing and rapid iteration.',
          'Support student teams preparing for robotics competitions, demos, workshops, and project showcases.',
          'Maintain build notes, wiring references, test logs, BOM notes, issue lists, and iteration records.',
          'Follow lab safety practices for tools, batteries, moving mechanisms, electronics, and fabrication equipment.'
        ]
      },
      {
        title: 'Example Work Areas',
        items: [
          'Line followers, maze solvers, mobile robots, robotic arms, rover platforms, drone-related subsystems, and competition robots.',
          'Chassis design, drivetrain selection, sensor placement, motor tuning, calibration, and field testing.',
          'Student mentoring for ideation, build planning, troubleshooting, demo preparation, and competition strategy.'
        ]
      },
      {
        title: 'Preferred Skills',
        items: [
          'Hands-on experience with robotics hardware, embedded boards, sensors, actuators, and mechanical assembly.',
          'Interest in open-source robotics platforms, ROS, Arduino, Raspberry Pi, ESP32, and autonomous systems.',
          'Student competition experience such as ROBOCON, WRO, FTC, hackathons, or similar events is a huge plus.',
          'Ability to guide juniors, document builds, debug failures, and work responsibly in a prototyping lab.'
        ]
      },
      {
        title: 'Expected Outcomes',
        items: [
          'Functional robot prototypes, tested subsystems, demo-ready assemblies, or validated mechanisms.',
          'Competition-ready student project support, build documentation, test observations, and improvement plans.',
          'Improved lab capability in open-source robotics hardware, autonomous builds, and hands-on student mentoring.'
        ]
      }
    ]
  },
  {
    slug: 'electronics-pcb-design-intern',
    title: 'Electronics & PCB Design Intern',
    subtitle: 'Circuit design, KiCad, open-source hardware',
    openings: '2 openings',
    openingsNumber: 2,
    mode: 'Onsite',
    icon: 'bi-plug-fill',
    accent: 'pcb',
    suitableFor: 'Electronics, EXTC, Electrical, Robotics, IoT, Mechatronics, and Computer Engineering students.',
    selectionFocus: 'Circuit thinking, PCB design skill, debugging patience, documentation, and hands-on ownership.',
    metaDescription: 'Apply for the Electronics and PCB Design Intern role at MakerWorks Lab, Mumbai. Design circuits and PCBs using KiCad, open-source hardware, and robotics electronics.',
    keywords: [
      'PCB design internship Mumbai',
      'electronics internship Mumbai',
      'KiCad internship',
      'open source hardware internship',
      'robotics electronics internship'
    ],
    summary:
      'The Electronics and PCB Design Intern will be part of the robotics and prototyping lab, building circuits and electronics systems from scratch using open-source hardware, schematic design, PCB design, testing, debugging, and fabrication workflows.',
    sections: [
      {
        title: 'Key Responsibilities',
        items: [
          'Design, build, test, and debug circuits for robotics, IoT, automation, sensors, motor control, and student projects.',
          'Create schematic designs and PCB layouts using KiCad or similar PCB design programs.',
          'Work with open-source hardware platforms, microcontrollers, sensors, drivers, connectors, power systems, and test equipment.',
          'Prototype circuits on breadboards, perfboards, and PCBs, then validate them through structured testing.',
          'Support and guide student teams preparing for electronics, robotics, and engineering competitions.',
          'Maintain circuit diagrams, PCB files, BOMs, test notes, assembly guides, and revision history.'
        ]
      },
      {
        title: 'Example Work Areas',
        items: [
          'Sensor boards, motor driver boards, power distribution boards, connector boards, controller shields, and test fixtures.',
          'Schematic capture, footprint selection, routing, DRC checks, gerber export, board bring-up, and revision planning.',
          'Student support for safe wiring, debugging, soldering, board testing, and competition electronics readiness.'
        ]
      },
      {
        title: 'Preferred Skills',
        items: [
          'Circuit design fundamentals and hands-on electronics debugging ability.',
          'KiCad, EasyEDA, Altium, Eagle, Fusion electronics, or similar PCB design experience.',
          'Comfort with soldering, multimeters, power supplies, sensors, microcontrollers, and datasheets.',
          'Student competition experience such as ROBOCON, electronics contests, hackathons, or similar events is a huge plus.'
        ]
      },
      {
        title: 'Expected Outcomes',
        items: [
          'Working circuit prototypes, PCB designs, assembled boards, tested modules, and electronics documentation.',
          'Improved electronics support for robotics builds, student competition teams, and lab prototyping work.',
          'Clean design files, BOMs, test reports, and reusable electronics modules for future lab projects.'
        ]
      }
    ]
  },
  {
    slug: 'technical-media-content-intern',
    title: 'Technical Media & Content Intern',
    subtitle: 'Video, social media, lab storytelling',
    openings: '2 openings',
    openingsNumber: 2,
    mode: 'Onsite',
    icon: 'bi-camera-reels-fill',
    accent: 'media',
    suitableFor: 'Media, Design, Mass Communication, Marketing, Engineering, and students who can tell technical stories visually.',
    selectionFocus: 'Shooting ability, editing basics, consistency, storytelling, and organized execution.',
    metaDescription: 'Apply for the Technical Media and Content Intern role at MakerWorks Lab, Mumbai. Shoot raw video, edit content, manage social channels, and promote lab activities.',
    keywords: [
      'technical content internship Mumbai',
      'video editing internship Mumbai',
      'social media internship robotics',
      'content intern MakerWorks Lab'
    ],
    summary:
      'The Technical Media and Content Intern will create raw video, photo, and media content for the work happening inside MakerWorks Lab. The role includes shooting with cameras or phones, basic editing, managing social channels, and promoting lab activities, projects, student work, demos, workshops, and research progress.',
    sections: [
      {
        title: 'Key Responsibilities',
        items: [
          'Capture raw videos, photos, process clips, demos, workshops, lab activity, and behind-the-scenes footage.',
          'Shoot with cameras, phones, microphones, lights, tripods, and other basic media equipment.',
          'Edit short-form videos, reels, posts, stories, thumbnails, captions, and simple technical explainers.',
          'Manage and update social channels for lab activities, student projects, workshops, and demos.',
          'Coordinate with engineers, fellows, and interns to capture accurate, safe, and approved project content.',
          'Organize raw footage, edited files, captions, content calendars, publishing notes, and media archives.'
        ]
      },
      {
        title: 'Example Work Areas',
        items: [
          'Build-in-public reels, student project stories, lab tour clips, workshop highlights, demo explainers, and mentor interviews.',
          'Weekly social media posting support across Instagram, LinkedIn, YouTube Shorts, and other relevant channels.',
          'Content planning around competitions, research milestones, new prototypes, school programs, and public events.'
        ]
      },
      {
        title: 'Preferred Skills',
        items: [
          'Camera handling, phone videography, basic lighting, framing, and audio awareness.',
          'Basic editing with CapCut, Premiere Pro, DaVinci Resolve, Canva, or similar tools.',
          'Good visual sense, storytelling ability, and interest in technology, robotics, AI, and education.',
          'Reliability, file organization, social media awareness, and comfort working around active lab projects.'
        ]
      },
      {
        title: 'Expected Outcomes',
        items: [
          'Regular raw and edited media assets for lab activities, demos, workshops, and student projects.',
          'Managed social media updates that promote MakerWorks Lab work clearly and professionally.',
          'Organized media library, captions, post drafts, publishing calendar, and reusable content assets.'
        ]
      }
    ]
  },
  {
    slug: 'design-engineering-intern',
    title: 'Design Engineering Intern',
    subtitle: 'CAD, prototyping, mechanisms, fabrication',
    openings: '2 openings',
    openingsNumber: 2,
    mode: 'Onsite',
    icon: 'bi-bezier2',
    accent: 'design',
    suitableFor: 'Mechanical, Production, Mechatronics, Robotics, Product Design, and students interested in design engineering.',
    selectionFocus: 'CAD skill, practical design judgment, fabrication awareness, iteration, and ownership.',
    metaDescription: 'Apply for the Design Engineering Intern role at MakerWorks Lab, Mumbai. Work on CAD, prototyping, mechanisms, enclosures, learning kits, and product-style builds.',
    keywords: [
      'design engineering internship Mumbai',
      'CAD internship Mumbai',
      'mechanical design internship',
      'prototyping internship',
      'product design engineering internship'
    ],
    summary:
      'The Design Engineering Intern will work on the design, CAD modeling, prototyping, fabrication, and improvement of parts, mechanisms, enclosures, learning kits, fixtures, and product-style builds for MakerWorks Lab projects.',
    sections: [
      {
        title: 'Key Responsibilities',
        items: [
          'Create and refine CAD models, drawings, assemblies, enclosures, mounts, mechanisms, and product prototypes.',
          'Convert rough requirements into practical designs that can be fabricated, assembled, tested, and improved.',
          'Work with 3D printing, laser cutting, hand tools, fasteners, materials, and design-for-assembly decisions.',
          'Support robotics, electronics, teaching, and student project teams with mechanical design and prototyping needs.',
          'Check fit, tolerances, durability, serviceability, and ease of manufacturing for lab prototypes.',
          'Maintain CAD files, drawings, BOM notes, fabrication settings, assembly instructions, and revision history.'
        ]
      },
      {
        title: 'Example Work Areas',
        items: [
          'Robot chassis, sensor mounts, enclosures, jigs, learning kits, classroom demo models, and competition mechanisms.',
          'Design-for-3D-printing, design-for-laser-cutting, tolerance checks, fastener selection, and assembly planning.',
          'Prototype review with robotics, electronics, teaching, and content teams to improve usability and presentation quality.'
        ]
      },
      {
        title: 'Preferred Skills',
        items: [
          'CAD exposure such as Fusion 360, SolidWorks, Onshape, AutoCAD, or similar tools.',
          'Interest in product design, mechanism design, fabrication, prototyping, and practical engineering.',
          'Ability to measure, assemble, test, revise, and learn from physical fit or tolerance issues.',
          'Careful handling of tools, machines, materials, shared lab equipment, and project documentation.'
        ]
      },
      {
        title: 'Expected Outcomes',
        items: [
          'Fabricated parts, assemblies, fixtures, enclosures, design files, and prototype-ready drawings.',
          'Improved prototype quality, faster build cycles, and smoother handoff between design, electronics, and fabrication.',
          'Clean design documentation, BOMs, assembly guides, revision notes, and reusable mechanical design assets.'
        ]
      }
    ]
  },
  {
    slug: 'ai-robotics-teaching-fellowship',
    title: 'AI & Robotics Teaching Fellowship',
    subtitle: 'Full-time teaching and research fellowship',
    openings: '2 openings',
    openingsNumber: 2,
    mode: 'Full-time, onsite',
    icon: 'bi-person-workspace',
    accent: 'teaching',
    suitableFor: 'Engineering, Science, Education, Robotics, AI/ML, Electronics, and candidates interested in teaching plus research.',
    selectionFocus: 'Teaching ability, technical fundamentals, student empathy, research interest, and full-time commitment.',
    metaDescription: 'Apply for the AI and Robotics Teaching Fellowship at MakerWorks Lab, Mumbai. Teach electronics, design, programming, AI, robotics, and DIY projects to school students.',
    keywords: [
      'AI robotics teaching fellowship Mumbai',
      'robotics teaching job Mumbai',
      'STEM teaching fellowship',
      'electronics teaching fellowship',
      'robotics mentor job'
    ],
    summary:
      'The AI and Robotics Teaching Fellowship is a full-time teaching and research fellowship. Fellows will teach middle school and high school students electronics, design, programming, robotics, AI concepts, and DIY project building while also contributing to research, competitions, curriculum, and lab development.',
    sections: [
      {
        title: 'Key Responsibilities',
        items: [
          'Teach middle school and high school students electronics, design, programming, robotics, AI, and maker skills.',
          'Help students build DIY projects, prototypes, robots, circuits, and competition-ready systems.',
          'Guide students for competitions, demos, exhibitions, school programs, workshops, and project showcases.',
          'Prepare lesson plans, worksheets, kits, project briefs, rubrics, demos, and classroom/lab activities.',
          'Support research and development around AI, robotics education, hands-on learning, and lab curriculum.',
          'Coordinate with schools, parents, mentors, interns, and lab staff to ensure smooth student learning experiences.'
        ]
      },
      {
        title: 'Example Work Areas',
        items: [
          'Intro electronics, Arduino/ESP32 projects, Scratch/Python programming, robotics builds, AI demos, and design challenges.',
          'Competition preparation, project reviews, student portfolios, parent demos, school showcases, and lab exhibitions.',
          'Curriculum experiments that connect hands-on projects with AI, robotics, design thinking, and real engineering practice.'
        ]
      },
      {
        title: 'Preferred Skills',
        items: [
          'Strong communication and ability to teach technical topics to young learners with patience and clarity.',
          'Hands-on comfort with electronics, programming, robotics, design, fabrication, or DIY project building.',
          'Experience mentoring students, conducting workshops, or participating in competitions is a plus.',
          'Interest in AI, robotics education, curriculum building, student outcomes, and applied research.'
        ]
      },
      {
        title: 'Expected Outcomes',
        items: [
          'Students completing meaningful DIY projects, competition builds, demos, and hands-on learning milestones.',
          'Teaching resources, project kits, curriculum notes, worksheets, session plans, and student progress records.',
          'Research and documentation that improves MakerWorks Lab teaching methods and AI/robotics learning programs.'
        ]
      }
    ]
  },
  {
    slug: 'growth-partnerships-intern',
    title: 'Growth & Partnerships Intern',
    subtitle: 'Outreach, calls, demos, visits, partnerships',
    openings: '2 openings',
    openingsNumber: 2,
    mode: 'Remote / Hybrid',
    location: 'Remote / MakerWorks Lab touchpoints as required',
    icon: 'bi-megaphone-fill',
    accent: 'growth',
    suitableFor: 'Management, Marketing, Business, Communication, Engineering, and students interested in startup growth.',
    selectionFocus: 'Communication, follow-up discipline, call confidence, trustworthiness, and outcome orientation.',
    metaDescription: 'Apply for the Growth and Partnerships Intern role at MakerWorks Lab. Reach out to prospects, schedule calls, coordinate visits and demos, and grow MWL programs.',
    keywords: [
      'growth internship Mumbai',
      'partnerships internship',
      'education sales internship',
      'startup growth internship',
      'school outreach internship'
    ],
    summary:
      'The Growth and Partnerships Intern will reach out to people about MakerWorks Lab programs and offers, get prospects onto calls, provide clear information, help them decide, and support in-person visits, demos, and follow-ups.',
    sections: [
      {
        title: 'Key Responsibilities',
        items: [
          'Research and reach out to schools, parents, colleges, partners, corporates, potential customers, and ecosystem contacts.',
          'Explain MakerWorks Lab programs, workshops, internships, fellowships, demos, labs, and offers clearly.',
          'Get interested prospects onto calls and provide information that helps them make a decision.',
          'Accommodate and coordinate in-person visits, lab tours, demos, meetings, and follow-up conversations.',
          'Maintain CRM sheets, lead status, contact details, call notes, email drafts, follow-ups, and weekly reports.',
          'Protect contact lists, pricing, partner conversations, customer information, and internal business data.'
        ]
      },
      {
        title: 'Example Work Areas',
        items: [
          'School outreach, parent inquiries, college collaborations, partner demos, workshop leads, and local ecosystem mapping.',
          'Call scripts, WhatsApp follow-ups, email drafts, visit scheduling, demo coordination, and feedback collection.',
          'Weekly reporting on leads, call outcomes, objections, visit interest, conversion blockers, and next actions.'
        ]
      },
      {
        title: 'Preferred Skills',
        items: [
          'Clear verbal and written communication in English; Hindi or Marathi is a plus for local outreach.',
          'Comfort with calling, email, WhatsApp, LinkedIn, spreadsheets, follow-ups, and professional coordination.',
          'Interest in education, technology, startups, partnerships, sales, and community building.',
          'Persistence, maturity, confidentiality, and ability to update status without being chased.'
        ]
      },
      {
        title: 'Expected Outcomes',
        items: [
          'More qualified calls, visits, demos, and follow-ups for MakerWorks Lab programs and offers.',
          'Updated lead tracker, outreach logs, call summaries, prospect notes, and weekly progress reports.',
          'Clearer pipeline of schools, parents, partners, customers, and ecosystem opportunities.'
        ]
      }
    ]
  }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function detailsFor(role) {
  return {
    Openings: role.openings,
    Mode: role.mode,
    Location: role.location || DEFAULT_DETAILS.location,
    Stipend: DEFAULT_DETAILS.stipend,
    Duration: DEFAULT_DETAILS.duration,
    Commitment: DEFAULT_DETAILS.commitment,
    Reporting: DEFAULT_DETAILS.reporting
  };
}

function roleUrl(role) {
  return `${SITE_URL}/hiring/roles/${role.slug}/`;
}

function visibleList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function jobDescriptionHtml(role) {
  const details = detailsFor(role);
  return [
    `<p>${escapeHtml(role.summary)}</p>`,
    `<p>Openings: ${escapeHtml(role.openings)}. Mode: ${escapeHtml(role.mode)}. Location: ${escapeHtml(details.Location)}. Stipend: ${escapeHtml(DEFAULT_DETAILS.stipend)}. Duration: ${escapeHtml(DEFAULT_DETAILS.duration)}. Commitment: ${escapeHtml(DEFAULT_DETAILS.commitment)}.</p>`,
    ...role.sections.map((section) => `<p>${escapeHtml(section.title)}</p>${visibleList(section.items)}`),
    `<p>Suitable for: ${escapeHtml(role.suitableFor)}</p>`,
    `<p>Selection focus: ${escapeHtml(role.selectionFocus)}</p>`,
    `<p>Apply through the MakerWorks Lab application form.</p>`
  ].join('');
}

function jobPostingSchema(role) {
  const isTeaching = role.slug === 'ai-robotics-teaching-fellowship';
  const details = detailsFor(role);
  const schema = {
    '@type': 'JobPosting',
    title: role.title,
    description: jobDescriptionHtml(role),
    identifier: {
      '@type': 'PropertyValue',
      name: 'MakerWorks Lab',
      value: `MWL-${role.slug.toUpperCase()}-2026`
    },
    datePosted: DATE_POSTED,
    employmentType: isTeaching ? 'FULL_TIME' : 'INTERN',
    totalJobOpenings: role.openingsNumber,
    directApply: false,
    industry: 'AI, Robotics, STEM Education, Hardware Prototyping',
    occupationalCategory: role.subtitle,
    hiringOrganization: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      sameAs: ORGANIZATION.url,
      logo: ORGANIZATION.logo
    },
    jobLocation: {
      '@type': 'Place',
      name: details.Location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN'
      }
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        value: 10000,
        unitText: 'MONTH'
      }
    },
    workHours: DEFAULT_DETAILS.commitment,
    educationRequirements: role.suitableFor,
    experienceRequirements: role.selectionFocus,
    responsibilities: role.sections.find((section) => section.title === 'Key Responsibilities').items.join(' '),
    skills: role.sections.find((section) => section.title === 'Preferred Skills').items,
    qualifications: role.sections.find((section) => section.title === 'Preferred Skills').items.join(' '),
    url: roleUrl(role),
    applicationContact: {
      '@type': 'ContactPoint',
      contactType: 'recruiting',
      email: ORGANIZATION.email,
      url: APPLY_URL
    }
  };
  return schema;
}

function breadcrumbSchema(role) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Hiring',
        item: `${SITE_URL}/hiring/`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: role.title,
        item: roleUrl(role)
      }
    ]
  };
}

function baseHead({ title, description, canonical, keywords, ogType = 'website', jsonLd = [] }) {
  const image = `${SITE_URL}/gallery/galleryphotos/preparation%20for%20competition.webp`;
  const jsonScripts = jsonLd.map((data) => `<script type="application/ld+json">
${JSON.stringify(data, null, 2)}
  </script>`).join('\n');

  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <meta name="keywords" content="${escapeAttr(keywords.join(', '))}">
  <link rel="canonical" href="${escapeAttr(canonical)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta property="og:type" content="${escapeAttr(ogType)}">
  <meta property="og:url" content="${escapeAttr(canonical)}">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${image}">
  <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.webp">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.webp">
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  <link rel="stylesheet" href="/styles.css">
  <script src="/components.js" defer></script>
  ${jsonScripts}`;
}

function sharedStyles() {
  return `<style>
    :root {
      --career-ink: #111827;
      --career-muted: #5f6b7a;
      --career-line: #e5e7eb;
      --career-soft: #f8fafc;
      --career-blue: #0d6efd;
      --career-orange: #ff6600;
      --career-green: #0f766e;
      --career-purple: #6f42c1;
    }

    body {
      background: #ffffff;
      color: var(--career-ink);
      font-family: "Segoe UI", sans-serif;
    }

    .career-page {
      padding-top: 6rem;
    }

    .career-hero {
      background: linear-gradient(135deg, #f8fbff 0%, #fff7ed 100%);
      border-bottom: 1px solid var(--career-line);
      padding: clamp(4rem, 9vw, 7rem) 0 4rem;
    }

    .career-kicker {
      color: var(--career-blue);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .career-title {
      font-size: clamp(2.4rem, 6vw, 5.3rem);
      font-weight: 900;
      letter-spacing: -0.05em;
      line-height: 0.96;
      margin: 0.85rem 0 1.1rem;
    }

    .career-copy {
      color: var(--career-muted);
      font-size: 1.08rem;
      line-height: 1.75;
      max-width: 820px;
    }

    .career-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-top: 1.7rem;
    }

    .career-btn {
      align-items: center;
      border-radius: 999px;
      display: inline-flex;
      font-weight: 800;
      gap: 0.5rem;
      justify-content: center;
      min-height: 3rem;
      padding: 0.82rem 1.1rem;
      text-decoration: none;
    }

    .career-btn.primary {
      background: var(--career-blue);
      color: #fff;
    }

    .career-btn.secondary {
      background: #fff;
      border: 1px solid var(--career-line);
      color: var(--career-ink);
    }

    .stats-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-top: 2.5rem;
    }

    .stat-box,
    .detail-box,
    .content-box,
    .role-card {
      background: #fff;
      border: 1px solid var(--career-line);
      border-radius: 18px;
      box-shadow: 0 14px 35px rgba(15, 23, 42, 0.05);
    }

    .stat-box {
      padding: 1.1rem;
    }

    .stat-box strong {
      color: var(--career-blue);
      display: block;
      font-size: 1.8rem;
      line-height: 1;
    }

    .stat-box span {
      color: var(--career-muted);
      display: block;
      font-size: 0.88rem;
      font-weight: 700;
      margin-top: 0.45rem;
    }

    .section-pad {
      padding: 4.5rem 0;
    }

    .section-title {
      font-size: clamp(1.8rem, 4vw, 3.1rem);
      font-weight: 900;
      letter-spacing: -0.04em;
      line-height: 1.05;
      margin-bottom: 0.9rem;
    }

    .section-copy {
      color: var(--career-muted);
      line-height: 1.75;
      max-width: 780px;
    }

    .roles-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-top: 2rem;
    }

    .role-card {
      color: inherit;
      display: grid;
      gap: 1rem;
      padding: 1.35rem;
      text-decoration: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .role-card:hover,
    .role-card:focus-visible {
      border-color: rgba(13, 110, 253, 0.42);
      box-shadow: 0 22px 50px rgba(15, 23, 42, 0.1);
      color: inherit;
      transform: translateY(-2px);
    }

    .role-top {
      align-items: start;
      display: flex;
      gap: 1rem;
    }

    .role-icon {
      align-items: center;
      border-radius: 15px;
      color: #fff;
      display: inline-flex;
      flex: 0 0 auto;
      font-size: 1.25rem;
      height: 3rem;
      justify-content: center;
      width: 3rem;
    }

    .accent-ai { background: linear-gradient(135deg, var(--career-blue), var(--career-purple)); }
    .accent-robotics { background: linear-gradient(135deg, var(--career-orange), #f59e0b); }
    .accent-pcb { background: linear-gradient(135deg, var(--career-green), #84cc16); }
    .accent-media { background: linear-gradient(135deg, #06b6d4, var(--career-blue)); }
    .accent-design { background: linear-gradient(135deg, #ec4899, var(--career-orange)); }
    .accent-teaching { background: linear-gradient(135deg, #8b5cf6, #0ea5e9); }
    .accent-growth { background: linear-gradient(135deg, #10b981, #06b6d4); }

    .role-card h2,
    .role-card h3 {
      font-size: 1.35rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin: 0 0 0.25rem;
    }

    .role-card p {
      color: var(--career-muted);
      line-height: 1.65;
      margin: 0;
    }

    .pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .pill {
      background: var(--career-soft);
      border: 1px solid var(--career-line);
      border-radius: 999px;
      color: #334155;
      font-size: 0.78rem;
      font-weight: 800;
      padding: 0.45rem 0.7rem;
    }

    .mini-list {
      color: #475569;
      display: grid;
      gap: 0.45rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .mini-list li {
      display: flex;
      gap: 0.45rem;
      line-height: 1.5;
    }

    .mini-list i {
      color: var(--career-blue);
      margin-top: 0.2rem;
    }

    .role-cta-text {
      color: var(--career-blue);
      font-weight: 900;
    }

    .detail-layout {
      display: grid;
      gap: 1.2rem;
      grid-template-columns: 0.82fr 1.18fr;
    }

    .detail-box {
      padding: 1.2rem;
    }

    .detail-list {
      display: grid;
      gap: 0.7rem;
      margin: 0;
    }

    .detail-list div {
      border-bottom: 1px solid var(--career-line);
      padding-bottom: 0.7rem;
    }

    .detail-list div:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .detail-list dt {
      color: #94a3b8;
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .detail-list dd {
      color: #263241;
      font-weight: 800;
      margin: 0.2rem 0 0;
    }

    .content-box {
      padding: 1.4rem;
    }

    .content-box + .content-box {
      margin-top: 1rem;
    }

    .content-box h2 {
      font-size: 1.25rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin-bottom: 0.75rem;
    }

    .content-box ul {
      color: #475569;
      line-height: 1.68;
      margin: 0;
      padding-left: 1.15rem;
    }

    .content-box li + li {
      margin-top: 0.35rem;
    }

    .note-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 16px;
      color: #1e3a8a;
      font-weight: 700;
      line-height: 1.65;
      padding: 1rem;
    }

    @media (max-width: 991px) {
      .stats-grid,
      .roles-grid,
      .detail-layout {
        grid-template-columns: 1fr;
      }

      .career-page {
        padding-top: 5.2rem;
      }
    }
  </style>`;
}

function indexSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: ORGANIZATION.name,
        url: ORGANIZATION.url,
        logo: ORGANIZATION.logo,
        email: ORGANIZATION.email
      },
      {
        '@type': 'ItemList',
        name: 'MakerWorks Lab open internship and fellowship roles',
        itemListElement: roles.map((role, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: role.title,
          url: roleUrl(role)
        }))
      }
    ]
  };
}

function roleCard(role) {
  const detail = detailsFor(role);
  const sampleItems = role.sections.find((section) => section.title === 'Key Responsibilities').items.slice(0, 3);
  return `<a class="role-card" href="/hiring/roles/${role.slug}/" target="_blank" rel="noopener" aria-label="Open ${escapeAttr(role.title)} full job description in a new tab">
    <div class="role-top">
      <span class="role-icon accent-${role.accent}"><i class="bi ${role.icon}"></i></span>
      <div>
        <h2>${escapeHtml(role.title)}</h2>
        <p>${escapeHtml(role.summary)}</p>
      </div>
    </div>
    <div class="pill-row">
      <span class="pill">${escapeHtml(role.openings)}</span>
      <span class="pill">${escapeHtml(role.mode)}</span>
      <span class="pill">${escapeHtml(DEFAULT_DETAILS.stipend)}</span>
      <span class="pill">${escapeHtml(detail.Location)}</span>
    </div>
    <ul class="mini-list">
      ${sampleItems.map((item) => `<li><i class="bi bi-check-circle-fill"></i><span>${escapeHtml(item)}</span></li>`).join('')}
    </ul>
    <span class="role-cta-text">View full role in a new tab <i class="bi bi-box-arrow-up-right"></i></span>
  </a>`;
}

function indexPage() {
  const totalOpenings = roles.reduce((sum, role) => sum + role.openingsNumber, 0);
  const head = baseHead({
    title: 'MakerWorks Lab Hiring | AI, Robotics, Electronics, Teaching, Media and Growth Roles',
    description: 'Apply for MakerWorks Lab internships and fellowships in AI research, autonomous robotics, electronics and PCB design, design engineering, AI and robotics teaching, technical media, and growth partnerships.',
    canonical: `${SITE_URL}/hiring/`,
    keywords: [
      'MakerWorks Lab hiring',
      'robotics internship Mumbai',
      'AI internship Mumbai',
      'PCB design internship Mumbai',
      'AI robotics teaching fellowship',
      'technical media internship',
      'growth partnerships internship'
    ],
    jsonLd: [indexSchema()]
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${head}
  ${sharedStyles()}
</head>
<body>
  <div id="navbar-placeholder"></div>
  <main class="career-page">
    <section class="career-hero">
      <div class="container">
        <p class="career-kicker">MakerWorks Lab Hiring</p>
        <h1 class="career-title">Build, teach, document, and grow real AI and robotics work.</h1>
        <p class="career-copy">We are hiring ${totalOpenings} people across 7 focused roles at MakerWorks Lab. Each role below links to a dedicated, crawlable job page with full responsibilities, skills, outcomes, stipend, location, and application details.</p>
        <div class="career-actions">
          <a class="career-btn primary" href="${APPLY_URL}" target="_blank" rel="noopener noreferrer">Apply Now <i class="bi bi-arrow-right"></i></a>
          <a class="career-btn secondary" href="#open-roles">View Open Roles <i class="bi bi-list-check"></i></a>
        </div>
        <div class="stats-grid">
          <div class="stat-box"><strong>${totalOpenings}</strong><span>Total openings</span></div>
          <div class="stat-box"><strong>7</strong><span>Role tracks</span></div>
          <div class="stat-box"><strong>INR 10k</strong><span>Monthly stipend</span></div>
          <div class="stat-box"><strong>Mumbai</strong><span>Primary lab location</span></div>
        </div>
      </div>
    </section>

    <section class="section-pad" id="open-roles">
      <div class="container">
        <p class="career-kicker">Open Roles</p>
        <h2 class="section-title">Choose a role and open the full description.</h2>
        <p class="section-copy">Role cards open in a new tab so applicants, TPO teams, job boards, and AI agents can link directly to the exact job page.</p>
        <div class="roles-grid">
          ${roles.map(roleCard).join('\n')}
        </div>
      </div>
    </section>

    <section class="section-pad pt-0">
      <div class="container">
        <div class="content-box">
          <h2>Application Process</h2>
          <p class="section-copy mb-3">Applicants should submit the form with their target role, resume or LinkedIn profile, GitHub or portfolio links where relevant, project videos if available, and a short note about why they want to join MakerWorks Lab.</p>
          <a class="career-btn primary" href="${APPLY_URL}" target="_blank" rel="noopener noreferrer">Open Application Form <i class="bi bi-box-arrow-up-right"></i></a>
        </div>
      </div>
    </section>
  </main>
  <div id="footer-placeholder"></div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}

function detailRows(role) {
  return Object.entries(detailsFor(role)).map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
}

function rolePage(role) {
  const details = detailsFor(role);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      jobPostingSchema(role),
      breadcrumbSchema(role)
    ]
  };
  const head = baseHead({
    title: `${role.title} | MakerWorks Lab Hiring`,
    description: role.metaDescription,
    canonical: roleUrl(role),
    keywords: role.keywords,
    ogType: 'article',
    jsonLd: [schema]
  });
  const otherRoles = roles.filter((candidate) => candidate.slug !== role.slug).slice(0, 3);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${head}
  ${sharedStyles()}
</head>
<body>
  <div id="navbar-placeholder"></div>
  <main class="career-page">
    <section class="career-hero">
      <div class="container">
        <p class="career-kicker">Open Role | ${escapeHtml(role.openings)}</p>
        <h1 class="career-title">${escapeHtml(role.title)}</h1>
        <p class="career-copy">${escapeHtml(role.summary)}</p>
        <div class="career-actions">
          <a class="career-btn primary" href="${APPLY_URL}" target="_blank" rel="noopener noreferrer">Apply for this role <i class="bi bi-arrow-right"></i></a>
          <a class="career-btn secondary" href="/hiring/">Back to all roles <i class="bi bi-grid"></i></a>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container">
        <div class="detail-layout">
          <aside class="detail-box">
            <h2 class="h4 fw-bold mb-3">Role Details</h2>
            <dl class="detail-list">${detailRows(role)}</dl>
            <div class="note-box mt-3">
              <div><strong>Suitable for:</strong> ${escapeHtml(role.suitableFor)}</div>
              <div class="mt-2"><strong>Selection focus:</strong> ${escapeHtml(role.selectionFocus)}</div>
            </div>
          </aside>
          <article>
            ${role.sections.map((section) => `<section class="content-box">
              <h2>${escapeHtml(section.title)}</h2>
              ${visibleList(section.items)}
            </section>`).join('\n')}
            <section class="content-box">
              <h2>How to Apply</h2>
              <p class="section-copy mb-3">Submit the MakerWorks Lab application form with the role name, relevant project links, proof of work, resume or LinkedIn profile, and a short introduction. The application form opens in Google Forms.</p>
              <a class="career-btn primary" href="${APPLY_URL}" target="_blank" rel="noopener noreferrer">Apply Now <i class="bi bi-box-arrow-up-right"></i></a>
            </section>
          </article>
        </div>
      </div>
    </section>

    <section class="section-pad pt-0">
      <div class="container">
        <p class="career-kicker">Other Open Roles</p>
        <div class="roles-grid">
          ${otherRoles.map(roleCard).join('\n')}
        </div>
      </div>
    </section>
  </main>
  <div id="footer-placeholder"></div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}

function writePages() {
  fs.mkdirSync(ROLES_DIR, { recursive: true });
  fs.writeFileSync(path.join(HIRING_DIR, 'index.html'), indexPage(), 'utf8');
  for (const role of roles) {
    const dir = path.join(ROLES_DIR, role.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), rolePage(role), 'utf8');
  }
}

function sitemapEntries() {
  return [
    '  <url>',
    `    <loc>${SITE_URL}/hiring/</loc>`,
    `    <lastmod>${LASTMOD}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.9</priority>',
    '  </url>',
    '',
    ...roles.flatMap((role) => [
      '  <url>',
      `    <loc>${roleUrl(role)}</loc>`,
      `    <lastmod>${LASTMOD}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      ''
    ])
  ].join('\n');
}

function updateSitemap() {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  xml = xml.replace(/\n\s*<url>\s*\n\s*<loc>https:\/\/makerworkslab\.in\/hiring\/<\/loc>[\s\S]*?\n\s*<\/url>/, '');
  xml = xml.replace(/\n\s*<url>\s*\n\s*<loc>https:\/\/makerworkslab\.in\/hiring\/roles\/[\s\S]*?\n\s*<\/url>/g, '');
  xml = xml.replace(/\n\s*<!-- Blog -->/, `\n\n  <!-- Hiring -->\n${sitemapEntries()}\n  <!-- Blog -->`);
  fs.writeFileSync(sitemapPath, xml, 'utf8');
}

function updateLlmTxt() {
  const llmPath = path.join(ROOT, 'llm.txt');
  let content = fs.readFileSync(llmPath, 'utf8');
  content = content.replace(/\n## Hiring[\s\S]*?(?=\n## |\n?$)/, '');
  const lines = [
    '',
    '## Hiring',
    `MakerWorks Lab has ${roles.reduce((sum, role) => sum + role.openingsNumber, 0)} open internship and fellowship positions across AI, robotics, electronics, design, teaching, media, and growth.`,
    '- Main hiring page: https://makerworkslab.in/hiring/',
    ...roles.map((role) => `- ${role.title} (${role.openings}): ${roleUrl(role)}`),
    ''
  ];
  fs.writeFileSync(llmPath, `${content.trimEnd()}\n${lines.join('\n')}`, 'utf8');
}

writePages();
updateSitemap();
updateLlmTxt();

console.log(`Generated hiring index and ${roles.length} role pages.`);
