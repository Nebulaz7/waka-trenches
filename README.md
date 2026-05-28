# Waka Trenches 🏆

A lightweight, secure, and easily deployable Next.js application that aggregates WakaTime statistics across your team into a private leaderboard.

Designed for small teams, friends, or coding groups to see who is spending the most time ""in the trenches.""

## ✨ Features

- **Zero Database Required**: All data is fetched on the fly and API keys are stored securely in environment variables.
- **Secure Architecture**: API keys live server-side in Next.js API routes; the browser never sees them.
- **Password Protected**: Simple front-end password gate to keep your team's leaderboard private.
- **Beautiful UI**: Dark-themed, WakaTime-inspired UI with real WakaTime profile avatars.
- **Detailed Stats**: Rank, Programmer, Hours Today, Weekly Hours, Daily Average, and Top Languages.
- **Interactive**: Toggle between Today and 7 Days views and sort by any column.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A [WakaTime](https://wakatime.com/) account and [API Key](https://wakatime.com/settings/api-key) for each team member.

### Local Development

1. **Clone the repository:**
   `bash
git clone https://github.com/yourusername/waka-trenches.git
cd waka-trenches
`

2. **Install dependencies:**
   `bash
npm install
`

3. **Configure Environment Variables:**
   Create a .env.local (or .env) file in the root directory.

   `env

   # The password required to view the leaderboard

   NEXT_PUBLIC_APP_PASSWORD=your_super_secret_password

   # Team members (Format: Name:API_KEY)

   WAKATIME_MEMBER_1=Josh:waka_1234567890abcdef
   WAKATIME_MEMBER_2=James:waka_0987654321fedcba
   WAKATIME_MEMBER_3=Ezekiel:waka_1122334455aabbcc
   `
   _Note: You can add as many WAKATIME_MEMBER_X variables as you need._

4. **Run the development server:**
   `bash
npm run dev
`
   Open http://localhost:3000 with your browser to see the result.

## ☁️ Deployment

Waka Trenches is optimized for [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your environment variables (NEXT*PUBLIC_APP_PASSWORD and WAKATIME_MEMBER*\*) in the Vercel dashboard.
4. Deploy!

_Note: To add or remove a member later, simply update the environment variables in your hosting dashboard and trigger a redeploy._

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Optimized for Vercel
- **API**: [WakaTime API](https://wakatime.com/developers)

## 📄 License

This project is open-sourced under the MIT License.
