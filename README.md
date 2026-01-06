This project is a lightweight, fully customizable tier list maker built with vanilla TypeScript. Check it out
at https://leventecsoba.github.io/tiers/

### Features & Usage

1. Hover over the collapsible footer at the bottom-middle of the screen.
2. Click the file input button to select images from your device or paste images right from your clipboard.
3. Click and hold any image, then drag it to your desired tier. Items in tiers can be dragged between tiers.
4. When you're done, click the export button to download your tier list as a PNG image.

Click the settings button found in the footer to **customize tiers**:

- **Edit Labels**: Change tier names (S, A, B, C, etc.) to anything you want
- **Change Colors**: Pick custom colors for each tier background
- **Add Tiers**: Create new tier rows with the + button
- **Remove Tiers**: Delete tiers you don't need with the × button
- **Image Backgrounds**: Adjust the background color behind transparent images

### Tech Stack

- TypeScript (vanilla, no frameworks)
- Vite (build tool & dev server)
- CSS3 (custom properties, animations, transitions)

### Custom Drag System

This app implements a custom dragging system using mouse events (`mousedown`, `mousemove`, `mouseup`).

**Key components:**

- **Drag Ghost**: A visual clone that follows the cursor during dragging, created dynamically and positioned absolutely
- **Drag Target**: A placeholder element that appears in valid drop zones, showing exactly where the item will land
- **Drag Source**: The original element being dragged gets marked with opacity to indicate it's in motion
- **State Tracking**: The selected draggable ID is stored in global state, allowing any component to access drag
  information

### Export System

The container DOM element is serialized into an XML string using `XMLSerializer` and all available CSS rules are
collected, then wrapped in an SVG `<foreignObject>`. The resulting SVG is loaded as an image source, drawn to an HTML
canvas, and exported as PNG via `canvas.toBlob()`

### State Management

- Plain JavaScript objects hold tier definitions and draggable items
- Pure functions handle CRUD operations (add, update, remove)
- Each item gets a unique ID via `crypto.randomUUID()`

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### License

Apache License 2.0