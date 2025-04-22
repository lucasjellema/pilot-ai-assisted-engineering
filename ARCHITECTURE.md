# Pilot AI Engineering Data Visualization - Architecture Document

## System Overview

The Pilot AI Engineering Data Visualization application is designed as a client-side web application that processes and visualizes participant data from the Baseline Measurement of Pilot AI Assisted Software Engineering. The application follows a modular architecture with clear separation of concerns between data handling, visualization, and user interaction components.

## Technical Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Visualization**: Chart.js (loaded via CDN)
- **Data Format**: JSON
- **Deployment**: Static web hosting (local development server)

## Architecture Components

### 1. Data Layer

#### 1.1 Data Loading and Parsing (`data.js`)

The data layer is responsible for loading, parsing, and processing the participant data from JSON files.

**Key Components:**
- `loadParticipantData()`: Asynchronous function that fetches the JSON data file
- `parseListField()`: Utility function to parse semicolon-separated fields into arrays
- `getUniqueValues()`: Extracts unique values from specific fields across all participants
- `countFieldValues()`: Counts occurrences of values in specific fields
- `filterParticipants()`: Filters participants based on field values with case-insensitive matching
- `getParticipantsWithValue()`: Returns participants that match specific field values
- `getParticipantById()`: Retrieves a specific participant by ID
- `extractAIAssistants()`: Specialized function to extract AI assistant names from text

**Data File Selection:**
- `getDataFilePath()`: Determines which data file to load based on URL parameters or localStorage
- Supports dynamic switching between different data sources via the `parDataFile` URL parameter
- Persists data file selection across page navigations using localStorage

#### 1.2 Data Structure

The participant data follows this structure:
```javascript
{
  "ID": string,
  "Start time": string,
  "Completion time": string,
  "Your Name": string,
  "Company": string,
  "Role": string,
  "Daily Engineering Activities": string, // semicolon-separated list
  "Technology Stack for Development": string, // free text, often with newlines
  "Supporting Technology Stack": string, // free text, often with newlines
  "IDE": string, // comma or newline separated list
  "Experience with AI Coding Assistants": string, // free text
  "Objectives, Priorities and Expectations": string, // free text
  "Track Participation": string, // semicolon-separated list
  "Expected Time Commitment": string,
  "Activities to Explore": string, // semicolon-separated list
  "Usage Intent": string, // semicolon-separated list
  "Code Base": string, // semicolon-separated list
  "Other (requests | suggestions | questions)": string // free text
}
```

### 2. Visualization Layer

The visualization layer is responsible for creating interactive charts, graphs, and visual elements based on the processed data.

#### 2.1 Chart Generation

- **Chart.js Integration**: Uses Chart.js library for creating pie charts, bar charts, and other visualizations
- **Custom Configuration**: Each chart has specific configuration for colors, labels, tooltips, and interaction events
- **Dynamic Updates**: Charts update in response to user interactions and filtering

**Key Visualization Components:**
- `createCompaniesPieChart()`: Visualizes distribution of companies
- `createTimeCommitmentChart()`: Shows expected time commitment distribution
- `createTechnologyChart()`: Displays most common technologies
- `createTechnologyCloud()`: Creates an interactive tag cloud of technologies

#### 2.2 Interactive Elements

- **Technology Cloud**: Interactive tag cloud where size represents frequency
- **Clickable Tags**: Tags that filter participants when clicked
- **Tooltips**: Hover information showing participant names and additional details
- **Count Badges**: Visual indicators of how many participants match each tag

### 3. Page Structure and Navigation

The application is structured as multiple HTML pages with consistent navigation:

#### 3.1 Page Components

- **Overview Page** (`index.html`, `overview.js`): Summary statistics and key metrics
- **Technology Page** (`technology.html`, `technology.js`): Technology stack visualization
- **AI Experience Page** (`experience.html`, `experience.js`): AI coding assistants experience
- **Objectives Page** (`objectives.html`, `objectives.js`): Participant objectives and expectations
- **Feedback Page** (`feedback.html`, `feedback.js`): Other feedback and comments
- **Detail Page** (`detail.html`, `detail.js`): Individual participant details
- **Filter Page** (`filter.html`, `filter.js`): Filtered participant lists

#### 3.2 Navigation System

- **Main Navigation**: Consistent header navigation across all pages
- **Back Links**: Links to return to previous pages
- **Detail Navigation**: Next/Previous buttons for navigating between participant details
- **Filter Links**: Dynamic links that apply filters based on selected criteria

### 4. User Interaction and Filtering

#### 4.1 Filtering Mechanism

- **Complex Filtering**: Supports filtering across multiple fields
- **Case-Insensitive Matching**: Performs case-insensitive comparisons for more accurate results
- **List Field Handling**: Special handling for semicolon-separated list fields
- **Technology Stack Filtering**: Special handling for technology stacks with partial matching

#### 4.2 User Interaction Flow

1. User views visualizations on main pages
2. User clicks on a chart segment, tag, or list item
3. System filters participants based on the selected criteria
4. Filtered results are displayed with relevant information
5. User can view detailed information about specific participants

## Data Flow

1. **Data Loading**:
   ```
   URL Parameters → getDataFilePath() → loadParticipantData() → JSON Data
   ```

2. **Data Processing**:
   ```
   JSON Data → Parsing Functions → Processed Data → Visualization Functions
   ```

3. **User Interaction**:
   ```
   User Click → Filter Functions → Filtered Data → Updated Visualization
   ```

4. **Navigation**:
   ```
   Page Link → New Page → loadParticipantData() → Page-Specific Visualization
   ```

## Error Handling

- **Data Loading Errors**: Displays user-friendly error messages when data cannot be loaded
- **Empty Results Handling**: Shows appropriate messages when filters return no results
- **Fallback Values**: Uses default values when data fields are missing or empty

## Performance Considerations

- **Efficient Filtering**: Optimized filtering functions to handle large datasets
- **Lazy Loading**: Charts and visualizations are created only when needed
- **Caching**: Participant data is cached in memory to avoid redundant fetching
- **Minimal Dependencies**: Limited external dependencies to reduce load time

## Security Considerations

- **Client-Side Only**: No server-side processing or storage
- **Data Privacy**: Option to use obfuscated data via the `parDataFile` parameter
- **No External APIs**: No data is sent to external services

## Extensibility

The architecture is designed to be easily extensible:

- **Modular JavaScript**: Each functionality is encapsulated in its own function
- **Consistent Data Processing**: Standard patterns for data handling
- **Separation of Concerns**: Clear separation between data, visualization, and interaction logic
- **Configurable Components**: Visualization components can be configured and reused

## Future Enhancements

- **Advanced Search**: Implementation of more complex search functionality
- **Data Export**: Ability to export filtered data in various formats
- **Additional Visualizations**: More complex and interactive data visualizations
- **Responsive Enhancements**: Further improvements for mobile and tablet devices
- **Performance Optimization**: Additional optimizations for larger datasets
