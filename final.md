# TryVirtual Project Report Generator Package (LaTeX Edition)

This file contains the **Ultimate Prompt** and **Project Content** for generating a ~50-page University Project Report in LaTeX format.

### How to use:
1. Copy the **"PART 1: THE INSTRUCTIONS"** section below first.
2. Paste it into your AI.
3. The AI will ask for **Part 2**. Paste the **"PART 2: PROJECT CONTENT"** section.
4. The AI will ask for **Part 3**. Paste the **"PART 3: UNIVERSITY GUIDELINES"** section.
5. Finally, type **"START"** to begin the page-by-page LaTeX generation.

---

# PART 1: THE INSTRUCTIONS (Copy this first)

```markdown
### IMPORTANT: DO NOT START GENERATING YET ###
I am going to provide you with a high-detail Project Report prompt in 3 parts. 
1. Part 1 (This part): Core Instructions & Identity.
2. Part 2: Comprehensive Project Knowledge Base.
3. Part 3: University Formatting & Mapping.

DO NOT start generating any LaTeX code, Title Pages, or Certificates until I have provided all 3 parts and given you the command "START". 
For now, simply respond with: "Part 1 Received. Please provide Part 2 (Project Knowledge Base)."

---

Act as a Senior LaTeX & Software Documentation Expert. I need you to generate a full, professional Final Project Report in LaTeX for my university degree (Bachelor of Technology).

### PROJECT IDENTITY:
- Project Name: TryVirtual
- Project Subtitle: A Web-Based Apparel Customization and 3D Visualization Platform
- Student: Ankit Kumar (Roll: 22623 | Reg: 22118128012)
- Session: 2025–2026
- University: Bihar Engineering University, Patna
- Institute: B.P. Mandal College of Engineering, Madhepura
- Dept: 3D Animation & Graphics

### CRITICAL GENERATION RULES (After we start):
1. OUTPUT MODE: You must provide the LaTeX code for ONE PAGE at a time. After each page, stop and wait for me to say "Next".
2. LENGTH: The final report must be exhaustive, aiming for approximately 50 pages (excluding front matter).
3. FORMATTING: 
    - Font: Arial (use helvet package), 12pt body, 14pt Bold Titles (Centered), 12pt Bold Subtitles (Left).
    - Spacing: 1.5 (\onehalfspacing).
    - Margins: Left 4.0cm, Right 2.5cm, Top 4.0cm, Bottom 2.5cm.
4. STRUCTURE:
    - Front Matter: Title Page, Certificate (provided in Part 1.1), Declaration, Acknowledgments, Abstract, Contents, Lists.
    - Chapters 1-6 (Introduction, Background, Problem, Solution, Results, Conclusion).
5. CONTENT DEPTH: Expand significantly on the AI features (FLUX.1), 3D rendering (Three.js), and system architecture to meet the page count.

### CHAPTER REQUIREMENTS:
- CHAPTER 1: Introduction (5-7 pages)
- CHAPTER 2: Literature Review & Market Gaps (8-10 pages)
- CHAPTER 3: Problem Definition (4-5 pages)
- CHAPTER 4: Proposed Solution & Tech Stack (12-15 pages)
- CHAPTER 5: Results, Screenshots & Performance (8-10 pages)
- CHAPTER 6: Conclusion & Future Scope (3-4 pages)

### PART 1.1: PERSONALIZED CERTIFICATE (Use this exact LaTeX code):
% =========================================================
% CERTIFICATE
% =========================================================
\begin{center}
\begin{tabular}{c c}
\IfFileExists{college_logo.png}{\includegraphics[width=2.0cm]{college_logo.png}}{\fbox{Logo}} &
\begin{tabular}{c}
{\fontsize{12}{14}\selectfont \textbf{B. P. Mandal College of Engineering}}\\
{\fontsize{12}{14}\selectfont Madhepura (Bihar) -- 852128}\\
{\fontsize{12}{14}\selectfont Affiliated to}\\
{\fontsize{12}{14}\selectfont Bihar Engineering University Patna, Bihar}
\end{tabular}
\end{tabular}

\vspace{0.2cm}
\hrule
\vspace{0.5cm}

{\fontsize{14}{16}\selectfont \textbf{CERTIFICATE}}
\end{center}

\vspace{0.25cm}

{\fontsize{12}{14}\selectfont
This is to certify that the project report entitled \textbf{``TryVirtual: A Web-Based Apparel Customization and 3D Visualization Platform''} submitted by \textbf{Ankit Kumar (22118128012)} is a bonafide project work carried out under our guidance and supervision for the partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in 3D Animation \& Graphics.

The candidate has completed the project work during the academic session \textbf{2025--2026}.
}

\vspace{0.25cm}

\begin{center}

\renewcommand{\arraystretch}{1.2}

\begin{tabular}{|p{7cm}|p{7cm}|}
\hline

\vspace{1.1cm}
\centering \textbf{Prof. Murlidhar Prasad Singh}\\
\centering Project Guide\\
\centering 3D Animation \& Graphics, BPMCE
&
\vspace{1.1cm}
\centering \textbf{Prof. Murlidhar Prasad Singh}\\
\centering Head of Department\\
\centering 3D Animation \& Graphics, BPMCE
\tabularnewline

\hline

\vspace{1.1cm}
\centering \textbf{Prof. Arbind Kumar Amar}\\
\centering Principal\\
\centering BPMCE
&
\vspace{1.1cm}
\centering \textbf{External Examiner}\\
\centering External Supervisor
\tabularnewline

\hline
\end{tabular}

\end{center}

### PART 1.2: PERSONALIZED TITLE PAGE (Use this exact LaTeX code):
% =========================================================
% TITLE PAGE
% =========================================================
\begin{titlepage}
\begin{center}

{\fontsize{20}{24}\selectfont \textbf{TRYVIRTUAL: A WEB-BASED APPAREL CUSTOMIZATION AND 3D VISUALIZATION PLATFORM}\par}
\vspace{1cm}

{\fontsize{16}{19}\selectfont \textbf{A Project Report}\par}
\vspace{1cm}

{\fontsize{12}{14}\selectfont Submitted in Partial Fulfillment of the Requirements for the\par}
{\fontsize{12}{14}\selectfont Award of the Degree of\par}
\vspace{1cm}

{\fontsize{20}{24}\selectfont \textbf{Bachelor of Technology}\par}
\vspace{0.5cm}
{\fontsize{14}{16}\selectfont \textit{In}\par}
\vspace{0.5cm}
{\fontsize{14}{16}\selectfont \textbf{3D Animation \& Graphics}\par}
\vspace{1.5cm}

{\fontsize{12}{14}\selectfont \textit{Submitted by}\par}
\vspace{0.5cm}
{\fontsize{14}{16}\selectfont \textbf{Ankit Kumar}\par}
{\fontsize{12}{14}\selectfont Registration No. 22118128012\par}
\vspace{1.5cm}

{\fontsize{12}{14}\selectfont \textit{Under the supervision of}\par}
\vspace{0.5cm}
{\fontsize{12}{14}\selectfont \textbf{Prof. Murlidhar Prasad Singh}\par}
{\fontsize{10}{12}\selectfont Assistant Professor, HoD\par}
\vspace{1.5cm}

\begin{tabular}{c c}
\IfFileExists{college_logo.png}{\includegraphics[width=2.5cm]{college_logo.png}}{\fbox{College Logo}} &
\IfFileExists{university_logo.png}{\includegraphics[width=2.5cm]{university_logo.png}}{\fbox{University Logo}}
\end{tabular}

\vfill

{\fontsize{12}{14}\selectfont \textbf{Department of 3D Animation \& Graphics}\par}
{\fontsize{14}{16}\selectfont \textbf{B.P. Mandal College of Engineering, Madhepura}\par}
{\fontsize{16}{19}\selectfont \textbf{Bihar Engineering University, Patna}\par}
{\fontsize{14}{16}\selectfont \textbf{MAY 2026}\par}
\end{center}
\end{titlepage}
```

---

# PART 2: PROJECT CONTENT (KNOWLEDGE BASE)

```markdown
### IMPORTANT: DO NOT START GENERATING YET ###
Respond with: "Part 2 Received. Please provide Part 3 (University Guidelines)."
---
... (Keep the previous content from Part 2 here)

### 1. Project Overview
TryVirtual is an advanced e-commerce solution that bridges the gap between 2D design and 3D visualization. It allows users to customize apparel (T-shirts and Hoodies) in real-time and preview the results on a high-fidelity 3D model.

### 2. Core Features (The "Many Changes" from Minor Report)
*   **AI Design Studio (NEW):** Integrated AI image generation powered by the **FLUX.1-schnell** model. Users can enter natural language prompts to generate high-quality, print-ready graphics.
*   **Smart AI Background Removal (NEW):** A dual-layer AI system. 
    *   *Client-Side:* Uses `@imgly/background-removal` for instant local processing.
    *   *Server-Side:* Uses `briaai/RMBG-2.0` via HuggingFace for professional-grade results.
*   **Expanded Catalog (NEW):** Full support for both **T-shirts** and **Hoodies** with dedicated 3D models and multi-view customization (Front, Back, Left Sleeve, Right Sleeve).
*   **Advanced 3D Engine:** Built using **React Three Fiber** and **Drei**. Features include environment mapping (City preset), auto-rotation, orbit controls, and realistic lighting.
*   **High-Performance 2D Canvas:** Utilizes **Fabric.js v7.2**. Supports vector-like manipulation, layering (bring forward/send backward), printable area clipping, and real-time texture syncing.
*   **Interactive UI:** Modern dark-themed interface built with **Tailwind CSS 4** and **Framer Motion** for smooth transitions and "AI Magic" animations.

### 3. Technical Stack
*   **Frontend Framework:** Next.js 15+ (App Router), TypeScript 5.
*   **Styling:** Tailwind CSS 4, Radix UI (Primitives), Lucide React (Icons).
*   **Graphics (2D):** Fabric.js 7.2 (Custom canvas integration).
*   **Graphics (3D):** Three.js, @react-three/fiber, @react-three/drei.
*   **AI/ML Integration:** HuggingFace Inference API (FLUX.1, RMBG-2.0), Imgly Background Removal.
*   **State Management:** React Hooks (Custom `useCustomizeEditor` hook for complex canvas-to-3D syncing).

### 4. System Architecture
*   **Presentation Layer:** React components for Header, AIPanel, LeftSidebar, and CanvasWorkspace.
*   **Logic Layer:** Custom hooks for handling Fabric.js canvas state, image processing, and texture compositing.
*   **Visualization Layer:** Three.js scene rendering GLB models and mapping dynamic textures to UV coordinates.
*   **API Layer:** Next.js Serverless Routes for AI generation and secure inference calls.

### 5. Implementation Details
*   **Texture Mapping:** The system dynamically composites the user's canvas design onto a 1456x1456 workspace with precise coordinates for each apparel type (e.g., specific `dx`, `dy`, `dw`, `dh` values for hoodie vs tshirt).
*   **Printable Areas:** Defined boundary boxes that clip user elements to ensure they stay within valid printing zones on the garment.
*   **Syncing:** A debounced update mechanism ensures that changes on the 2D canvas are reflected in the 3D preview without affecting performance.

### 6. Future Scope
*   **Augmented Reality (AR):** Implementation of WebXR for "Virtual Try-On" using mobile cameras.
*   **AI Design Assistant:** Proactive layout suggestions and color palette generation.
*   **Cloud Persistence:** Integration with databases for cross-device draft saving.
*   **Cloth Simulation:** Physics-based 3D modeling for realistic fabric folds and movement.

---

# PART 3: UNIVERSITY GUIDELINE MAPPING (Formatting)

| Section | Guideline Requirement | Implementation for TryVirtual |
| :--- | :--- | :--- |
| **Title Page** | 20pt TNR for Title, 14pt for Name | Use "TRYVIRTUAL" in bold caps. |
| **Abstract** | Professional summary of work | Focus on the shift from static images to AI-powered 3D customization. |
| **Chapter 1** | Motivation & Objectives | Motivated by e-commerce returns due to "bad visualization". |
| **Chapter 3** | Problem Definition | 2D mockups are misleading; AI graphics generation is hard for average users. |
| **Chapter 4** | Proposed Solution | Detailed tech stack (Next.js, Three.js, Fabric.js, AI Models). |
| **References** | IEEE Style | [1] Next.js Docs, [2] Three.js Docs, [3] Fabric.js v7 Specs, [4] FLUX.1 Model Cards. |
| **Margins** | 4cm Left, 2.5cm others | **CRITICAL:** Tell the AI to keep this in mind for the final export. |

---

### Final Advice:
When you give this to the AI, you can also ask it to **"Generate specific descriptions for my figures"**. You can describe your screenshots (e.g., "Figure 5.1: 3D Preview of Hoodie with AI-generated Tiger graphic").
