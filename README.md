# Snakey - Interactive Data Visualization Dashboard

![Angular](https://img.shields.io/badge/Angular-17.3-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![D3.js](https://img.shields.io/badge/D3.js-7.9-orange?logo=d3.js)
![License](https://img.shields.io/badge/License-MIT-green)

An interactive Angular application that creates beautiful Sankey diagrams for visualizing hierarchical data flows and relationships. Perfect for displaying statistical data classifications, organizational structures, and data distribution patterns.

## 🌟 Features

- **Interactive Sankey Diagrams**: Three-column flow visualization with smooth curved connections
- **Real-time Highlighting**: Click any node to highlight connected paths and relationships
- **Responsive Design**: Adapts to different screen sizes and data volumes
- **Icon Integration**: Visual icons for different data categories and types
- **Tree Structure**: Hierarchical branching from main data trunk
- **Data Classification**: Support for multiple security levels (Open, Confidential, Sensitive, Secret)
- **Smooth Animations**: Elegant transitions and hover effects

## 🚀 Demo

The application visualizes data across three main columns:
- **Domains**: Topic categories (Economy, Population & Demographic, Agriculture & Environment, etc.)
- **Products**: Data types (Reports, Analytical Apps, Experimental Statistics)
- **Classifications**: Security levels with item counts

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Angular CLI](https://angular.io/cli) (version 17.x)

```bash
npm install -g @angular/cli@17
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snakey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

## 📦 Tech Stack

### Core Framework
- **Angular 17.3** - Modern web framework with standalone components
- **TypeScript 5.4** - Type-safe JavaScript development
- **SCSS** - Enhanced CSS with variables and mixins

### Data Visualization
- **D3.js 7.9** - Powerful data manipulation and SVG rendering
- **d3-sankey 0.12** - Specialized Sankey diagram layouts

### Development Tools
- **Angular CLI 17.3** - Command line interface for Angular
- **Karma** - Test runner for unit tests
- **Jasmine** - Testing framework

## 🏗️ Project Structure

```
snakey/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── sankey-diagram/          # Main visualization component
│   │   │   ├── statistics-visualization/ # Additional chart components
│   │   │   └── tree-chart/              # Tree visualization component
│   │   ├── models/                      # TypeScript interfaces and types
│   │   ├── services/                    # Data services and utilities
│   │   ├── app.component.*              # Root component
│   │   └── app.config.ts                # Application configuration
│   ├── assets/                          # Static assets (images, icons)
│   ├── styles.scss                      # Global styles
│   └── index.html                       # Main HTML file
├── angular.json                         # Angular workspace configuration
├── package.json                         # Dependencies and scripts
└── tsconfig.json                        # TypeScript configuration
```

## 🎯 Usage

### Basic Implementation

The main component accepts data in a specific hierarchical format:

```typescript
export interface DataStructure {
  total_count: number;
  topic_pages: Domain[];
}

export interface Domain {
  id: number;
  name: string;
  light_icon: string;
  dark_icon: string;
  count: number;
  classifications: Product[];
}
```

### Using the Sankey Component

```html
<app-sankey-diagram [data]="apiData"></app-sankey-diagram>
```

### Customization

The component supports various customization options:

```typescript
// Adjust dimensions
width = 1400;
height = 700;
columnWidth = 220;
columnSpacing = 120;
nodeHeight = 45;
```

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
ng test

# End-to-end tests (when configured)
ng e2e
```

## 🔧 Build

Build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## 📊 Data Format

The application expects data in the following JSON structure:

```json
{
  "total_count": 233,
  "topic_pages": [
    {
      "id": 575,
      "name": "Economy",
      "light_icon": "path/to/icon.png",
      "dark_icon": "path/to/dark-icon.png",
      "count": 179,
      "classifications": [
        {
          "id": 511,
          "key": "reports",
          "name": "Reports",
          "count": 139,
          "data_classifications": [
            {
              "name": "0 - Open",
              "label": "Open",
              "count": 64
            }
          ]
        }
      ]
    }
  ]
}
```

## 🎨 Styling

The application uses SCSS for styling with:
- CSS custom properties for theming
- Responsive design patterns
- Smooth animations and transitions
- Accessible color schemes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🔮 Future Enhancements

- [ ] Export functionality (PNG, SVG, PDF)
- [ ] Dynamic data loading from APIs
- [ ] Multiple visualization themes
- [ ] Zoom and pan capabilities
- [ ] Data filtering and search
- [ ] Animation controls
- [ ] Accessibility improvements

---

**Built with ❤️ using Angular and D3.js**
