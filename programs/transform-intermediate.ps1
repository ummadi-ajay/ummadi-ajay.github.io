$file = "c:\Users\ajay8\Downloads\makerworks\programs\intermediate\index.html"
$c = Get-Content $file -Raw

# ===== HEAD / META =====
$c = $c -replace 'Beginner Level Program', 'Intermediate Level Program'
$c = $c -replace 'beginner-hero\.jpg', 'intermediate-hero.jpg'
$c = $c -replace 'A fun and creative 2-year program for kids aged 7.10 to learn robotics, coding, and electronics through hands-on projects\.', 'A 2-year advanced program for kids aged 11-14 to master Arduino, Python, IoT, and robotics through real-world engineering projects.'
$c = $c -replace 'A fun and creative 2-year program for kids aged 7–10 to learn robotics, coding, and electronics through hands-on projects at MakerWorks\.', 'A 2-year advanced program for kids aged 11-14 to master Arduino, Python, IoT, and robotics through real-world engineering projects at MakerWorks.'
$c = $c -replace 'MakerWorks Beginner Level, robotics for kids Mumbai, coding for children, micro:bit classes Mumbai, STEM for kids, robotics projects, electronics for kids', 'MakerWorks Intermediate Level, Arduino classes Mumbai, Python for kids, IoT projects Mumbai, STEM for teens, robotics engineering, advanced coding'
$c = $c -replace '/programs/beginner/', '/programs/intermediate/'

# ===== CSS COLORS - change orange to blue =====
$c = $c -replace '--primary: #ff6600;', '--primary: #0d6efd;'
$c = $c -replace '--secondary: #0d6efd;', '--secondary: #ff6600;'
$c = $c -replace 'linear-gradient\(135deg, #ff9900 0%, #ff6600 100%\)', 'linear-gradient(135deg, #0d6efd 0%, #004dc7 100%)'
$c = $c -replace 'rgba\(255, 102, 0,', 'rgba(13, 110, 253,'
$c = $c -replace '#ff9900', '#3b82f6'
$c = $c -replace 'background: linear-gradient\(135deg, var\(--primary\), #ff9900\)', 'background: linear-gradient(135deg, var(--primary), #3b82f6)'
$c = $c -replace 'background: linear-gradient\(180deg, #fff 0%, #fffbf5 100%\)', 'background: linear-gradient(180deg, #fff 0%, #f0f4ff 100%)'

# ===== HERO =====
$c = $c -replace 'Maker Works Junior Program', 'Maker Works Intermediate Program'
$c = $c -replace 'A fun-filled 2-year creative learning program for curious minds aged 8.10', 'A 2-year advanced engineering program for aspiring innovators aged 11-14'
$c = $c -replace 'Junior%20Beginner%20Program', 'Intermediate%20Program'

# ===== PROGRAM INFO =====
$c = $c -replace '>Age Group<', '>Target Group<'
$c = $c -replace '>8 . 10 Years<', '>11 – 14 Years<'
$c = $c -replace '8 – 10 Years', '11 – 14 Years'
$c = $c -replace '>2 Years Course<', '>2 Years (Weekends)<'
$c = $c -replace '>2 Sessions/Week<', '>Arduino + Python + IoT<'
$c = $c -replace 'fa-clipboard-list', 'fa-microchip'
$c = $c -replace '>Frequency<', '>Curriculum<'

# ===== ELIGIBILITY =====
$c = $c -replace '>Level: Absolute Beginner<', '>Level: Intermediate<'
$c = $c -replace 'No prior experience in electronics or coding required\. We start from ground zero\.', 'Basic understanding of electronics or block-based coding is helpful but not mandatory.'
$c = $c -replace '>Age: 8.10 Years<', '>Age: 11–14 Years<'
$c = $c -replace 'The curriculum is specifically tailored for the cognitive development of this age group\.', 'The curriculum builds on foundational skills and introduces text-based programming and IoT systems.'
$c = $c -replace '>Mindset: Curious<', '>Mindset: Problem Solver<'
$c = $c -replace 'A keen interest in learning how things work and built-in desire to explore new gadgets\.', 'A deep curiosity for how complex systems like smart homes and autonomous robots work.'
$c = $c -replace '>Tooling: Computer \& Net<', '>Tooling: Arduino IDE & Python<'
$c = $c -replace 'Basic access to a computer for software exploration and simulator-based logic building\.', 'Requires a computer with internet for Arduino IDE, Python, and cloud platforms.'

# ===== STATS =====
$c = $c -replace '>40\+<', '>50+<'
$c = $c -replace '>Hands-on Classes<', '>Advanced Sessions<'
$c = $c -replace '>25\+<', '>35+<'
$c = $c -replace '>Mini Projects<', '>Complex Projects<'
$c = $c -replace '>3D<', '>IoT<'
$c = $c -replace '>Modeling Mastery<', '>Cloud Mastery<'

# ===== LEARNING MODULES =====
$c = $c -replace '>What Your Child Will Learn<', '>Core Engineering Pillars<'
$c = $c -replace 'A comprehensive, hands-on curriculum designed to build[^<]*', 'Master Arduino, Python, IoT, and advanced robotics through industry-standard tools and engineering practices.'
$c = $c -replace 'micro:bit \& MakeCode Programming', 'Arduino & C++ Programming'
$c = $c -replace 'Master the fundamentals of computer science using the BBC micro:bit and Microsoft.s powerful visual coding\s*environment\.', 'Transition from blocks to professional C++ coding using the industry-standard Arduino ecosystem.'
$c = $c -replace '>Block-based coding logic<', '>Arduino IDE Setup<'
$c = $c -replace '>Variables \& Conditionals<', '>C++ Syntax & Functions<'
$c = $c -replace '>Real-time Hardware I/O<', '>Serial Communication<'

$c = $c -replace 'Electronics \& Sensor Logic', 'Python Programming'
$c = $c -replace "Dive into the physical world of circuits\. Students learn how sensors .see. the world and how components\s*interact\.", 'Learn the world''s most popular language for data visualization, AI, and hardware interaction.'
$c = $c -replace 'fa-bolt"></i>', 'fab fa-python"></i>'
$c = $c -replace '>Circuit Architecture<', '>Syntax & Data Structures<'
$c = $c -replace '>Sensor Interpretation<', '>Algorithmic Logic<'
$c = $c -replace '>Motor Control Systems<', '>Script Building<'

$c = $c -replace '3D Design \& Rapid Prototyping', 'IoT & Cloud Systems'
$c = $c -replace "Bridge the gap between digital design and physical reality by creating custom parts and structural\s*enclosures\.", 'Construct smart systems that communicate via Wi-Fi and cloud platforms like Blynk and ThingSpeak.'
$c = $c -replace 'fa-cube"></i>', 'fa-wifi"></i>'
$c = $c -replace '>Spatial Geometry<', '>ESP8266 Wi-Fi Module<'
$c = $c -replace '>Tinkercad Mastery<', '>API Integration<'
$c = $c -replace '>3D Printing Workflow<', '>Cloud Dashboards<'

$c = $c -replace 'Advanced Engineering Mindset', 'Advanced Robotics & AI'
$c = $c -replace "We focus on developing the critical thinking and problem-solving skills used by world-class engineers\.", 'Integrate vision systems, computer vision, and AI fundamentals into mobile robotic platforms.'
$c = $c -replace 'fa-brain"></i>', 'fa-robot"></i>'
$c = $c -replace '>Iterative Debugging<', '>Computer Vision (OpenCV)<'
$c = $c -replace '>Project Lifecycle<', '>Machine Learning Basics<'
$c = $c -replace '>Public Presentation<', '>Autonomous Navigation<'

# ===== CURRICULUM TRACKS =====
$c = $c -replace '><i class="fas fa-code"></i> Programming<', '><i class="fas fa-microchip"></i> Embedded Systems<'

# Module names - Programming track
$c = $c -replace '>Getting Started with micro:bit<', '>Arduino Fundamentals<'
$c = $c -replace '>Computer vs Microcontroller<', '>Ecosystem & IDE Setup<'
$c = $c -replace '>The BBC micro:bit Ecosystem<', '>Digital & Analog I/O<'
$c = $c -replace '>LED Matrix \& Input Buttons<', '>First Sketch Deployment<'
$c = $c -replace '>Your First Code Deployment<', '>Pin Configuration<'

$c = $c -replace '>The MakeCode Environment<', '>C/C++ for Hardware<'
$c = $c -replace '>Visual Block Interface<', '>Variables & Control Flow<'
$c = $c -replace '>Event-Driven Programming<', '>Modular Functions<'
$c = $c -replace '>Animations \& Iconography<', '>Serial Debugging<'
$c = $c -replace '>Logic Flow Foundations<', '>Memory Management<'

$c = $c -replace '>Sensorial Interaction<', '>Advanced Sensors<'
$c = $c -replace '>Motion \& Tilt Detection<', '>Ultrasonic & Humidity<'
$c = $c -replace '>Temperature sensing<', '>Sensor Data Processing<'
$c = $c -replace '>Interactive Feedback Loops<', '>Precision Calibration<'
$c = $c -replace '>Mini-Game Development<', '>Multi-Sensor Fusion<'

$c = $c -replace '>Data \& Variables<', '>Motor Control & PWM<'
$c = $c -replace '>Understanding Data Storage<', '>L298N Bridge Logic<'
$c = $c -replace '>Incrementing \& Counters<', '>Servo Positioning<'
$c = $c -replace '>Score Tracking Systems<', '>Mobile Chassis Build<'
$c = $c -replace '>Complex Game State Logic<', '>PID Tuning Basics<'

$c = $c -replace '>Decisions \(If-Else\)<', '>Display Systems<'
$c = $c -replace '>Boolean Logic \& Conditionals<', '>LCD & OLED Interfacing<'
$c = $c -replace '>Comparison Operators<', '>I2C Communication<'
$c = $c -replace '>Smart Decision Making<', '>Custom UI on Screens<'
$c = $c -replace '>Conditional Alert Systems<', '>Real-time Data Display<'

$c = $c -replace '>Loops \& Repetition<', '>Advanced C++ Patterns<'
$c = $c -replace '>Efficiency with Loops<', '>Structs & Classes<'
$c = $c -replace '>While vs Repeat Loops<', '>Interrupt Handlers<'
$c = $c -replace '>Nested Logic Patterns<', '>Timer-based Events<'
$c = $c -replace '>Automated Light Patterns<', '>State Machine Logic<'

$c = $c -replace '>Advanced Functions<', '>Protocol Mastery<'
$c = $c -replace '>Modular Program Design<', '>SPI Communication<'
$c = $c -replace '>Creating Custom Functions<', '>UART Data Transfer<'
$c = $c -replace '>Reusability \& Debugging<', '>Multi-Device Networks<'
$c = $c -replace '>Professional Coding Habits<', '>Protocol Debugging<'

$c = $c -replace '>Advanced Game Logic<', '>Relay & Actuator Control<'
$c = $c -replace '>Sprites \& Multiple Objects<', '>Relay Module Safety<'
$c = $c -replace '>Velocity \& Gravity Sim<', '>Solenoid Valves<'
$c = $c -replace '>Physics-Based Puzzles<', '>Solid State Relays<'
$c = $c -replace '>Multi-Level Architecture<', '>Home Automation Logic<'

$c = $c -replace '>Radio Communication<', '>PCB Design Basics<'
$c = $c -replace '>IoT Wireless Protocols<', '>Schematic Capture (EasyEDA)<'
$c = $c -replace '>Sending Data Packets<', '>Layout Design Rules<'
$c = $c -replace '>Remote Control Systems<', '>Gerber File Export<'
$c = $c -replace '>Multi-Node Interactions<', '>Component Footprints<'

$c = $c -replace '>System Integration<', '>Embedded System Project<'
$c = $c -replace '>Merging All Logic Pillars<', '>Full Stack Integration<'
$c = $c -replace '>Optimization \& Cleanup<', '>Power Budget Analysis<'
$c = $c -replace '>Robust Bug Mitigation<', '>Enclosure + PCB Assembly<'
$c = $c -replace '>Production Ready Code<', '>Final Test & Validation<'

# Electronics track -> Python & IoT
$c = $c -replace '><i class="fas fa-bolt"></i> Electronics<', '><i class="fab fa-python"></i> Python & IoT<'
$c = $c -replace '>Physical Computing<', '>Python Fundamentals<'
$c = $c -replace '>Flow of Electrons<', '>Syntax & Data Structures<'
$c = $c -replace '>The V-I-R Relationship<', '>Algorithmic Logic<'
$c = $c -replace '>Breadboard Prototyping<', '>Script Building<'
$c = $c -replace '>Lab Safety Protocols<', '>File I/O & Libraries<'

$c = $c -replace ">Ohm.s Law Mastery<", '>Data Visualization<'
$c = $c -replace '>Resistor Calculations<', '>Matplotlib & Pandas<'
$c = $c -replace '>LED Logic \& Safety<', '>Chart Generation<'
$c = $c -replace '>PWM \& Dimming Effects<', '>Data Dashboard Design<'
$c = $c -replace '>Mood Light Project<', '>Real-time Graphing<'

$c = $c -replace '>Ultrasonic Intelligence<', '>Wi-Fi (ESP8266)<'
$c = $c -replace '>Sound Ping Principles<', '>API Integration<'
$c = $c -replace '>Trigger \& Echo Calibration<', '>HTTP Requests<'
$c = $c -replace '>Distance Alarm Systems<', '>Weather Station Build<'
$c = $c -replace '>Collision Avoidance Logic<', '>JSON Data Parsing<'

$c = $c -replace '>Precision Motion \(Servo\)<', '>Cloud Analytics<'
$c = $c -replace '>Angular Positioning<', '>ThingSpeak & Blynk<'
$c = $c -replace '>Pulse Width Modulation<', '>Remote Device Control<'
$c = $c -replace '>Wiping \& Swiveling Logic<', '>Live Dashboards<'
$c = $c -replace '>Automatic Boom Barrier<', '>Data Logging Systems<'

$c = $c -replace '>Analog vs Digital Sensors<', '>MQTT Protocol<'
$c = $c -replace '>Potentiometers \& Map Block<', '>Broker Configuration<'
$c = $c -replace '>Signal Processing<', '>Publish/Subscribe Model<'
$c = $c -replace '>Calibration Techniques<', '>QoS & Retained Messages<'
$c = $c -replace '>Variable Input Tuning<', '>Multi-Device Mesh<'

$c = $c -replace '>Robotic Chassis Assembly<', '>Interactive Dashboards<'
$c = $c -replace '>Structural Integrity<', '>JavaScript & DOM<'
$c = $c -replace '>Motor Driver Interfacing<', '>Live Data Visualization<'
$c = $c -replace '>Power Management<', '>Chart.js Integration<'
$c = $c -replace '>First Test Drive<', '>Responsive Web Design<'

$c = $c -replace '>Smart Solutions<', '>Notification Systems<'
$c = $c -replace '>Home Automation<', '>Email & SMS Alerts<'
$c = $c -replace '>Environmental Monitoring<', '>Threshold Triggers<'
$c = $c -replace '>Smart Street Lighting<', '>Push Notifications<'
$c = $c -replace '>Efficiency Optimizations<', '>Alert Scheduling<'

$c = $c -replace '>Obstacle Avoidance<', '>Smart Home Project<'
$c = $c -replace '>Real-time Path Planning<', '>Multi-room Automation<'
$c = $c -replace '>Object Detection Logic<', '>Voice Control (Alexa)<'
$c = $c -replace '>Emergency Stop Systems<', '>Energy Monitoring<'
$c = $c -replace '>Autonomous Navigation<', '>Cloud Command Center<'

$c = $c -replace '>Smart Irrigation Project<', '>IoT Security<'
$c = $c -replace '>Soil Moisture Sensing<', '>Authentication Protocols<'
$c = $c -replace '>Relay Control Over pumps<', '>Data Encryption Basics<'
$c = $c -replace '>Automated Watering Cycle<', '>Secure API Design<'
$c = $c -replace '>IoT Farm Prototype<', '>Penetration Awareness<'

$c = $c -replace '>Circuit Debugging<', '>Full IoT Pipeline<'
$c = $c -replace '>Multimeter Basics<', '>Sensor to Cloud Flow<'
$c = $c -replace '>Identifying Short Circuits<', '>Database Integration<'
$c = $c -replace '>Continuity Testing<', '>Automated Reports<'
$c = $c -replace '>Professional Repair Tips<', '>Production Deployment<'

# Design track -> Robotics & AI
$c = $c -replace '><i class="fas fa-cube"></i> Design \& Projects<', '><i class="fas fa-robot"></i> Robotics & AI<'
$c = $c -replace 'track-design', 'track-iot'
$c = $c -replace '>3D Visualization<', '>Advanced Motor Control<'
$c = $c -replace '>The X-Y-Z coordinate system<', '>Stepper Motor Drivers<'
$c = $c -replace '>Constructive Solid Geometry<', '>Encoder Feedback<'
$c = $c -replace '>Scaling \& Alignment<', '>Closed-Loop Control<'
$c = $c -replace '>First Design: Name Tags<', '>PID Implementation<'

$c = $c -replace '>Tinkercad Mastery<', '>Computer Vision<'
$c = $c -replace '>User Interface \& Tools<', '>OpenCV Processing<'
$c = $c -replace '>Grouping \& Holes<', '>Object Tracking<'
$c = $c -replace '>Duplication \& Mirroring<', '>Color Detection<'
$c = $c -replace '>Designing Custom Gears<', '>Vision-based Robots<'

$c = $c -replace '>Engineering Enclosures<', '>AI/ML Fundamentals<'
$c = $c -replace '>Component Tolerances<', '>Neural Network Concepts<'
$c = $c -replace '>Designing for Electronics<', '>Voice Recognition<'
$c = $c -replace '>Ventilation \& Accessibility<', '>Edge AI Deployment<'
$c = $c -replace '>Custom Sensor Housing<', '>Teachable Machine<'

$c = $c -replace '>Designing for Scale<', '>Line Following Pro<'
$c = $c -replace '>Measurements \& Units<', '>Multi-Sensor Fusion<'
$c = $c -replace '>Structural Support Logic<', '>Path Optimization<'
$c = $c -replace '>Material Efficiency<', '>Competition Strategies<'
$c = $c -replace '>Modular 3D Structures<', '>Speed Calibration<'

$c = $c -replace '>3D Printing Workflow<', '>Robotic Arm Systems<'
$c = $c -replace '>FDM Technology Overview<', '>Multi-DOF Kinematics<'
$c = $c -replace '>Slicing \& G-Code Export<', '>Inverse Kinematics<'
$c = $c -replace '>Printer Bed Calibration<', '>Object Manipulation<'
$c = $c -replace '>Physical Model Production<', '>Pick & Place Logic<'

$c = $c -replace '>Advanced Slicing<', '>Swarm Robotics<'
$c = $c -replace '>Infill \& Shell Patterns<', '>Multi-Robot Coordination<'
$c = $c -replace '>Support Generation<', '>Formation Control<'
$c = $c -replace '>Layer Resolution Impact<', '>Communication Protocols<'
$c = $c -replace '>Print Speed Optimization<', '>Task Distribution<'

$c = $c -replace '>Problem Identification<', '>Competition Prep<'
$c = $c -replace '>Real-world Challenges<', '>WRO / VEX Strategy<'
$c = $c -replace '>Empathy in Design<', '>Time Management<'
$c = $c -replace '>Solution Brainstorming<', '>Robot Optimization<'
$c = $c -replace '>Bill of Materials \(BOM\)<', '>Team Dynamics<'

$c = $c -replace '>Solution Architecture<', '>Capstone Design<'
$c = $c -replace '>Flowcharting the logic<', '>Problem Statement<'
$c = $c -replace '>Schematic Drawing<', '>System Architecture<'
$c = $c -replace '>Feasibility Study<', '>BOM & Planning<'
$c = $c -replace '>Prototyping Roadmap<', '>Feasibility Analysis<'

$c = $c -replace '>Prototype Iteration<', '>Build & Integration<'
$c = $c -replace '>Build-Test-Fail Cycle<', '>Hardware Assembly<'
$c = $c -replace '>Systemic Debugging<', '>Software Integration<'
$c = $c -replace '>User Interface Polish<', '>System Testing<'
$c = $c -replace '>Final System Assembly<', '>Performance Tuning<'

$c = $c -replace '>Showcase \& Demo Day<', '>Innovation Showcase<'
$c = $c -replace '>Portfolio Documentation<', '>Capstone Demo<'
$c = $c -replace '>Public Speaking \& Demo<', '>Technical Q&A<'
$c = $c -replace '>Technical QA Session<', '>Portfolio Launch<'
$c = $c -replace '>Graduation \& Awards<', '>Graduation Ceremony<'

# ===== CURRICULUM SECTION HEADER =====
$c = $c -replace 'Our Beginner Program follows a carefully planned module-wise structure across 30 comprehensive segments,\s*ensuring structured growth from basic logic to complex robotic systems\.', 'Our Intermediate Program follows a 30-module deep-dive curriculum designed for future engineers, covering embedded systems, Python, IoT, and advanced robotics.'

# ===== LEARNING OUTCOMES =====
$c = $c -replace '>Programming Goals<', '>Embedded Systems Goals<'
$c = $c -replace '>Logical thinking \& Algorithm design<', '>Arduino C++ mastery<'
$c = $c -replace '>Microsoft MakeCode Prototyping<', '>Multi-protocol communication<'
$c = $c -replace '>Hardware-Software Syncing<', '>PCB design fundamentals<'
$c = $c -replace '>Data handling \& State management<', '>Real-time system debugging<'

$c = $c -replace '>Engineering Goals<', '>IoT & Data Goals<'
$c = $c -replace '>Electrical breadboarding skills<', '>Python scripting & automation<'
$c = $c -replace '>Component integration \& Safety<', '>Cloud platform integration<'
$c = $c -replace '>Sensor signal interpretation<', '>IoT security fundamentals<'
$c = $c -replace '>Debugging \& Fault finding<', '>Data visualization & dashboards<'

$c = $c -replace '>Creative Goals<', '>Robotics & AI Goals<'
$c = $c -replace '>3D Modeling \& CAD foundations<', '>Computer vision with OpenCV<'
$c = $c -replace '>Iterative product design<', '>AI/ML model deployment<'
$c = $c -replace '>System documentation<', '>Competition-ready robots<'
$c = $c -replace '>Final Capstone Presentation<', '>Professional capstone project<'

# ===== LEARNING JOURNEY =====
$c = $c -replace '>The Spark<', '>Foundation<'
$c = $c -replace '>Foundations in visual coding \& basic electronics logic\.<', '>Arduino fundamentals and C++ programming foundations.<'
$c = $c -replace '>Integration<', '>Expansion<'
$c = $c -replace '>Weekly hands-on projects merging code with sensors\.<', '>Python, IoT, and cloud platform integration.<'
$c = $c -replace '>Creation<', '>Innovation<'
$c = $c -replace '>Designing custom parts \& programming complex systems\.<', '>Computer vision, AI, and advanced robotics systems.<'
$c = $c -replace '>Realization<', '>Mastery<'
$c = $c -replace '>Final capstone project \& professional certification\.<', '>Capstone project, competition prep, and certification.<'

# ===== CERTIFICATION =====
$c = $c -replace '>Beginner Level Mastery<', '>Intermediate Level Mastery<'
$c = $c -replace 'Official Graduation \& Certification', 'Official Intermediate Certification'
$c = $c -replace 'Upon successful completion of the 30-module curriculum and the independent capstone project, students are\s*awarded the official MakerWorks Junior Beginner Certificate\.', 'Upon successful completion of the 30-module intermediate curriculum and the IoT capstone project, students are awarded the official MakerWorks Intermediate Certificate.'
$c = $c -replace '>30 Hands-on Modules<', '>30 Advanced Modules<'
$c = $c -replace '>Complete mastery over basic coding, electronics, and design\.<', '>Mastery over Arduino, Python, IoT, and AI foundations.<'
$c = $c -replace '>Capstone Presentation<', '>IoT Capstone Project<'
$c = $c -replace '>Showcase a fully functional independent project to peers and parents\.\s*<', '>Demonstrate a fully functional IoT system with cloud integration.<'
$c = $c -replace '>Career Foundation<', '>Industry-Ready Skills<'
$c = $c -replace '>Eligible to progress to our Intermediate Level Engineering track\.<', '>Eligible to progress to our Advanced Level Engineering track.<'
$c = $c -replace 'junior-beginner-certificate\.webp', '../intermediate/images2/intermediatecertificate.webp'
$c = $c -replace 'MakerWorks Junior Beginner Certificate', 'MakerWorks Intermediate Certificate'
$c = $c -replace 'MakerWorks Junior . Beginner Level Certificate', 'MakerWorks Intermediate Level Certificate'

# ===== GALLERY =====
$c = $c -replace 'src="images/group\.webp"', 'src="images/group.webp"'
$c = $c -replace 'src="images/sidarth\.webp"', 'src="images/Avyukt.webp"'
$c = $c -replace 'src="images/divyana\.webp"', 'src="images/pranav.webp"'
$c = $c -replace 'src="images/avykut\.webp"', 'src="images/teach.webp"'
$c = $c -replace 'src="images/nitanth\.webp"', 'src="images/tejsva.webp"'

# ===== TESTIMONIALS =====
$c = $c -replace '"My child absolutely loves the Beginner Level program! They come home\s*excited every day, eager to show me what they.ve built\. It.s amazing to see their confidence grow\s*with each new concept they learn\."', '"The transition from blocks to text-based coding in the Intermediate program was seamless. My son is now building his own home automation systems with Arduino and Python!"'
$c = $c -replace '"MakerWorks has truly ignited a passion for technology in my son\. The\s*hands-on approach and patient instructors make learning complex topics so much fun\. Highly recommend\s*for any curious child!"', '"The IoT projects are incredible. My daughter built a weather station that sends real-time data to a cloud dashboard. The program truly prepares kids for the future of technology."'
$c = $c -replace '"The Beginner Level program is fantastic! My daughter, who had no prior\s*experience, is now confidently building circuits and understanding basic coding\. The curriculum is\s*well-structured and very engaging\."', '"What impressed me most is how the intermediate curriculum bridges theory and practice. My son designed and programmed a complete robotic arm - something I could not do at his age!"'
$c = $c -replace '>Mrs\. Sharma<', '>Mr. Mehra<'
$c = $c -replace '>MG<', '>SD<'
$c = $c -replace '>Mr\. Gupta<', '>Mrs. Desai<'
$c = $c -replace '>MK<', '>RP<'
$c = $c -replace '>Ms\. Khan<', '>Mr. Patel<'
$c = $c -replace '>MS<', '>MM<'
$c = $c -replace '>Parent of Beginner Student<', '>Parent of Intermediate Student<'

# ===== FAQ =====
$c = $c -replace 'What is the duration of the Beginner Level Program\?', 'What is the duration of the Intermediate Level Program?'
$c = $c -replace 'The program is a comprehensive <strong>2-year journey</strong>, organized into weekend sessions\. It.s\s*designed to provide a steady, stress-free introduction to robotics and coding without interfering with\s*regular school hours\.', 'The program is a comprehensive <strong>2-year journey</strong>, organized into weekend sessions. It builds on foundational skills and introduces professional-grade tools like Arduino IDE and Python.'
$c = $c -replace 'What age group is suitable for this program\?', 'What age group is suitable for this program?'
$c = $c -replace 'This program is specifically curated for young explorers aged <strong>8 to 10 years</strong>\. At this\s*age, children are developing the logical thinking patterns necessary for block-based coding and\s*hands-on creation\.', 'This program is designed for young engineers aged <strong>11 to 14 years</strong>. At this age, students are ready to transition from visual blocks to text-based programming and complex systems.'
$c = $c -replace 'Do students need any prior experience\?', 'Do students need prior experience?'
$c = $c -replace '<strong>Not at all!</strong> We start from the very basics\. The program assumes no prior knowledge of\s*coding, electronics, or engineering\. We guide every student step-by-step through their first LED blink\s*to their first robot\.', 'Basic familiarity with electronics or block-based coding is helpful but <strong>not mandatory</strong>. We bridge any gaps in the first few modules and ensure every student is ready for advanced topics.'
$c = $c -replace 'What will my child specifically learn\?', 'What technologies will my child learn?'
$c = $c -replace 'Over the 30 modules, they learn <strong>Block-based Coding</strong> \(via micro:bit\), <strong>Basic\s*Electronics</strong> \(Ohm.s Law, Breadboarding\), <strong>3D Design</strong> \(CAD fundamentals\), and\s*<strong>Robotics Automation</strong>\. It.s a multi-disciplinary approach\.', 'Over 30 modules, they master <strong>Arduino C++</strong>, <strong>Python</strong>, <strong>IoT & Cloud Platforms</strong> (ThingSpeak, Blynk), <strong>Computer Vision</strong> (OpenCV), and <strong>AI/ML Fundamentals</strong>.'
$c = $c -replace 'Are materials and kits included\?', 'Are hardware kits included?'
$c = $c -replace '<strong>Yes\.</strong> All essential materials, including the BBC micro:bit controllers, electronic\s*component kits, and structural parts, are provided in the lab\. Students work with professional-grade\s*tools in a safe environment\.', '<strong>Yes.</strong> All hardware including Arduino boards, ESP8266 modules, sensors, motors, and robotic chassis are provided in the lab. Students work with professional-grade tools.'
$c = $c -replace 'Can we practice project-building at home\?', 'Can students practice at home?'
$c = $c -replace 'Absolutely! While the core kits remain in the lab, we provide <strong>Online Resources</strong> and\s*project documentation that allow children to simulate and refine their code at home using free\s*platforms like Microsoft MakeCode and Tinkercad\.', 'Absolutely! Students can practice coding at home using the <strong>Arduino IDE</strong>, <strong>Python</strong>, and free cloud platforms. We also provide project documentation and online resources for continued learning.'
$c = $c -replace 'Find answers to common queries about our Beginner Level Program and how it helps young makers grow\.', 'Find answers to common queries about our Intermediate Level Program and how it develops future engineers.'

# ===== STRUCTURED DATA =====
$c = $c -replace '"name": "Beginner Level Program"', '"name": "Intermediate Level Program"'

# ===== FOOTER =====
$c = $c -replace '<div id="footer-placeholder"></div>', '<div id="footer-placeholder"></div>'

Set-Content $file $c -NoNewline
Write-Host "Intermediate transformation complete!"
