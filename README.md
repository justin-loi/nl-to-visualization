# NL2V — Natural Language to Visualization

## Overview

NL2V (Natural Language to Visualization) is a real-time interactive system that converts natural language queries into dynamic data visualizations. The application leverages Claude AI to interpret user intent and generates appropriate charts using Apache ECharts.

**Live Deployment:** https://nl2v.onrender.com/

**Demo Video:** https://www.youtube.com/watch?v=L9987J_nG8k

---

## Tech Stack

**Frontend:** React, Material UI, Apache ECharts  
**Backend:** Node.js + Express  
**LLM Integration:** Claude API (Anthropic)  
**Deployment:** Docker Compose (Local) + Render (Production)

---

## Project Structure

```
nl-to-visualization/
├── frontend/           # React application with Material UI + ECharts
├── backend/            # Node.js + Express API server
├── docker-compose.yml  # Container orchestration
├── .env.example        # Environment variable template
└── README.md
```

---

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Ports 3000 (frontend) and 5001 (backend) available

### Installation Steps

**1. Clone the Repository**

```bash
git clone https://github.com/justin-loi/nl-to-visualization.git
cd nl-to-visualization
```

**2. Configure Environment Variables**

Rename `.env.example` to `.env` in the root directory and update the following:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

**Important:** 
- Do not change `ALLOWED_ORIGIN`
- Keep `PORT`, `REACT_APP_BACKEND_URL`, and `REACT_APP_BACKEND_PORT` as configured

**3. Launch the Application**

From the root directory, run:

```bash
docker compose up
```

The frontend will be available at http://localhost:8080 and the backend API will run on http://localhost:5001.

Note:
The frontend service may take approximately 100 seconds to finish building.

---

## Usage Guide

### Example Prompts

Try entering the following natural language queries:

- "Plot a bar chart comparing Tesla vs. Ford sales from 2020–2024"
- "Show monthly temperature trends for New York, London, and Tokyo"

### Key Features

**Natural Language Chart Generation**  
Type a description of the chart you want, and the system automatically generates and displays the corresponding visualization.

**Preset Prompts**  
Quick-access preset prompts with visual indicators help users easily test common chart types without typing.

**AI-Generated Follow-Up Questions**  
After each chart is displayed, the system suggests relevant follow-up questions (e.g., "Can you show this by quarter?") to encourage deeper data exploration.

**AI Insights**  
The system provides automatic observations about each visualization, identifying patterns, highlighting outliers, or summarizing key trends.

**Chart Interaction Controls**  
Users can:
- Toggle between light and dark mode
- Copy or download chart data
- Enter fullscreen mode for enhanced viewing
- Interact with chart elements for detailed information

---

## Design & Architecture

### System Architecture

**Separation of Concerns**  
The backend handles prompt processing and LLM communication, while the frontend focuses on rendering and user interaction. This modular approach ensures maintainability and scalability.

**Real-Time Streaming**  
Server-Sent Events (SSE) stream LLM output to the frontend in real time, providing immediate feedback as the model generates responses.

**Containerization**  
Docker Compose ensures the application can be easily run, tested, and deployed in isolated environments with consistent configurations across different machines.

### Frontend Design

- Built with **Material UI** for consistent, responsive styling
- Supports **dark/light mode** theming
- Implements **fullscreen**, **copy**, and **download** functionality
- Uses **Apache ECharts** for versatile, high-performance charting
- Responsive design optimized for desktop and tablet viewing

### Security & Prompt Guardrails

**Injection Prevention**  
The system applies guardrails to block malicious or irrelevant instructions, including:
- Attempts to execute arbitrary code
- Requests to access external systems
- Efforts to override system prompts
- Off-topic or inappropriate content

**API Key Protection**  
Environment variables ensure API keys are never exposed in client-side code or version control.

---

## Testing

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

The test suite includes Jest unit tests covering core components and API endpoints.

---

## Known Limitations

**Streaming Display Lag**  
Streamed data display can experience latency with lengthy LLM responses, particularly for complex visualizations.

**Non-Dynamic Frontend Updates**  
The frontend currently waits until all chart data has arrived before rendering, rather than updating incrementally during the streaming process.

Follow-Up Question Limitations
Some of the follow-up questions generated by the model may not correspond to chartable data, resulting in prompts that cannot be visualized.

---

## Future Improvements

**Enhanced State Management**  
Implement chart history and saved sessions using a PostgreSQL database, allowing users to persist, revisit, and build upon previously generated visualizations.

**Optimized Streaming Architecture**  
Reduce SSE lag by restructuring responses into separate messages rather than a single aggregated payload.

**Dynamic Frontend Rendering**  
Parse the stream to enable progressive chart rendering, providing visual feedback as data arrives.

**Advanced Visualization Support**  
Extend model prompt tuning to handle more complex chart types, including network graphs, heatmaps, and 3D visualizations.

---

## Troubleshooting

**Container Issues**
```bash
# Rebuild containers
docker compose up build
```

**Port Conflicts**  
If ports 3000 or 5001 are already in use, modify the port mappings in `docker-compose.yml`

**API Connection Errors**  
Verify that your `ANTHROPIC_API_KEY` is correctly set in the `.env` file and that you have sufficient API credits.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Submit a pull request with a clear description

---

## Contact & Support

**Repository:** https://github.com/justin-loi/nl-to-visualization  
**Live Demo:** https://nl2v.onrender.com/  
**Video Walkthrough:** https://www.youtube.com/watch?v=L9987J_nG8k
