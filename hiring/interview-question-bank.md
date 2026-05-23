# MakerWorks Lab Hiring Question Bank

Use this as a practical interviewer guide for the roles listed on `hiring/index.html`.

Roles covered:

- AI Research Intern: 2 openings
- Autonomous Robotics Intern: 2 openings
- Electronics & PCB Design Intern: 2 openings
- Technical Media & Content Intern: 1 opening
- Design Engineering Intern: 1 opening
- AI & Robotics Teaching Fellowship: 2 openings
- Growth & Partnerships Intern: 1 opening

Total target hiring count: 11 people across 7 role tracks.

## How To Use This

Run the process in three stages:

1. Application screen: 5-10 minutes per profile.
2. First screening call: 15-20 minutes.
3. Role interview: 35-60 minutes, including a small live exercise or portfolio walkthrough.

Keep the process consistent. Ask the same core questions to candidates for the same role, score the answers, and write short notes immediately after the call.

Avoid questions about age, caste, religion, marital status, family plans, disability, political views, or anything unrelated to the role.

## Universal Screening Questions

Ask these for every candidate before role-specific questions.

1. Which role are you applying for, and why this one?
2. What is the strongest project you have built, shipped, taught, designed, edited, or sold?
3. What exactly did you do in that project, not the team in general?
4. What was the hardest problem in that project, and how did you solve it?
5. What tools, languages, hardware, or workflows are you strongest with right now?
6. What are you actively learning this month?
7. Can you commit to the role duration and expected work mode listed on the hiring page?
8. Are you comfortable working in a small lab where tasks can change quickly?
9. Show or send one proof of work: GitHub, CAD file, video, portfolio, edited reel, campaign, lesson material, or outreach tracker.
10. If selected, what would you want to build or contribute in your first two weeks?

### Universal Scorecard

Score each category from 1 to 5.

| Category | What To Look For |
| --- | --- |
| Proof of work | Has built, shipped, taught, designed, edited, documented, or sold something real. |
| Ownership | Can clearly explain their own contribution, decisions, and mistakes. |
| Learning speed | Learns independently and can describe how they debug or improve. |
| Communication | Explains work clearly without hiding behind buzzwords. |
| Fit for lab pace | Comfortable with hands-on execution, ambiguity, and fast iteration. |

Decision guide:

- 22-25: Strong hire signal.
- 18-21: Continue if role skills are promising.
- 14-17: Maybe, only if one area is exceptional.
- Below 14: Reject unless there is a special reason.

## AI Research Intern

Role focus: agentic AI, language and vision models, fine-tuning smaller models, physical AI workflows, robotics integration.

### Application Screen

Look for:

- Python experience.
- Projects using LLMs, vision models, agents, RAG, fine-tuning, robotics, sensors, or automation.
- GitHub, notebooks, demos, papers, technical writeups, or working prototypes.
- Ability to explain model choices and failure cases.

Weak signals:

- Only course certificates with no implementation.
- Uses AI buzzwords but cannot explain data, evaluation, prompts, inference, or deployment.
- No proof of independent building.

### Screening Questions

1. Tell me about one AI project you built end to end.
2. What model did you use, and why did you choose it?
3. How did you evaluate whether the model was actually working?
4. What is the difference between prompting, RAG, and fine-tuning?
5. Have you used Python APIs for LLMs or vision models? Walk me through the flow.
6. If a robot needs to follow natural-language commands, what components would you design?
7. What is one AI paper, repo, or tool you recently studied?
8. What would you do if a model works in a notebook but fails in a real robot demo?

### Interview Questions

1. Explain how you would build an AI agent that receives a task, checks sensor state, decides next action, and calls robot-control functions.
2. What are the risks of letting an LLM directly control hardware? How would you reduce them?
3. How would you design an evaluation set for a vision model that detects objects on a robotics workbench?
4. When would you use a small local model instead of a large cloud model?
5. Explain latency, memory, and accuracy tradeoffs for edge AI deployment.
6. How would you debug hallucinated tool calls in an agentic workflow?
7. What logs would you collect from an AI-controlled robot?
8. How would you combine camera input, language instructions, and motor commands?
9. Suppose a model performs well in daylight but fails under lab lighting. What would you test?
10. Describe a time you got stuck on an AI or coding problem and how you unblocked yourself.

### Practical Exercise

Give the candidate 20-30 minutes.

Prompt:

"Design a simple agentic workflow for a mobile robot that can receive the command: `Find the red object, move near it, and stop if an obstacle is detected.` List the modules, data flow, safety checks, and failure cases."

Good answer includes:

- Perception module.
- Planning or policy layer.
- Tool or function calls.
- Obstacle safety check independent of LLM output.
- Logging and fallback states.
- Evaluation plan.

## Autonomous Robotics Intern

Role focus: physical robot builds, UAVs, competitive robotics, circuits, Arduino/Raspberry Pi, sensors, PCB prototypes, soldering, testing.

### Application Screen

Look for:

- Built hardware, robots, electronics, drones, competition bots, IoT projects, or embedded systems.
- Experience with Arduino, Raspberry Pi, ESP32, sensors, motors, motor drivers, batteries, soldering, CAD, or PCB tools.
- Photos, videos, schematics, code, competition participation, or build logs.

Weak signals:

- Can talk theory but has not wired, tested, broken, or repaired hardware.
- Cannot explain basic current, voltage, motor drivers, sensor noise, or debugging.
- No visible proof of builds.

### Screening Questions

1. What is the most complex physical thing you have built?
2. Which microcontrollers or single-board computers have you used?
3. What sensors and actuators have you worked with?
4. Explain a hardware failure you faced and how you debugged it.
5. Have you soldered, designed PCBs, or assembled circuits from scratch?
6. How do you choose a motor and motor driver for a robot?
7. What safety checks do you follow when working with batteries and motors?
8. What robotics competition, if any, have you participated in?

### Interview Questions

1. Design a line-following robot for a competition. What hardware, sensors, and control logic would you use?
2. Explain PWM to a beginner, then explain how it is used for motor speed control.
3. What is the difference between using Arduino and Raspberry Pi in a robot?
4. A robot turns left correctly but fails to turn right. How would you debug it?
5. A distance sensor gives noisy readings. What could cause this, and how would you fix it?
6. How do you estimate battery requirements for a mobile robot?
7. Explain how you would test a new PCB before connecting expensive components.
8. What is PID control? Where would you use it?
9. How would you make a competition robot easier to repair under time pressure?
10. Describe a build where the first prototype failed. What changed in the next version?

### Practical Exercise

Give the candidate 20-30 minutes.

Prompt:

"Design a small autonomous robot that avoids obstacles and can run for 30 minutes. List the components, wiring approach, control loop, test plan, and the first five failure modes you would check."

Good answer includes:

- Microcontroller or SBC choice with reason.
- Motor driver, motors, battery, sensors.
- Power budget awareness.
- Basic control loop.
- Mechanical mounting considerations.
- Debug plan using staged testing.

## Electronics & PCB Design Intern

Role focus: circuit design, PCB layout, embedded electronics, sensors, motor-control interfaces, power systems, soldering, board bring-up, testing, and debugging.

### Application Screen

Look for:

- Experience with KiCad, EasyEDA, Altium, Eagle, Proteus, LTspice, Multisim, or similar tools.
- Past circuits, schematics, PCB layouts, soldered boards, sensor boards, motor driver boards, IoT devices, power circuits, or embedded projects.
- Comfort reading datasheets and checking pinouts, footprints, current ratings, voltage levels, and connector choices.
- Photos, videos, Gerber files, schematics, GitHub repos, lab notes, or board bring-up logs.

Weak signals:

- Only copied Arduino wiring diagrams with no understanding of why the circuit works.
- Cannot explain voltage, current, pull-up resistors, decoupling capacitors, ground, or basic protection.
- Has made a PCB layout but never checked footprints, DRC, power paths, or manufacturability.

### Screening Questions

1. Walk me through the most complex circuit or PCB you have designed or assembled.
2. Which PCB or circuit simulation tools have you used?
3. Have you ordered or fabricated a PCB before? What went right or wrong?
4. How do you choose component footprints and verify pinouts?
5. What test equipment have you used: multimeter, oscilloscope, logic analyzer, power supply, hot air, soldering station?
6. Explain a hardware debugging problem you solved.
7. How would you protect a microcontroller input connected to the outside world?
8. What is one electronics topic you are currently trying to understand better?

### Interview Questions

1. Design a simple sensor board for a robot. What blocks would be on the schematic?
2. What checks do you perform before sending a PCB for fabrication?
3. Explain the purpose of decoupling capacitors and where you would place them.
4. What is the difference between analog ground, digital ground, and practical grounding on a small student robot board?
5. A PCB powers on, but the microcontroller does not boot. How would you debug it?
6. How do you decide trace width for motor current or power paths?
7. What mistakes can happen when selecting connectors for a robotics build?
8. How would you design a board so students or interns can repair it easily?
9. What is I2C, and what common hardware problems can break it?
10. Describe how you would document a PCB so another team member can assemble and test it.

### Practical Exercise

Give the candidate 20-30 minutes.

Prompt:

"Design a small PCB for a mobile robot that connects a microcontroller, two motor drivers, an ultrasonic sensor, a battery input, and status LEDs. List the schematic blocks, connectors, protection choices, layout priorities, and board bring-up test plan."

Good answer includes:

- Power input and regulation thinking.
- Clear connector and pin-label strategy.
- Motor current and trace-width awareness.
- Decoupling and protection choices.
- Layout separation for noisy motor paths.
- Bring-up sequence before connecting motors.

## Technical Media & Content Intern

Role focus: documenting engineering builds, reels, shorts, long-form process content, technical storytelling, social media, fast capture and editing.

### Application Screen

Look for:

- Portfolio of edited videos, reels, photos, carousels, technical explainers, build documentation, or social pages.
- Ability to make technical work clear and interesting.
- Comfort shooting in a lab environment.
- Editing tools such as Premiere Pro, Final Cut, DaVinci Resolve, CapCut, Canva, Photoshop, Lightroom, or mobile workflows.

Weak signals:

- Only generic aesthetic edits with no story structure.
- No understanding of hooks, pacing, captions, retention, or audience.
- Not curious about engineering content.

### Screening Questions

1. Show me one video or post you are proud of. What was your role in it?
2. How do you decide the hook for a short-form video?
3. How would you explain a robot build to a 13-year-old and to a parent?
4. Which editing tools are you fastest with?
5. How do you organize raw footage from a busy shoot day?
6. What social platforms have you managed or posted for?
7. How do you measure whether a piece of content worked?
8. Are you comfortable asking engineers questions while they build?

### Interview Questions

1. If a robotics prototype fails during filming, how would you still turn that day into useful content?
2. What shots would you capture during a UAV build from parts to first test flight?
3. How would you plan one week of content for MakerWorks Lab?
4. What makes a technical reel feel credible instead of gimmicky?
5. How do you balance speed and quality when publishing frequently?
6. Write a 10-second hook for a video about a student building an obstacle-avoiding robot.
7. How would you turn one lab project into a Reel, a LinkedIn post, a carousel, and a YouTube short?
8. What is your process for subtitles, captions, and sound?
9. How do you handle feedback when an edit is technically inaccurate?
10. Describe a time you improved content after looking at analytics or audience response.

### Practical Exercise

Give the candidate 20-30 minutes.

Prompt:

"Create a content plan for a 60-second reel documenting a student robotics build. Include the hook, shot list, voiceover or caption outline, music/sound approach, and final call to action."

Good answer includes:

- Clear first 2-second hook.
- Visual progression from problem to build to result.
- Specific shots, not vague "show robot".
- Captions that explain technical points simply.
- A practical publishing angle.

## Design Engineering Intern

Role focus: product concepts, CAD, physical prototypes, enclosures, interfaces, fabrication, design for real AI and robotics projects.

### Application Screen

Look for:

- Portfolio with sketches, CAD, prototypes, product concepts, 3D prints, fabrication, interface design, or physical design systems.
- Evidence of iteration, not only final renders.
- Comfort working with engineers and constraints.
- Tools such as Fusion 360, SolidWorks, Rhino, Blender, Figma, Illustrator, KeyShot, 3D printing, laser cutting, or workshop tools.

Weak signals:

- Beautiful visuals with no practical reasoning.
- Cannot explain dimensions, materials, user needs, assembly, or manufacturability.
- No prototyping mindset.

### Screening Questions

1. Walk me through your strongest design or product project.
2. What problem were you solving, and who was the user?
3. What changed between the first concept and final prototype?
4. Which CAD, prototyping, or fabrication tools have you used?
5. Have you designed anything that was physically built?
6. How do you handle constraints from electronics, sensors, motors, or users?
7. How do you decide whether a design is ready to prototype?
8. What kind of design work do you want to get better at?

### Interview Questions

1. Design an enclosure for a small robot with sensors, wiring, and a removable battery. What do you consider?
2. How would you make a student-facing robotics kit easier to assemble?
3. What is the difference between a good-looking prototype and a usable prototype?
4. How do you collaborate with engineers who change hardware dimensions mid-project?
5. What tolerances do you think about for 3D printed parts?
6. How would you choose between 3D printing, laser cutting, and hand fabrication?
7. How would you test whether a physical product is intuitive for students?
8. Explain a design decision you made because of manufacturing or assembly constraints.
9. What details make a prototype feel polished?
10. Describe a time you received critique on your design and changed direction.

### Practical Exercise

Give the candidate 20-30 minutes.

Prompt:

"Sketch or describe a tabletop robot kit for students aged 10-14. Include form, materials, assembly approach, sensor placement, repairability, and how the design helps learning."

Good answer includes:

- User-aware decisions for children and mentors.
- Sensor visibility and protection.
- Cable management and access.
- Assembly and repair thinking.
- Iteration plan and test criteria.

## AI & Robotics Teaching Fellowship

Role focus: teaching AI, robotics, coding, electronics, project-based learning, classroom materials, parent updates, student progress.

### Application Screen

Look for:

- Teaching, mentoring, tutoring, workshop, camp, club, or competition coaching experience.
- Ability to explain technical ideas simply.
- Patience with young learners.
- Hands-on comfort with coding, electronics, robotics, AI tools, or maker projects.

Weak signals:

- Strong technical profile but no interest in explaining patiently.
- Overly lecture-heavy mindset.
- Cannot adapt explanation for different ages.

### Screening Questions

1. What age groups have you taught or mentored before?
2. Teach me a simple concept from robotics in one minute.
3. How would you handle a student who is excited but keeps breaking the build?
4. What technical topics can you teach confidently today?
5. What topics would you need to prepare before teaching?
6. How do you know whether a student has understood something?
7. How would you update parents on student progress?
8. Are you comfortable preparing worksheets, demos, and small challenges?

### Interview Questions

1. Explain sensors to a 10-year-old using an example.
2. How would you teach loops in coding through a robot activity?
3. A student copies code but does not understand it. What do you do?
4. A class has one advanced student and three beginners. How do you manage the session?
5. A robot demo fails in front of students. How do you turn that into a learning moment?
6. How would you structure a 90-minute session on obstacle-avoiding robots?
7. What makes a good project-based learning outcome?
8. How would you prepare students for a robotics competition without doing the work for them?
9. How do you balance fun, safety, and learning in a lab?
10. Tell me about a time you helped someone understand something difficult.

### Practical Exercise

Give the candidate 15-20 minutes.

Prompt:

"Prepare a mini lesson for students aged 11-13 on ultrasonic sensors. Include objective, demo, activity, questions to ask students, and one extension challenge."

Good answer includes:

- Clear learning objective.
- Simple analogy.
- Hands-on activity.
- Questions that check understanding.
- Differentiated challenge for faster learners.

## Growth & Partnerships Intern

Role focus: school outreach, partnerships, lead management, customer communication, program growth, remote execution.

### Application Screen

Look for:

- Sales, outreach, partnerships, event, campus ambassador, community, founder, or operations experience.
- Strong written communication.
- Comfort with spreadsheets, CRM-style tracking, cold emails, follow-ups, calls, and reporting.
- Interest in education, robotics, STEM, schools, or youth programs.

Weak signals:

- Says they are "good with people" but cannot show structured outreach.
- No follow-up discipline.
- Poor written communication.

### Screening Questions

1. Tell me about a time you convinced someone to join, buy, attend, partner, or respond.
2. How would you explain MakerWorks Lab to a school principal in 30 seconds?
3. Have you done cold outreach before? What channels did you use?
4. How do you track leads and follow-ups?
5. What would you include in a first email to a school?
6. How would you handle no response after two follow-ups?
7. What makes a partnership valuable for both sides?
8. Since this is remote, how will you report progress every day?

### Interview Questions

1. Create a target list strategy for schools in Mumbai for robotics workshops.
2. What information would you collect before contacting a school?
3. Role-play: I am a school coordinator. Pitch MakerWorks Lab in one minute.
4. A principal says robotics is too expensive. How do you respond?
5. A parent asks why their child should learn robotics instead of only coding. What do you say?
6. How would you prioritize 100 leads with limited time?
7. What metrics should we track for outreach success?
8. Write a follow-up message after a positive first call.
9. How would you build a partnership with a housing society, school, or corporate CSR team?
10. Describe a time you stayed organized across many small tasks.

### Practical Exercise

Give the candidate 20-30 minutes.

Prompt:

"Draft a short outreach email to a school principal introducing MakerWorks Lab robotics and AI programs. Include subject line, email body, and follow-up plan."

Good answer includes:

- Clear subject line.
- Specific value for school and students.
- Short, direct language.
- Credible call to action.
- Follow-up timing and tracker discipline.

## Quick Interview Packs

Use these when time is limited.

### 15-Minute Screen

1. Which role and why?
2. Walk me through your strongest proof of work.
3. What exactly did you personally do?
4. What was the hardest problem and how did you solve it?
5. Ask two role-specific questions from the relevant section.
6. Confirm availability, duration, and work mode.
7. Ask for one link or artifact after the call.

### 45-Minute Role Interview

1. 5 minutes: motivation and availability.
2. 10 minutes: portfolio or project walkthrough.
3. 15 minutes: role-specific technical or practical questions.
4. 10 minutes: live exercise.
5. 5 minutes: candidate questions and next steps.

### Reference Check Questions

Use only after candidate consent.

1. What work did the candidate actually own?
2. How reliable were they with deadlines and follow-ups?
3. How did they respond to feedback?
4. Would you work with or mentor them again?
5. What environment helps them do their best work?

## Final Hiring Recommendation Template

Candidate:

Role:

Proof of work reviewed:

Scores:

- Proof of work:
- Ownership:
- Learning speed:
- Communication:
- Fit for lab pace:
- Role-specific skill:

Strongest signals:

-

Concerns:

-

Decision:

- Hire / Hold / Reject

Suggested first project if hired:

-
