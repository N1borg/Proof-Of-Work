# Robin Caboche - Proof of Work

> **Live Portfolio:** [https://niborgpro.fr](https://niborgpro.fr)

A highly interactive, physics-driven "Proof of Work" portfolio constructed entirely from Markdown files inside a React-D3 ecosystem. This project abandons standard downward-scrolling resumes in favor of an exploratory constellation model representing my skills, projects, and experiences in a truly dynamic dimension.

## 🚀 Key Features

- **D3 Physics Engine:** Real-time responsive gravitational physics allowing node tossing, pulling, and cinematic dragging.
- **Dynamic Content Injection:** Fully parsed from lightweight Markdown files in the `content/` cluster. 
- **Smart Camera Navigation:** Tweening "state-saving" zoom camera that natively handles boundary-box detection and focuses on selected clusters.
- **Glassmorphic UI Engine:** Stunning, fully hardware-accelerated aesthetic overlays. 

## 🛠️ Technology Stack

- **Framework:** React + Vite
- **Simulation Engine:** `d3-force` & `d3-zoom`
- **Styling:** Tailwind CSS + Vanilla PostCSS 
- **Content Parsing:** `react-markdown` + `gray-matter` logic
- **Icons:** `lucide-react`
- **Deployment:** GitHub Pages CNAME (Automated CI/CD via GitHub Actions)

---

## 💻 Local Installation (Node)

Ensure you have Node.js 18+ installed on your machine.

1. **Clone the repository**
   ```bash
   git clone https://github.com/N1borg/Proof-Of-Work.git
   cd Proof-Of-Work
   ```

2. **Install exact dependencies**
   ```bash
   npm install
   ```

3. **Spin up the development server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173` to explore the interactive graph!

---

## 🐳 Docker Setup

This project features a fully optimized multi-stage Docker build, serving the compressed production bundle natively via an ultra-lightweight NGINX alpine container.

### Build the Image
```bash
docker build -t proof-of-work .
```

### Run the Container
```bash
docker run -d -p 8080:80 --name my-portfolio proof-of-work
```
Navigate to `http://localhost:8080`.

---

## 📝 How to add content

This portfolio is statically generated around a local graph algorithm. Adding new nodes is incredibly simple by design:

1. Navigate to `/public/content/projects/` (or create a new category directory).
2. Create standard `node_name.md` files.
3. Use frontmatter block configurations to configure UI routing:
   ```yaml
   ---
   id: "my_project"
   label: "My Project"
   category: "Cybersecurity"
   icon: "Shield"
   color: "#10b981"
   size: 16
   connections: ["me", "another_project"]
   ---
   # Content Data
   Here goes standard markdown...
   ```
   
The Graph Engine automatically re-synchronizes the DOM bounding boxes, physics matrices, and SVG link configurations dynamically!

---
_Designed & Built by [Robin Caboche](https://github.com/N1borg)_
