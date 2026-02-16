$file = "c:\Users\ajay8\Downloads\makerworks\programs\advanced\index.html"
$c = Get-Content $file -Raw

# ===== HEAD / META =====
$c = $c -replace 'Beginner Level Program', 'Advanced Level Program'
$c = $c -replace 'beginner-hero\.jpg', 'advanced-hero.jpg'
$c = $c -replace 'A fun and creative 2-year program for kids aged 7.10 to learn robotics, coding, and electronics through hands-on projects\.', 'An elite program for teens aged 15+ to master AI, ROS 2 robotics, and professional engineering with a portfolio for university applications.'
$c = $c -replace 'A fun and creative 2-year program for kids aged 7–10 to learn robotics, coding, and electronics through hands-on projects at MakerWorks\.', 'An elite program for teens aged 15+ to master AI, ROS 2 robotics, and professional engineering at MakerWorks.'
$c = $c -replace 'MakerWorks Beginner Level, robotics for kids Mumbai, coding for children, micro:bit classes Mumbai, STEM for kids, robotics projects, electronics for kids', 'MakerWorks Advanced Level, AI for teens Mumbai, ROS 2 classes, advanced robotics, STEM careers, Python ML, professional engineering'
$c = $c -replace 'Robotics \& Coding for Kids in Mumbai', 'AI & Robotics for Teens in Mumbai'
$c = $c -replace '/programs/beginner/', '/programs/advanced/'

# ===== CSS COLORS - change to deep purple/dark =====
$c = $c -replace '--primary: #ff6600;', '--primary: #6610f2;'
$c = $c -replace '--secondary: #0d6efd;', '--secondary: #0d6efd;'
$c = $c -replace '--dark: #1d1d1f;', '--dark: #0f172a;'
$c = $c -replace '--bg-offset: #fbfbfd;', '--bg-offset: #f8fafc;'
$c = $c -replace 'linear-gradient\(135deg, #ff9900 0%, #ff6600 100%\)', 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
$c = $c -replace 'rgba\(255, 102, 0,', 'rgba(102, 16, 242,'
$c = $c -replace '#ff9900', '#8b5cf6'
$c = $c -replace 'background: linear-gradient\(135deg, var\(--primary\), #ff9900\)', 'background: linear-gradient(135deg, var(--primary), #8b5cf6)'
$c = $c -replace 'background: linear-gradient\(180deg, #fff 0%, #fffbf5 100%\)', 'background: linear-gradient(180deg, #fff 0%, #f5f3ff 100%)'
$c = $c -replace 'rgba\(13, 110, 253,', 'rgba(102, 16, 242,'

# ===== HERO =====
$c = $c -replace 'class="beginner-hero"', 'class="beginner-hero hero-advanced"'
$c = $c -replace 'Maker Works Junior Program', 'Master Innovators: Advanced Engineering'
$c = $c -replace 'A fun-filled 2-year creative learning program for curious minds aged 8.10', 'Building future leaders in AI, ROS 2 robotics, and sustainable product engineering for ages 15+'
$c = $c -replace 'Junior%20Beginner%20Program', 'Advanced%20Program'
$c = $c -replace '>Enroll Now', '>Join the Elite'

# ===== PROGRAM INFO =====
$c = $c -replace '>Age Group<', '>Target Age<'
$c = $c -replace '>8 . 10 Years<', '>15+ Years<'
$c = $c -replace '8 – 10 Years', '15+ Years'
$c = $c -replace '>2 Years Course<', '>AI & ROS 2<'
$c = $c -replace '>2 Sessions/Week<', '>Work Portfolio<'
$c = $c -replace 'fa-clipboard-list', 'fa-briefcase'
$c = $c -replace '>Frequency<', '>Outcome<'
$c = $c -replace '>Duration<', '>Specialization<'
$c = $c -replace 'fa-calendar-alt', 'fa-brain'

# ===== ELIGIBILITY =====
$c = $c -replace '>Level: Absolute Beginner<', '>Level: Advanced<'
$c = $c -replace 'No prior experience in electronics or coding required\. We start from ground zero\.', 'Requires completion of Intermediate Level or equivalent proficiency in Arduino and Python.'
$c = $c -replace '>Age: 8.10 Years<', '>Age: 15+ Years<'
$c = $c -replace 'The curriculum is specifically tailored for the cognitive development of this age group\.', 'Designed for mature teens ready for university-level engineering concepts and professional tooling.'
$c = $c -replace '>Mindset: Curious<', '>Mindset: Innovator<'
$c = $c -replace 'A keen interest in learning how things work and built-in desire to explore new gadgets\.', 'A drive to solve real-world problems using AI, robotics, and cutting-edge technology.'
$c = $c -replace '>Tooling: Computer \& Net<', '>Tooling: Linux & ROS 2<'
$c = $c -replace 'Basic access to a computer for software exploration and simulator-based logic building\.', 'Linux environment with ROS 2, Python ML libraries, and professional CAD tools required.'
$c = $c -replace 'fa-baby', 'fa-graduation-cap'

# ===== STATS =====
$c = $c -replace '>40\+<', '>60+<'
$c = $c -replace '>Hands-on Classes<', '>Expert Sessions<'
$c = $c -replace '>25\+<', '>20+<'
$c = $c -replace '>Mini Projects<', '>Research Projects<'
$c = $c -replace '>2<', '>AI<'
$c = $c -replace '>Year Program<', '>Deep Learning<'
$c = $c -replace '>3D<', '>ROS<'
$c = $c -replace '>Modeling Mastery<', '>2 Navigation<'

# ===== LEARNING MODULES =====
$c = $c -replace '>What Your Child Will Learn<', '>Core Engineering Pillars<'
$c = $c -replace 'A comprehensive, hands-on curriculum designed to build[^<]*', 'Developing high-level technical expertise for university and industry readiness.'
$c = $c -replace 'micro:bit \& MakeCode Programming', 'Advanced Robotics (ROS 2)'
$c = $c -replace 'Master the fundamentals of computer science using the BBC micro:bit and Microsoft.s powerful visual coding\s*environment\.', 'Mastering ROS 2 (Robot Operating System), SLAM navigation, and multi-DOF kinematics.'
$c = $c -replace '>Block-based coding logic<', '>ROS 2 Architecture<'
$c = $c -replace '>Variables \& Conditionals<', '>SLAM & Navigation<'
$c = $c -replace '>Real-time Hardware I/O<', '>Gazebo Simulation<'

$c = $c -replace 'Electronics \& Sensor Logic', 'AI & Machine Learning'
$c = $c -replace "Dive into the physical world of circuits\. Students learn how sensors .see. the world and how components\s*interact\.", 'Deploying neural networks and computer vision models onto edge devices for autonomous systems.'
$c = $c -replace 'fa-bolt"></i>', 'fa-brain"></i>'
$c = $c -replace '>Circuit Architecture<', '>TensorFlow & PyTorch<'
$c = $c -replace '>Sensor Interpretation<', '>Computer Vision (OpenCV)<'
$c = $c -replace '>Motor Control Systems<', '>Edge AI Deployment<'

$c = $c -replace '3D Design \& Rapid Prototyping', 'RTOS & Embedded Systems'
$c = $c -replace "Bridge the gap between digital design and physical reality by creating custom parts and structural\s*enclosures\.", 'Real-time operating systems, high-performance PCB design, and industrial protocols.'
$c = $c -replace 'fa-cube"></i>', 'fa-microchip"></i>'
$c = $c -replace '>Spatial Geometry<', '>FreeRTOS Implementation<'
$c = $c -replace '>Tinkercad Mastery<', '>PCB Design (KiCad)<'
$c = $c -replace '>3D Printing Workflow<', '>Industrial Protocols<'

$c = $c -replace 'Advanced Engineering Mindset', 'Portfolio & Career Launch'
$c = $c -replace "We focus on developing the critical thinking and problem-solving skills used by world-class engineers\.", 'Building a professional GitHub portfolio and technical documentation for university applications.'
$c = $c -replace 'fa-brain"></i>', 'fa-rocket"></i>'
$c = $c -replace '>Iterative Debugging<', '>GitHub Portfolio<'
$c = $c -replace '>Project Lifecycle<', '>Technical Documentation<'
$c = $c -replace '>Public Presentation<', '>Conference Presentations<'

# ===== CURRICULUM TRACKS =====
$c = $c -replace '><i class="fas fa-code"></i> Programming<', '><i class="fas fa-brain"></i> AI & Vision<'
$c = $c -replace 'track-programming', 'track-ai'

# Module names - AI track
$c = $c -replace '>Getting Started with micro:bit<', '>Advanced Python (OOP)<'
$c = $c -replace '>Computer vs Microcontroller<', '>Object-Oriented Design<'
$c = $c -replace '>The BBC micro:bit Ecosystem<', '>Multithreading<'
$c = $c -replace '>LED Matrix \& Input Buttons<', '>Optimized Algorithms<'
$c = $c -replace '>Your First Code Deployment<', '>Design Patterns<'

$c = $c -replace '>The MakeCode Environment<', '>OpenCV Mastery<'
$c = $c -replace '>Visual Block Interface<', '>Real-time Image Processing<'
$c = $c -replace '>Event-Driven Programming<', '>Object Detection<'
$c = $c -replace '>Animations \& Iconography<', '>Gesture Control<'
$c = $c -replace '>Logic Flow Foundations<', '>Video Analytics<'

$c = $c -replace '>Sensorial Interaction<', '>ML Implementation<'
$c = $c -replace '>Motion \& Tilt Detection<', '>TensorFlow Lite Models<'
$c = $c -replace '>Temperature sensing<', '>Training Pipelines<'
$c = $c -replace '>Interactive Feedback Loops<', '>Edge Deployment<'
$c = $c -replace '>Mini-Game Development<', '>Autonomous Decisions<'

$c = $c -replace '>Data \& Variables<', '>Neural Networks<'
$c = $c -replace '>Understanding Data Storage<', '>CNN Architecture<'
$c = $c -replace '>Incrementing \& Counters<', '>Transfer Learning<'
$c = $c -replace '>Score Tracking Systems<', '>Model Optimization<'
$c = $c -replace '>Complex Game State Logic<', '>Inference Engines<'

$c = $c -replace '>Decisions \(If-Else\)<', '>Data Science<'
$c = $c -replace '>Boolean Logic \& Conditionals<', '>Pandas & NumPy<'
$c = $c -replace '>Comparison Operators<', '>Statistical Analysis<'
$c = $c -replace '>Smart Decision Making<', '>Data Pipelines<'
$c = $c -replace '>Conditional Alert Systems<', '>Visualization (Seaborn)<'

$c = $c -replace '>Loops \& Repetition<', '>NLP Basics<'
$c = $c -replace '>Efficiency with Loops<', '>Text Processing<'
$c = $c -replace '>While vs Repeat Loops<', '>Sentiment Analysis<'
$c = $c -replace '>Nested Logic Patterns<', '>Chatbot Development<'
$c = $c -replace '>Automated Light Patterns<', '>Voice Assistants<'

$c = $c -replace '>Advanced Functions<', '>Reinforcement Learning<'
$c = $c -replace '>Modular Program Design<', '>Q-Learning Basics<'
$c = $c -replace '>Creating Custom Functions<', '>Reward Systems<'
$c = $c -replace '>Reusability \& Debugging<', '>Sim-to-Real Transfer<'
$c = $c -replace '>Professional Coding Habits<', '>Game AI Agents<'

$c = $c -replace '>Advanced Game Logic<', '>GANs & Creative AI<'
$c = $c -replace '>Sprites \& Multiple Objects<', '>Image Generation<'
$c = $c -replace '>Velocity \& Gravity Sim<', '>Style Transfer<'
$c = $c -replace '>Physics-Based Puzzles<', '>Deepfake Awareness<'
$c = $c -replace '>Multi-Level Architecture<', '>Ethical AI<'

$c = $c -replace '>Radio Communication<', '>MLOps Pipeline<'
$c = $c -replace '>IoT Wireless Protocols<', '>Model Versioning<'
$c = $c -replace '>Sending Data Packets<', '>CI/CD for ML<'
$c = $c -replace '>Remote Control Systems<', '>Cloud Deployment<'
$c = $c -replace '>Multi-Node Interactions<', '>Monitoring & Logging<'

$c = $c -replace '>System Integration<', '>AI Capstone<'
$c = $c -replace '>Merging All Logic Pillars<', '>End-to-End AI Product<'
$c = $c -replace '>Optimization \& Cleanup<', '>Research Paper Writing<'
$c = $c -replace '>Robust Bug Mitigation<', '>Peer Review<'
$c = $c -replace '>Production Ready Code<', '>Conference Prep<'

# Electronics track -> ROS 2 Robotics
$c = $c -replace '><i class="fas fa-bolt"></i> Electronics<', '><i class="fas fa-robot"></i> ROS 2 Robotics<'
$c = $c -replace 'track-electronics', 'track-ros'
$c = $c -replace '>Physical Computing<', '>ROS 2 Foundation<'
$c = $c -replace '>Flow of Electrons<', '>Nodes & Topics<'
$c = $c -replace '>The V-I-R Relationship<', '>Publisher/Subscriber<'
$c = $c -replace '>Breadboard Prototyping<', '>Service Architecture<'
$c = $c -replace '>Lab Safety Protocols<', '>Launch Files<'

$c = $c -replace ">Ohm.s Law Mastery<", '>SLAM & Mapping<'
$c = $c -replace '>Resistor Calculations<', '>LiDAR Integration<'
$c = $c -replace '>LED Logic \& Safety<', '>Occupancy Grids<'
$c = $c -replace '>PWM \& Dimming Effects<', '>Path Planning (A*)<'
$c = $c -replace '>Mood Light Project<', '>Nav2 Stack<'

$c = $c -replace '>Ultrasonic Intelligence<', '>Motion Planning<'
$c = $c -replace '>Sound Ping Principles<', '>Kinematics Chains<'
$c = $c -replace '>Trigger \& Echo Calibration<', '>Inverse Kinematics<'
$c = $c -replace '>Distance Alarm Systems<', '>Trajectory Generation<'
$c = $c -replace '>Collision Avoidance Logic<', '>Multi-DOF Control<'

$c = $c -replace '>Precision Motion \(Servo\)<', '>Gazebo Simulation<'
$c = $c -replace '>Angular Positioning<', '>URDF Models<'
$c = $c -replace '>Pulse Width Modulation<', '>Physics Engines<'
$c = $c -replace '>Wiping \& Swiveling Logic<', '>Sensor Simulation<'
$c = $c -replace '>Automatic Boom Barrier<', '>Sim-to-Real Transfer<'

$c = $c -replace '>Analog vs Digital Sensors<', '>Multi-Robot Systems<'
$c = $c -replace '>Potentiometers \& Map Block<', '>Fleet Management<'
$c = $c -replace '>Signal Processing<', '>Task Allocation<'
$c = $c -replace '>Calibration Techniques<', '>Formation Control<'
$c = $c -replace '>Variable Input Tuning<', '>Swarm Intelligence<'

$c = $c -replace '>Robotic Chassis Assembly<', '>RTOS Integration<'
$c = $c -replace '>Structural Integrity<', '>FreeRTOS Tasks<'
$c = $c -replace '>Motor Driver Interfacing<', '>Real-time Constraints<'
$c = $c -replace '>Power Management<', '>ISR Programming<'
$c = $c -replace '>First Test Drive<', '>Watchdog Timers<'

$c = $c -replace '>Smart Solutions<', '>Communication Protocols<'
$c = $c -replace '>Home Automation<', '>CAN Bus<'
$c = $c -replace '>Environmental Monitoring<', '>Modbus RTU<'
$c = $c -replace '>Smart Street Lighting<', '>DDS Middleware<'
$c = $c -replace '>Efficiency Optimizations<', '>Protocol Bridges<'

$c = $c -replace '>Obstacle Avoidance<', '>Sensor Fusion<'
$c = $c -replace '>Real-time Path Planning<', '>Kalman Filtering<'
$c = $c -replace '>Object Detection Logic<', '>IMU + GPS Fusion<'
$c = $c -replace '>Emergency Stop Systems<', '>Point Cloud Processing<'
$c = $c -replace '>Autonomous Navigation<', '>State Estimation<'

$c = $c -replace '>Smart Irrigation Project<', '>Safety Systems<'
$c = $c -replace '>Soil Moisture Sensing<', '>Emergency Stops<'
$c = $c -replace '>Relay Control Over pumps<', '>Collision Detection<'
$c = $c -replace '>Automated Watering Cycle<', '>Fail-Safe Logic<'
$c = $c -replace '>IoT Farm Prototype<', '>ISO Safety Standards<'

$c = $c -replace '>Circuit Debugging<', '>ROS 2 Capstone<'
$c = $c -replace '>Multimeter Basics<', '>Full System Integration<'
$c = $c -replace '>Identifying Short Circuits<', '>Performance Optimization<'
$c = $c -replace '>Continuity Testing<', '>Documentation<'
$c = $c -replace '>Professional Repair Tips<', '>Deployment & Testing<'

# Design track -> Portfolio Build
$c = $c -replace '><i class="fas fa-cube"></i> Design \& Projects<', '><i class="fas fa-rocket"></i> Portfolio Build<'
$c = $c -replace 'track-design', 'track-portfolio'
$c = $c -replace '>3D Visualization<', '>IoT Cloud Architecture<'
$c = $c -replace '>The X-Y-Z coordinate system<', '>Scalable Backends<'
$c = $c -replace '>Constructive Solid Geometry<', '>Industrial Monitoring<'
$c = $c -replace '>Scaling \& Alignment<', '>MQTT at Scale<'
$c = $c -replace '>First Design: Name Tags<', '>Edge Computing<'

$c = $c -replace '>Tinkercad Mastery<', '>Advanced CAD (Fusion 360)<'
$c = $c -replace '>User Interface \& Tools<', '>Parametric Modeling<'
$c = $c -replace '>Grouping \& Holes<', '>DFM Principles<'
$c = $c -replace '>Duplication \& Mirroring<', '>Structural Simulation<'
$c = $c -replace '>Designing Custom Gears<', '>Assembly Design<'

$c = $c -replace '>Engineering Enclosures<', '>PCB Design (KiCad)<'
$c = $c -replace '>Component Tolerances<', '>Schematic Capture<'
$c = $c -replace '>Designing for Electronics<', '>Multi-Layer Layouts<'
$c = $c -replace '>Ventilation \& Accessibility<', '>Signal Integrity<'
$c = $c -replace '>Custom Sensor Housing<', '>Manufacturing Files<'

$c = $c -replace '>Designing for Scale<', '>Technical Writing<'
$c = $c -replace '>Measurements \& Units<', '>Research Papers<'
$c = $c -replace '>Structural Support Logic<', '>IEEE Format<'
$c = $c -replace '>Material Efficiency<', '>Literature Reviews<'
$c = $c -replace '>Modular 3D Structures<', '>Lab Reports<'

$c = $c -replace '>3D Printing Workflow<', '>GitHub Mastery<'
$c = $c -replace '>FDM Technology Overview<', '>Version Control<'
$c = $c -replace '>Slicing \& G-Code Export<', '>CI/CD Pipelines<'
$c = $c -replace '>Printer Bed Calibration<', '>Open Source Contributions<'
$c = $c -replace '>Physical Model Production<', '>Community Building<'

$c = $c -replace '>Advanced Slicing<', '>Startup Thinking<'
$c = $c -replace '>Infill \& Shell Patterns<', '>Market Research<'
$c = $c -replace '>Support Generation<', '>MVP Development<'
$c = $c -replace '>Layer Resolution Impact<', '>Pitch Deck Design<'
$c = $c -replace '>Print Speed Optimization<', '>Investor Readiness<'

$c = $c -replace '>Problem Identification<', '>University Prep<'
$c = $c -replace '>Real-world Challenges<', '>Application Essays<'
$c = $c -replace '>Empathy in Design<', '>Portfolio Curation<'
$c = $c -replace '>Solution Brainstorming<', '>Interview Prep<'
$c = $c -replace '>Bill of Materials \(BOM\)<', '>Recommendation Letters<'

$c = $c -replace '>Solution Architecture<', '>Capstone Architecture<'
$c = $c -replace '>Flowcharting the logic<', '>System Design Document<'
$c = $c -replace '>Schematic Drawing<', '>Technical Specifications<'
$c = $c -replace '>Feasibility Study<', '>Risk Analysis<'
$c = $c -replace '>Prototyping Roadmap<', '>Implementation Plan<'

$c = $c -replace '>Prototype Iteration<', '>Final Build<'
$c = $c -replace '>Build-Test-Fail Cycle<', '>Full Stack Assembly<'
$c = $c -replace '>Systemic Debugging<', '>Load Testing<'
$c = $c -replace '>User Interface Polish<', '>UX Optimization<'
$c = $c -replace '>Final System Assembly<', '>Production Release<'

$c = $c -replace '>Showcase \& Demo Day<', '>Project Defense<'
$c = $c -replace '>Portfolio Documentation<', '>Capstone Presentation<'
$c = $c -replace '>Public Speaking \& Demo<', '>Technical Q&A Panel<'
$c = $c -replace '>Technical QA Session<', '>Portfolio Publication<'
$c = $c -replace '>Graduation \& Awards<', '>Elite Graduation<'

# ===== CURRICULUM SECTION HEADER =====
$c = $c -replace 'Our Beginner Program follows a carefully planned module-wise structure across 30 comprehensive segments,\s*ensuring structured growth from basic logic to complex robotic systems\.', 'Our Advanced Program features a 30-module professional curriculum covering AI, ROS 2 robotics, and career-ready portfolio development.'

# ===== LEARNING OUTCOMES =====
$c = $c -replace '>Programming Goals<', '>AI & Vision Goals<'
$c = $c -replace '>Logical thinking \& Algorithm design<', '>Deep learning model deployment<'
$c = $c -replace '>Microsoft MakeCode Prototyping<', '>Computer vision mastery<'
$c = $c -replace '>Hardware-Software Syncing<', '>NLP & generative AI<'
$c = $c -replace '>Data handling \& State management<', '>MLOps & production pipelines<'

$c = $c -replace '>Engineering Goals<', '>Robotics Goals<'
$c = $c -replace '>Electrical breadboarding skills<', '>ROS 2 system design<'
$c = $c -replace '>Component integration \& Safety<', '>SLAM & autonomous navigation<'
$c = $c -replace '>Sensor signal interpretation<', '>Multi-robot coordination<'
$c = $c -replace '>Debugging \& Fault finding<', '>Industrial safety systems<'

$c = $c -replace '>Creative Goals<', '>Career Goals<'
$c = $c -replace '>3D Modeling \& CAD foundations<', '>Professional GitHub portfolio<'
$c = $c -replace '>Iterative product design<', '>Technical paper authorship<'
$c = $c -replace '>System documentation<', '>University application readiness<'
$c = $c -replace '>Final Capstone Presentation<', '>Industry-grade capstone project<'

# ===== LEARNING JOURNEY =====
$c = $c -replace '>The Spark<', '>Foundations<'
$c = $c -replace '>Foundations in visual coding \& basic electronics logic\.<', '>Advanced Python, OOP, and ROS 2 architecture foundations.<'
$c = $c -replace '>Integration<', '>Deep Dive<'
$c = $c -replace '>Weekly hands-on projects merging code with sensors\.<', '>AI/ML implementation, SLAM, and autonomous systems.<'
$c = $c -replace '>Creation<', '>Innovation<'
$c = $c -replace '>Designing custom parts \& programming complex systems\.<', '>PCB design, cloud architecture, and product engineering.<'
$c = $c -replace '>Realization<', '>Launch<'
$c = $c -replace '>Final capstone project \& professional certification\.<', '>Capstone defense, portfolio publication, and elite graduation.<'

# ===== CERTIFICATION =====
$c = $c -replace '>Beginner Level Mastery<', '>Master Innovator Status<'
$c = $c -replace 'Official Graduation \& Certification', 'Elite Graduation & Portfolio'
$c = $c -replace 'Upon successful completion of the 30-module curriculum and the independent capstone project, students are\s*awarded the official MakerWorks Junior Beginner Certificate\.', 'Graduates receive a professional engineering certification and a complete project portfolio for university applications and career readiness.'
$c = $c -replace '>30 Hands-on Modules<', '>Professional ROS 2 Skills<'
$c = $c -replace '>Complete mastery over basic coding, electronics, and design\.<', '>Mastery over industry-standard robotics middleware.<'
$c = $c -replace '>Capstone Presentation<', '>GitHub Portfolio<'
$c = $c -replace '>Showcase a fully functional independent project to peers and parents\.\s*<', '>Verified code repositories and technical documentation.<'
$c = $c -replace '>Career Foundation<', '>University Readiness<'
$c = $c -replace '>Eligible to progress to our Intermediate Level Engineering track\.<', '>Complete portfolio for top engineering university applications.<'
$c = $c -replace 'junior-beginner-certificate\.webp', '../advanced/images2/advancedcertificate.webp'
$c = $c -replace 'MakerWorks Junior Beginner Certificate', 'MakerWorks Advanced Certificate'
$c = $c -replace 'MakerWorks Junior . Beginner Level Certificate', 'MakerWorks Advanced Level Certificate'
$c = $c -replace 'fa-certificate', 'fa-crown'

# ===== GALLERY =====
$c = $c -replace 'src="images/group\.webp"', 'src="images/group.webp"'
$c = $c -replace 'src="images/sidarth\.webp"', 'src="images/kiara.webp"'
$c = $c -replace 'src="images/divyana\.webp"', 'src="images/mahi.webp"'
$c = $c -replace 'src="images/avykut\.webp"', 'src="images/wro.webp"'
$c = $c -replace 'src="images/nitanth\.webp"', 'src="images/tejsva.webp"'
$c = $c -replace '>Collaborative Learning<', '>Elite Team Engineering<'
$c = $c -replace '>Students working together on robot assembly<', '>Advanced students building ROS 2 autonomous systems<'
$c = $c -replace '>Focused Minds<', '>Deep Focus<'
$c = $c -replace '>Circuit Building<', '>AI Research<'
$c = $c -replace '>Project Success<', '>Competition Ready<'
$c = $c -replace '>Showcasing the final working prototype<', '>WRO competition preparation and strategy<'
$c = $c -replace '>Presentation Skills<', '>Technical Leadership<'
$c = $c -replace '>Explaining the logic behind the code<', '>Presenting research findings to industry mentors<'

# ===== TESTIMONIALS =====
$c = $c -replace '"My child absolutely loves the Beginner Level program! They come home\s*excited every day, eager to show me what they.ve built\. It.s amazing to see their confidence grow\s*with each new concept they learn\."', '"The advanced program at MakerWorks is on par with first-year university robotics. The focus on ROS 2 and SLAM is incredibly rare for a school-level program."'
$c = $c -replace '"MakerWorks has truly ignited a passion for technology in my son\. The\s*hands-on approach and patient instructors make learning complex topics so much fun\. Highly recommend\s*for any curious child!"', '"My daughter''s portfolio from this program helped her get accepted into a top engineering university. The AI and computer vision projects stood out in her application."'
$c = $c -replace '"The Beginner Level program is fantastic! My daughter, who had no prior\s*experience, is now confidently building circuits and understanding basic coding\. The curriculum is\s*well-structured and very engaging\."', '"The depth of technical knowledge in this program is remarkable. My son is now contributing to open-source robotics projects on GitHub. MakerWorks transformed his career trajectory."'
$c = $c -replace '>Mrs\. Sharma<', '>Dr. Rajesh Patel<'
$c = $c -replace '>MG<', '>SA<'
$c = $c -replace '>Mr\. Gupta<', '>Mrs. Agarwal<'
$c = $c -replace '>MK<', '>PK<'
$c = $c -replace '>Ms\. Khan<', '>Prof. Kumar<'
$c = $c -replace '>MS<', '>RP<'
$c = $c -replace '>Parent of Beginner Student<', '>Parent of Advanced Student<'

# ===== FAQ =====
$c = $c -replace 'What is the duration of the Beginner Level Program\?', 'What is the duration of the Advanced Level Program?'
$c = $c -replace 'The program is a comprehensive <strong>2-year journey</strong>, organized into weekend sessions\. It.s\s*designed to provide a steady, stress-free introduction to robotics and coding without interfering with\s*regular school hours\.', 'The Advanced program is an intensive <strong>project-based journey</strong> covering AI, ROS 2, and professional engineering. Duration depends on specialization track chosen.'
$c = $c -replace 'What age group is suitable for this program\?', 'What prerequisites are needed?'
$c = $c -replace 'This program is specifically curated for young explorers aged <strong>8 to 10 years</strong>\. At this\s*age, children are developing the logical thinking patterns necessary for block-based coding and\s*hands-on creation\.', 'Students should be <strong>15+ years old</strong> with proficiency in Arduino C++ and Python. Completion of our Intermediate program or equivalent experience is recommended.'
$c = $c -replace 'Do students need any prior experience\?', 'What makes this program unique?'
$c = $c -replace '<strong>Not at all!</strong> We start from the very basics\. The program assumes no prior knowledge of\s*coding, electronics, or engineering\. We guide every student step-by-step through their first LED blink\s*to their first robot\.', 'This is one of the <strong>only school-level programs in India</strong> teaching ROS 2, SLAM navigation, and AI model deployment. Our curriculum is comparable to first-year university engineering.'
$c = $c -replace 'What will my child specifically learn\?', 'Will this help with university applications?'
$c = $c -replace 'Over the 30 modules, they learn <strong>Block-based Coding</strong> \(via micro:bit\), <strong>Basic\s*Electronics</strong> \(Ohm.s Law, Breadboarding\), <strong>3D Design</strong> \(CAD fundamentals\), and\s*<strong>Robotics Automation</strong>\. It.s a multi-disciplinary approach\.', '<strong>Absolutely.</strong> Graduates leave with a professional <strong>GitHub portfolio</strong>, published technical documentation, and a capstone project that demonstrates engineering competence to top universities worldwide.'
$c = $c -replace 'Are materials and kits included\?', 'What tools and platforms are used?'
$c = $c -replace '<strong>Yes\.</strong> All essential materials, including the BBC micro:bit controllers, electronic\s*component kits, and structural parts, are provided in the lab\. Students work with professional-grade\s*tools in a safe environment\.', 'Students work with <strong>ROS 2</strong>, <strong>TensorFlow/PyTorch</strong>, <strong>OpenCV</strong>, <strong>KiCad</strong>, <strong>Fusion 360</strong>, and professional Linux development environments.'
$c = $c -replace 'Can we practice project-building at home\?', 'Is mentorship provided?'
$c = $c -replace 'Absolutely! While the core kits remain in the lab, we provide <strong>Online Resources</strong> and\s*project documentation that allow children to simulate and refine their code at home using free\s*platforms like Microsoft MakeCode and Tinkercad\.', 'Yes! Students receive <strong>1-on-1 mentorship</strong> from industry professionals, access to research resources, and guidance for competition preparation (WRO, VEX, etc.).'
$c = $c -replace 'Find answers to common queries about our Beginner Level Program and how it helps young makers grow\.', 'Find answers about our Advanced Level Program and how it prepares future engineers for university and industry.'

# ===== STRUCTURED DATA =====
$c = $c -replace '"name": "Beginner Level Program"', '"name": "Advanced Level Program"'

# ===== REVIEWS SECTION DARK BG =====
$c = $c -replace 'background: var\(--dark\);\s*padding: 100px 0;', 'background: #0f172a; padding: 100px 0;'

# Add track-ai and track-ros CSS vars
$c = $c -replace '\.track-design \{', ".track-ai { --track-color: #8b5cf6; }`n`n    .track-ros { --track-color: #6366f1; }`n`n    .track-portfolio { --track-color: #f59e0b; }`n`n    .track-design {"

Set-Content $file $c -NoNewline
Write-Host "Advanced transformation complete!"
