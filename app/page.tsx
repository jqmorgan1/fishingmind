import Link from "next/link";
import { MapPin, Star, Clock, Navigation, Search, Fish } from "lucide-react";

// 模拟钓点数据
const mockSpots = [
  { id: 1, name: "东湖", distance: "3.2km", fish: "鲫鱼/鲤鱼", rating: 4.5, lat: 30.5, lng: 114.3 },
  { id: 2, name: "长江二桥", distance: "5.8km", fish: "翘嘴/鳜鱼", rating: 4.8, lat: 30.6, lng: 114.2 },
  { id: 3, name: "墨水湖", distance: "8.1km", fish: "草鱼/青鱼", rating: 4.2, lat: 30.4, lng: 114.4 },
  { id: 4, name: "南湖", distance: "12.3km", fish: "鲢鱼/鳙鱼", rating: 4.0, lat: 30.3, lng: 114.5 },
]

export default function Home() {
  return (
    <div className="p-4">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Fish className="h-8 w-8 text-[#FF6B35]" />
          <h1 className="text-2xl font-bold text-[#FF6B35]">钓鱼脑</h1>
        </div>
        <div className="text-sm text-gray-400">
          📍 武汉
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="搜索钓点..."
          className="w-full bg-[#1A2832] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
        />
      </div>

      {/* 快捷筛选 */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {['全部', '鲫鱼', '鲤鱼', '翘嘴', '路亚', '台钓'].map((tag) => (
          <button 
            key={tag}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              tag === '全部' 
                ? 'bg-[#FF6B35] text-white' 
                : 'bg-[#1A2832] text-gray-300 border border-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 地图占位 */}
      <div className="bg-[#1A2832] rounded-xl h-64 mb-6 flex items-center justify-center border border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, #1A5F2A 0%, transparent 50%), radial-gradient(circle at 70% 60%, #2D3E50 0%, transparent 50%)'
          }}></div>
        </div>
        <div className="text-center z-10">
          <MapPin className="h-12 w-12 text-[#FF6B35] mx-auto mb-2" />
          <p className="text-gray-400">地图加载中...</p>
          <p className="text-xs text-gray-500 mt-1">点击选择钓点</p>
        </div>
        {/* 模拟标记点 */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#FF6B35] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-[#FF6B35] rounded-full animate-pulse"></div>
      </div>

      {/* 附近钓点列表 */}
      <h2 className="text-lg font-semibold mb-4">附近热门钓点</h2>
      
      <div className="space-y-4">
        {mockSpots.map((spot) => (
          <Link 
            href={`/spot/${spot.id}`}
            key={spot.id}
            className="block bg-[#1A2832] rounded-xl p-4 border border-gray-700 hover:border-[#FF6B35] transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{spot.name}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Navigation className="h-3 w-3" />
                  {spot.distance}
                </p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{spot.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-1 bg-[#1A5F2A] rounded text-xs text-white">
                {spot.fish}
              </span>
              <span className="px-2 py-1 bg-[#2D3E50] rounded text-xs text-gray-300 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                今日适合
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* 添加记录按钮 */}
      <Link 
        href="/log/add"
        className="fixed bottom-24 right-4 bg-[#FF6B35] text-white p-4 rounded-full shadow-lg hover:bg-[#e55a2b] transition-colors"
      >
        <Fish className="h-6 w-6" />
      </Link>
    </div>
  );
}
