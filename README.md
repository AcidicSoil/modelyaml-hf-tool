# model.yaml HF Builder

A simple web-based tool to generate `model.yaml` and `manifest.json` files for use with LM Studio, allowing you to swap base models with any compatible Hugging Face repository.

This application provides a user-friendly form to define all the necessary parameters for a custom model configuration. As you fill out the form, the corresponding `model.yaml` and `manifest.json` are generated in real-time, ready to be copied and used.

## Features

- **Intuitive Form Interface:** Easily configure your model's identity, metadata, operation parameters, and custom fields.
- **Real-time Generation:** Instantly see the generated `model.yaml` and `manifest.json` as you update the form.
- **Hugging Face Integration:** Specify any Hugging Face repository as a source for your model.
- **One-Click Copy:** Quickly copy the generated file contents to your clipboard.
- **Built with Modern Tech:** A responsive and fast interface built with React, Vite, and Tailwind CSS.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/modelyaml-hf-tool.git
    cd modelyaml-hf-tool
    ```

2.  **Install dependencies:**
    This project uses `pnpm`.
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Tech Stack

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Icons:** [unplugin-icons](https://github.com/unplugin/unplugin-icons)