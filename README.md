# TaskFlow

TaskFlow is a modern, beautiful, and efficient task management desktop application built with **React**, **TypeScript**, and **Tauri**. It allows you to track your daily tasks, analyze your productivity, and view your history—all in a native, high-performance app for macOS and Windows.


## Features

- **Task Tracker**: Create, rename, delete, and reorder tasks using a simple drag-and-drop interface.
- **Daily Consistency**: Track your habits across an 11-day rolling window (yesterday + next 10 days).
- **Analytics Dashboard**: Visualize your productivity with completion rates, current streaks, and consistency scores.
- **History View**: Review your task completion history over the last 30 days.
- **Data Persistence**: All your data is saved automatically locally on your machine.
- **Cross-Platform**: Runs natively on macOS and Windows.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

1.  **Node.js**: [Download and install](https://nodejs.org/) (Version 18+ recommended).
2.  **Rust**: Required for Tauri. Install via terminal:
    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```
    *On Windows, you may also need the "C++ build tools" component from Visual Studio Build Tools.*

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd zztaskmanger
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Development

Value run the application in development mode with hot-reloading:

```bash
npm run tauri dev
```

This will launch the native desktop window. Changes to the React code (`src/`) will reflect immediately.

### Building the Application

#### For macOS
download the file from [Releases](https://github.com/bhowmik1234/TaskFlow-/releases)

#### For Windows
download the file from [Releases](https://github.com/bhowmik1234/TaskFlow-/releases)

## Project Structure

- **`src/`**: React frontend code.
    - **`components/`**: UI components (Sidebar, Tracker, Analytics).
    - **`context/`**: Global state management (TaskContext).
    - **`lib/`**: Utilities like storage helpers.
    - **`assets/`**: Images and icons.
- **`src-tauri/`**: Rust backend code and Tauri configuration.
    - **`tauri.conf.json`**: Main configuration file (App name, version, icons).
    - **`icons/`**: App icons for different OSs.

## How to Use

1.  **Add a Task**: Type a task name in the input field at the bottom of the Tracker view and press Enter.
2.  **Mark Complete**: Click the checkbox in the grid corresponding to the task and the date.
3.  **Reorder**: Drag and drop tasks to prioritize them.
4.  **Delete/Rename**: Hover over a task name to reveal options.
5.  **Analytics**: Switch tabs to see your progress charts.
6.  **Clear Data**: Use the "Clear Data" button in the sidebar to reset everything (Caution: Irreversible!).

## License

[MIT](LICENSE)
