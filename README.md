# Pilot AI Engineering Data Visualization

A web application for visualizing and exploring participant data from the Baseline Measurement of Pilot AI Assisted Software Engineering.

## Overview

This project provides a comprehensive, interactive web application to visualize and explore participant data from the Baseline Measurement of Pilot AI Assisted Software Engineering. The application transforms raw participant data into an engaging, informative user experience that allows for dynamic exploration of survey results.

For detailed technical information about the system architecture, see the [Architecture Document](./ARCHITECTURE.md).

## Features

- **Multi-Page Interactive Web Application**
  - Overview page with key metrics and visualizations
  - Separate pages for Technology, AI Experience, Objectives & Expectations, and Other Feedback
  
- **Data Visualization Techniques**
  - Interactive, clickable charts using Chart.js
  - Pie charts and bar charts for data distribution
  - Technology cloud with dynamic sizing
  - Responsive design for all devices
  - Color-coded visualizations

- **Filtering Functionality**
  - Clickable visualizations that filter participants
  - Complex filtering across multiple fields
  - Tooltips showing participant details
  - Technology tag filtering across multiple fields

## Technical Implementation

- **Modular JavaScript Architecture**
  - Vanilla JavaScript, HTML5, CSS3
  - No external dependencies (except Chart.js via CDN)
  - Custom data processing utilities
  - Case-insensitive data handling
  - Flexible filtering mechanisms

- **Data Processing**
  - Robust parsing of semicolon-separated list fields
  - Case-insensitive handling of technology stacks
  - Flexible extraction of numeric and text-based values
  - Comprehensive error handling

## Getting Started

### Prerequisites

- Modern web browser with JavaScript support
- Local web server (for development)

### Running the Application

1. Clone this repository
2. Navigate to the project directory
3. Start a local web server in the project directory
   ```
   # Using Python's built-in HTTP server
   python -m http.server
   ```
4. Open your browser and navigate to `http://localhost:8000/webapp/`

### Using Custom Data Files

You can use a custom data file by adding the `parDataFile` parameter to the URL:

```
http://localhost:8000/webapp/index.html?parDataFile=../data/Baseline_Measurement_PilotAIAssistedSoftwareEngineering_obfuscated.json
```

The application will remember your data file choice across page navigations.

## Project Structure

```
pilot-ai-assisted-engineering/
├── data/                      # Data files
│   └── Baseline_Measurement_PilotAIAssistedSoftwareEngineering.json
├── webapp/                    # Web application
│   ├── css/                   # Stylesheets
│   │   └── styles.css
│   ├── js/                    # JavaScript files
│   │   ├── data.js            # Data loading and processing
│   │   ├── filter.js          # Filtering functionality
│   │   ├── overview.js        # Overview page functionality
│   │   ├── technology.js      # Technology page functionality
│   │   ├── experience.js      # AI Experience page functionality
│   │   ├── objectives.js      # Objectives page functionality
│   │   ├── feedback.js        # Feedback page functionality
│   │   └── detail.js          # Participant detail page functionality
│   ├── index.html             # Overview page
│   ├── technology.html        # Technology page
│   ├── experience.html        # AI Experience page
│   ├── objectives.html        # Objectives page
│   ├── feedback.html          # Feedback page
│   ├── detail.html            # Participant detail page
│   └── filter.html            # Filtered participants page
└── README.md                  # This file
```

## Design Principles

- User-centric interactive design
- Clear, informative visualizations
- Consistent color schemes
- Accessibility considerations

## License

This project is proprietary and confidential.

## Acknowledgments

- Chart.js for visualization capabilities
- All participants who contributed to the Baseline Measurement survey
