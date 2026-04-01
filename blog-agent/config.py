"""
MakerWorks Blog Agent Configuration
"""

import os
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip())

# Gemini API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Pexels API Key (for blog images)
PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY", "")

# Blog Settings
BLOG_URL = "https://makerworkslab.in/blog/"
HOME_URL = "https://makerworkslab.in/"
AUTHOR = "MakerWorks Team"
WORDS_MIN = 800
WORDS_MAX = 1200

# Topic Rotation (AI + Robotics first, then all robotics)
TOPICS = [
    {
        "name": "AI in Robotics",
        "badge": "AI & Robotics",
        "badge_color": "linear-gradient(135deg, #6f42c1, #0d6efd)",
        "keywords": "artificial intelligence, machine learning, neural networks, robot intelligence, smart robots",
    },
    {
        "name": "Reinforcement Learning in Robots",
        "badge": "AI & Robotics",
        "badge_color": "linear-gradient(135deg, #6f42c1, #0d6efd)",
        "keywords": "reinforcement learning, robot training, reward systems, autonomous decision making",
    },
    {
        "name": "Computer Vision for Robotics",
        "badge": "AI & Robotics",
        "badge_color": "linear-gradient(135deg, #6f42c1, #0d6efd)",
        "keywords": "computer vision, object detection, image recognition, robot perception, OpenCV",
    },
    {
        "name": "Humanoid Robots and AI",
        "badge": "AI & Robotics",
        "badge_color": "linear-gradient(135deg, #6f42c1, #0d6efd)",
        "keywords": "humanoid robots, Boston Dynamics, Tesla Optimus, bipedal robots, human-robot interaction",
    },
    {
        "name": "Autonomous Vehicles and Self-Driving Technology",
        "badge": "Autonomous",
        "badge_color": "linear-gradient(135deg, #20c997, #0dcaf0)",
        "keywords": "self-driving cars, autonomous navigation, LiDAR, sensor fusion, autonomous systems",
    },
    {
        "name": "AI-Powered Drones",
        "badge": "Drones",
        "badge_color": "linear-gradient(135deg, #fd7e14, #ffc107)",
        "keywords": "drones, UAV, aerial robotics, drone AI, autonomous drones, delivery drones",
    },
    {
        "name": "Collaborative Robots (Cobots)",
        "badge": "Industrial",
        "badge_color": "linear-gradient(135deg, #dc3545, #e83e8c)",
        "keywords": "cobots, human-robot collaboration, safe robots, factory automation, collaborative automation",
    },
    {
        "name": "Industrial Robotics and Automation",
        "badge": "Industrial",
        "badge_color": "linear-gradient(135deg, #dc3545, #e83e8c)",
        "keywords": "industrial robots, manufacturing automation, robotic arms, factory robots, assembly line",
    },
    {
        "name": "Surgical and Medical Robots",
        "badge": "Medical",
        "badge_color": "linear-gradient(135deg, #198754, #20c997)",
        "keywords": "surgical robots, da Vinci, medical robotics, rehabilitation robots, healthcare automation",
    },
    {
        "name": "Space Robotics and Exploration",
        "badge": "Space",
        "badge_color": "linear-gradient(135deg, #212529, #6c757d)",
        "keywords": "space robots, Mars rover, satellite servicing, space exploration, NASA robots",
    },
    {
        "name": "Swarm Robotics",
        "badge": "Research",
        "badge_color": "linear-gradient(135deg, #6610f2, #6f42c1)",
        "keywords": "swarm intelligence, multi-robot systems, collective behavior, swarm coordination",
    },
    {
        "name": "Soft Robotics",
        "badge": "Research",
        "badge_color": "linear-gradient(135deg, #6610f2, #6f42c1)",
        "keywords": "soft robots, flexible actuators, bio-inspired robots, pneumatic robots, silicone robots",
    },
    {
        "name": "Agricultural Robots and Farm Automation",
        "badge": "Agriculture",
        "badge_color": "linear-gradient(135deg, #198754, #adb5bd)",
        "keywords": "agricultural robots, farming automation, harvesting robots, precision agriculture, drone farming",
    },
    {
        "name": "Warehouse and Logistics Robots",
        "badge": "Logistics",
        "badge_color": "linear-gradient(135deg, #0d6efd, #0dcaf0)",
        "keywords": "warehouse robots, AGV, logistics automation, Amazon robots, fulfillment robots",
    },
    {
        "name": "Robot Ethics and Safety",
        "badge": "Ethics",
        "badge_color": "linear-gradient(135deg, #ffc107, #fd7e14)",
        "keywords": "robot ethics, AI safety, responsible robotics, robot rights, ethical AI",
    },
]

# Gemini Generation Config
GENERATION_CONFIG = {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "max_output_tokens": 8192,
}
