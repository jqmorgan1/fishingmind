import Link from "next/link";
import { Plus, Fish, Ruler, Calendar, MapPin, Thermometer, Cloud, Trash2 } from "lucide-react";

// 模拟渔获数据
const mockLogs = [
  {
    id: 1,
    fish: "翘嘴",
    weight: "2.3kg",
    length: "65cm",
    spot: "东湖",
    date: "2026-02-19",
    time: "18:30",
    weather: "多云 22°C",
    bait: "亮片",
  },
  {
    id: 2,
    fish: "鲫鱼",
    weight: "0.5kg",
    length: "28cm",
    spot: "墨水湖",
    date: "2026-02-18",
    time: "07:15",
    weather: "晴 18°C",
    bait: "蚯蚓",
  },
  {
    id: 3,
    fish: "鲤鱼",
    weight: "3.2kg",
    length: "72cm",
    spot: "长江二桥",
    date: "2026-02-16",
    time: "06:00",
    weather: "阴 20°C",
    bait: "玉米",
  },
  {
    id: 4,
    fish: "鳜鱼",
    weight: "1.1kg",
    length: "45cm",
    spot: "汉江",
    date: "2026-02-14",
    time: "19:30",
    weather: "小雨 16°C",
    bait: "软虫",
  },
];

export default function LogPage() {
  const totalFish = mockLogs.length;
  const totalWeight = mockLogs.reduce((acc, log) => acc + parseFloat(log.weight), 0);
  
  return (
    <div className="p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🎣 我的渔获</h1>
        <Link 
          href="/log/add"
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          添加记录
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Fish className="h-5 w-5 text-[#FF6B35]" />
            <span className="text-sm text-gray-400">捕获</span>
          </div>
          <p className="text-2xl font-bold">{totalFish} <span className="text-sm font-normal text-gray-400">条</span></p>
        </div>
        <div className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Ruler className="h-5 w-5 text-[#FF6B35]" />
            <span className="text-sm text-gray-400">总重</span>
          </div>
          <p className="text-2xl font-bold">{totalWeight.toFixed(1)} <span className="text-sm font-normal text-gray-400">kg</span></p>
        </div>
      </div>

      {/* 渔获列表 */}
      <div className="space-y-4">
        {mockLogs.map((log) => (
          <div key={log.id} className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1A5F2A] rounded-full flex items-center justify-center">
                  <Fish className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{log.fish}</h3>
                  <p className="text-sm text-gray-400">{log.weight} | {log.length}</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-red-400">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin className="h-4 w-4" />
                {log.spot}
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="h-4 w-4" />
                {log.date} {log.time}
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Thermometer className="h-4 w-4" />
                {log.weather}
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Cloud className="h-4 w-4" />
                饵料: {log.bait}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态提示 */}
      {mockLogs.length === 0 && (
        <div className="text-center py-12">
          <Fish className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">还没有渔获记录</p>
          <Link 
            href="/log/add"
            className="text-[#FF6B35] hover:underline"
          >
            添加第一条渔获
          </Link>
        </div>
      )}
    </div>
  );
}
