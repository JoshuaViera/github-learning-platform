# 🚀 Git Learning Platform v2.0

A production-ready, interactive Git learning platform built specifically for Pursuit fellowship students. Master Git commands through hands-on challenges with real-time visualization, intelligent error handling, and comprehensive progress tracking.

## ✨ Live Demo

- **Production:** [[your-vercel-url.vercel.app](https://github-learning-platform.vercel.app)]
- **Test Account:** Use any @pursuit.org email with Google Sign-In

---

## 🎯 Key Features

### 🎓 Learning Experience
- **24 Interactive Challenges** - Progressively structured from beginner to advanced (505 total points)
- **6 Learning Modules** - Organized curriculum with clear progression path
- **Real-Time Git Visualization** - See your Git tree update as you type commands
- **Interactive Terminal** - Practice Git commands in a safe, simulated environment
- **Smart Error Handling** - Typo detection with helpful suggestions (e.g., "git innit" → "git init")
- **Command History Playback** - Replay and review your command sequence
- **Progressive Hints** - Multi-level hint system to guide without spoiling
- **Solution Explanations** - Detailed breakdowns with step-by-step walkthroughs

### 📊 Progress & Analytics
- **Real-Time Progress Tracking** - Automatically synced to Firebase
- **Module Prerequisites** - Locked modules unlock as you progress
- **Visual Progress Indicators** - Completion percentage per module
- **Achievement System** - Earn points and track your improvement
- **Personal Dashboard** - View your stats, streaks, and next challenges

### 👨‍💼 Admin Features
- **Admin Dashboard** - Platform-wide statistics and user management
- **User Leaderboard** - Top performers ranked by points
- **Challenge Analytics** - Performance metrics per challenge
- **Completion Rates** - Track which challenges need improvement
- **Active User Monitoring** - See who's learning today

### 🎨 Advanced Features
- **Merge Conflict Resolution** - Interactive conflict editor
- **Branch Visualization** - D3.js powered branch diagrams
- **Command Recording** - Export your solution as a script
- **Mobile Responsive** - Works on all devices
- **Dark Mode Ready** - Terminal with authentic styling

---

## 📚 Curriculum Breakdown

### Module 1: Git Basics (7 challenges, 105 pts)
- Initialize repositories
- Making commits
- Staging area workflow
- Writing commit messages
- Viewing history
- Git status mastery

### Module 2: Branching & Workflows (6 challenges, 120 pts)
- Creating feature branches
- Switching between branches
- Branch visualization
- Deleting branches
- Undoing changes
- Unstaging files

### Module 3: Merging Strategies (3 challenges, 90 pts)
- Fast-forward merges
- Three-way merges
- Understanding conflicts

### Module 4: Remote Repositories (5 challenges, 105 pts)
- Understanding remotes
- Pushing to GitHub
- Pulling changes
- Cloning repositories
- Fetch vs Pull

### Module 5: Advanced Techniques (2 challenges, 45 pts)
- Stashing work
- Tagging releases

### Module 6: Capstone Project (1 challenge, 40 pts)
- Complete real-world workflow
- Combines all learned concepts

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **D3.js** - Git tree visualization
- **Lucide Icons** - Beautiful iconography

### Backend & Services
- **Firebase Authentication** - Google OAuth integration
- **Cloud Firestore** - Real-time database
- **Vercel** - Serverless deployment platform

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Git installed locally

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/your-username/github-learning-platform.git
   cd github-learning-platform
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create `.env.local` in the root directory:
```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Seed the database**
```bash
   npm run seed
```
   Expected output: `✅ Successfully seeded 24 challenges!`

5. **Start the development server**
```bash
   npm run dev
```
   Navigate to `http://localhost:3000`

---

## 📊 Project Statistics

- **Version:** 2.0.0
- **Total Challenges:** 24
- **Total Points Available:** 505
- **Learning Modules:** 6
- **Lines of Code:** ~15,000+
- **Components:** 40+
- **Type Definitions:** 100% TypeScript

---

## 🗂️ Project Structure
```
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── challenges/          # Challenge listing & individual pages
│   │   ├── dashboard/           # Student dashboard
│   │   ├── admin/               # Admin dashboard
│   │   ├── analytics/           # Challenge analytics
│   │   └── login/               # Authentication
│   ├── components/
│   │   ├── learning/            # Challenge-related components
│   │   │   ├── Terminal.tsx     # Interactive terminal
│   │   │   ├── GitTree.tsx      # Git visualization
│   │   │   ├── CommandHistory.tsx
│   │   │   ├── SolutionModal.tsx
│   │   │   └── ConflictEditor.tsx
│   │   └── ui/                  # Reusable UI components
│   ├── lib/
│   │   ├── firebase/            # Firebase configuration & helpers
│   │   └── git-simulator/       # Git command simulation engine
│   │       ├── GitEngine.ts     # Core Git logic
│   │       ├── CommandExecutor.ts
│   │       ├── ValidationEngine.ts
│   │       ├── GitVisualizer.ts
│   │       ├── CommandRecorder.ts
│   │       ├── ConflictResolver.ts
│   │       └── ErrorHandler.ts
│   └── types/                   # TypeScript type definitions
├── scripts/
│   └── challenges/              # Challenge definitions
│       ├── git-basics.js
│       ├── git-branching.js
│       ├── git-merging.js
│       ├── git-remotes.js
│       ├── git-advanced.js
│       └── git-capstone.js
└── public/                      # Static assets
```

---

## 🔐 Admin Access

To grant admin access, add emails to the admin list in `src/app/admin/page.tsx`:
```typescript
const adminEmails = [
  'admin@pursuit.org',
  'your-email@pursuit.org'  // Add here
]
```

Admin features:
- View all user progress
- See platform-wide statistics
- Access detailed analytics per challenge
- Monitor active users
- View leaderboard

---

## 🧪 Testing

### Run Development Server
```bash
npm run dev
```

### Type Check
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
```

### Test Admin Access
1. Navigate to `/admin`
2. Sign in with admin email
3. Verify dashboard loads with statistics

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
   git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy!

3. **Verify Deployment**
   - Check all 24 challenges load
   - Test authentication
   - Verify admin dashboard works
   - Test challenge completion

### Post-Deployment Checklist
- [ ] All 24 challenges visible in `/challenges`
- [ ] Google OAuth working
- [ ] Progress saves to Firestore
- [ ] Admin dashboard accessible
- [ ] Git visualization renders
- [ ] Mobile responsive
- [ ] No console errors

---

## 📈 Future Enhancements

### Phase 3: Gamification (Planned)
- [ ] Achievement badges system
- [ ] Daily streak tracking
- [ ] Social sharing features
- [ ] Challenge of the day
- [ ] Competitive leaderboards

### Phase 4: Advanced Features (Planned)
- [ ] Code review challenges
- [ ] Team collaboration scenarios
- [ ] Video tutorials integration
- [ ] Certificate generation
- [ ] Email notifications

### Phase 5: Content Expansion (Planned)
- [ ] GitHub Actions challenges
- [ ] Advanced rebase scenarios
- [ ] Git hooks tutorials
- [ ] Workflow automation
- [ ] Best practices module

---

## 🤝 Contributing

This platform is built for Pursuit students. Contributions are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Challenges
1. Create challenge definition in `scripts/challenges/`
2. Follow existing challenge structure
3. Add validation tests
4. Test locally before submitting
5. Run seed script to update database

---

## 🐛 Known Issues

- Terminal may lag with 100+ commands (optimization planned)
- Git visualization limited to 50 commits (performance constraint)
- Mobile terminal keyboard may overlap on some devices

Report issues: [GitHub Issues](https://github.com/JoshuaViera/repo/issues)

---

## 📝 License

This project is built for educational purposes for Pursuit fellowship students.

---

## 👨‍💻 Author

**Joshua Viera**
- GitHub: [@https://github.com/JoshuaViera]
- Email: joshuaviera@pursuit.org
- Pursuit Fellow: 2025

---

## 🙏 Acknowledgments

- **Pursuit** - For the opportunity and support
- **Anthropic Claude** - AI pair programming assistant
- **Vercel** - Hosting platform
- **Firebase** - Backend infrastructure
- **The Pursuit Community** - Beta testers and feedback

---

## 📞 Support

For questions or support:
- Email: joshuaviera@pursuit.org
- GitHub Issues: [Create an issue](https://github.com/JoshuaViera/repo/issues)
- Pursuit Slack: #tech-help

---

## 🎓 Learning Resources

- [Official Git Documentation](https://git-scm.com/doc)
- [GitHub Learning Lab](https://lab.github.com/)
- [Pursuit Fellowship](https://www.pursuit.org/)
- [Pro Git Book](https://git-scm.com/book/en/v2)

---

**Built with ❤️ for Pursuit Students | 2025**