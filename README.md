# GTD Productivity App

A mobile productivity app inspired by the [Getting Things Done (GTD)](https://gettingthingsdone.com/) method by David Allen. Organize your tasks, process them efficiently, and manage your next actions using a minimal, theme-aware interface.

## ✨ Features

- 📥 **Inbox**: Quickly capture tasks
- ⚙️ **Process**: Review & organize tasks into Projects & Contexts
- ✅ **Next Actions**: Focus on actionable tasks
- 🗂️ **Projects & Contexts**: Categorize and filter your work
- 🎨 **Custom Theme Support**:
  - Light/Dark mode
  - Changeable accent color
- 💾 **Persistent State**: Tasks & projects saved using Zustand + AsyncStorage
- 🎯 **Smooth UI**: Includes floating tab bar, animated headers, and animated task processing

---

## 📸 Screenshots

> *(Optional: Add if you have screenshots or gifs)*

---

## 📦 Tech Stack

| Tech         | Purpose                        |
|--------------|---------------------------------|
| Expo         | Cross-platform build & dev     |
| React Native | UI Framework                   |
| Zustand      | Global state management        |
| AsyncStorage | Persistent local storage       |
| TypeScript   | Type safety                    |
| Expo Router  | Routing                        |
| Animated API | Header & task animations       |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- Expo CLI ≥ 7.x  
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gtd-productivity-app.git
cd gtd-productivity-app

# Install dependencies
npm install

# Start the Expo app
npx expo start
```

Then scan the QR code with the Expo Go app on your mobile device or run on emulator.

### 📁 Folder Structure (Simplified)

app/
 └── (tabs)/
      ├── inbox/
      ├── process/
      ├── next-actions/
      └── more/

src/
 ├── components/
 ├── context/
 ├── store/
 ├── models/
 ├── constants/
 └── styles/
 
### ⚙️ Configuration

ThemeContext: Manages dark/light mode and accent color
taskStore and projectStore: Use Zustand for global state and persistence
Custom tab bar (CustomTabBar) with animated floating disc
Animated headers via AnimatedHeaderContainer

### 📄 License

MIT © Tej Sai Maneesh
