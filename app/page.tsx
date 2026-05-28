"use client";

import { useState, useEffect } from "react";

type MemberStat = {
  name: string;
  avatarUrl?: string;
  todayHours: number;
  weeklyHours: number;
  dailyAvg: number;
  languages: string[];
};

export default function Home() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<MemberStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortCol, setSortCol] = useState<keyof MemberStat>("weeklyHours");
  const [sortDesc, setSortDesc] = useState(true);
  const [activeTab, setActiveTab] = useState<"hours" | "ai">("hours");
  const [searchQuery, setSearchQuery] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const json = await res.json();
      setStats(json.data);
    } catch (err: any) {
      setError(err.message || "Error loading leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleSort = (col: keyof MemberStat) => {
    if (sortCol === col) {
      setSortDesc(!sortDesc);
    } else {
      setSortCol(col);
      setSortDesc(true);
    }
  };

  const filteredStats = stats.filter((stat) =>
    stat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedStats = [...filteredStats].sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];

    if (typeof valA === "string" && typeof valB === "string") {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }

    if (Array.isArray(valA)) valA = valA.length;
    if (Array.isArray(valB)) valB = valB.length;

    const numA = (valA as number) || 0;
    const numB = (valB as number) || 0;

    if (numA < numB) return sortDesc ? 1 : -1;
    if (numA > numB) return sortDesc ? -1 : 1;
    return 0;
  });

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0 && m === 0) return "0 hrs";
    if (h === 0) return `${m} mins`;
    if (m === 0) return `${h} hrs`;
    return `${h} hrs ${m} mins`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1117]">
        <form
          onSubmit={handleLogin}
          className="p-8 bg-white shadow-md rounded-lg flex flex-col gap-4"
        >
          <h1 className="text-black text-2xl font-bold">
            Waka Out Of The Trenches
          </h1>
          <p className="text-black text-sm">
            Enter password to view leaderboard
          </p>
          {passwordError && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
              {passwordError}
            </div>
          )}
          <input
            type="password"
            className="border p-2 rounded text-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  const SortIcon = ({ col }: { col: keyof MemberStat }) => {
    if (sortCol !== col) return null;
    return <span className="ml-1 text-white">{sortDesc ? "?" : "?"}</span>;
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#0c1117] text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-500 pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <h3 className="text-2xl font-semibold m-0 text-white">
              <a href="/" className="hover:text-blue-600 hover:underline">
                Waka Out Of The Trenches
              </a>
            </h3>

            <div
              className="inline-flex bg-[#1a202c] p-1 rounded-md border-none shadow-inner"
              role="tablist"
            >
              <button
                onClick={() => setActiveTab("hours")}
                className="flex items-center px-4 py-1.5 text-sm font-medium rounded-sm transition-colors"
              >
                <span className="mr-2">?</span> Hours Coded
              </button>
              {/* <button
                onClick={() => setActiveTab("ai")}
                className="flex items-center px-4 py-1.5 text-sm font-medium rounded-sm transition-colors"
              >
                <span className="mr-2">?</span> AI Lines
              </button> */}
            </div>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="text-sm border border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh Stats"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm border border-gray-700 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-gray-800 text-white">
                <th className="py-3 px-2 font-semibold w-16">
                  <span className="hidden sm:inline">Rank</span>
                  <span className="sm:hidden">#</span>
                </th>
                <th
                  className="py-3 px-2 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Programmer <SortIcon col="name" />
                </th>
                <th
                  className="py-3 px-2 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("weeklyHours")}
                >
                  <span className="hidden sm:inline">Hours Coded</span>
                  <span className="sm:hidden">Hours</span>
                  <SortIcon col="weeklyHours" />
                </th>
                <th
                  className="py-3 px-2 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("dailyAvg")}
                >
                  <span className="hidden sm:inline">Daily Average</span>
                  <span className="sm:hidden">Average</span>
                  <SortIcon col="dailyAvg" />
                </th>
                <th
                  className="py-3 px-2 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("todayHours")}
                >
                  Today <SortIcon col="todayHours" />
                </th>
                <th className="py-3 px-2 font-semibold">Languages Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {sortedStats.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-2 text-center text-whiterounded"
                  >
                    {stats.length === 0
                      ? "No team members found. Add WAKATIME_MEMBER_X environment variables."
                      : "No results match your search."}
                  </td>
                </tr>
              )}
              {sortedStats.map((stat, index) => (
                <tr
                  key={stat.name}
                  className="hover:bg-[#1a202c] transition-colors group"
                >
                  <td className="py-3 px-2 font-medium text-white">
                    {index + 1}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                        {stat.avatarUrl ? (
                          <img
                            src={stat.avatarUrl}
                            alt={stat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          stat.name.substring(0, 2)
                        )}
                      </div>
                      <a
                        href="#"
                        className="text-blue-400 hover:text-blue-300 font-medium group-hover:underline"
                      >
                        {stat.name}
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-white">
                    {activeTab === "hours"
                      ? formatTime(stat.weeklyHours)
                      : "N/A"}
                  </td>
                  <td className="py-3 px-2 text-white">
                    {activeTab === "hours" ? formatTime(stat.dailyAvg) : "N/A"}
                  </td>
                  <td className="py-3 px-2 text-white">
                    {activeTab === "hours"
                      ? formatTime(stat.todayHours)
                      : "N/A"}
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-blue-300 text-sm">
                      {stat.languages.join(", ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
