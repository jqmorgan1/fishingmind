import { Cloud, Droplets, Wind, Gauge, Moon, Waves, Sun, CloudRain } from "lucide-react";

// 钓鱼指数计算（简化版）
function calculateBiteIndex(weather: any): { score: number; level: string; bestTimes: string[] } {
  let score = 50; // 基础分
  
  // 气压影响 (最佳 1000-1013 hPa)
  const pressureDiff = Math.abs(weather.pressure - 1013);
  if (pressureDiff < 10) score += 25;
  else if (pressureDiff < 20) score += 15;
  else if (pressureDiff < 30) score += 5;
  
  // 温度影响 (最佳 20-28°C)
  const temp = weather.temperature;
  if (temp >= 20 && temp <= 28) score += 15;
  else if (temp >= 15 && temp <= 32) score += 5;
  
  // 天气状况
  if (weather.condition === 'cloudy') score += 10;
  else if (weather.condition === 'sunny') score += 5;
  
  score = Math.min(100, Math.max(0, score));
  
  let level = '较差';
  if (score >= 80) level = '极佳';
  else if (score >= 60) level = '优良';
  else if (score >= 40) level = '一般';
  
  const bestTimes = score >= 60 
    ? ['5:00 - 7:30 (清晨)', '17:00 - 19:30 (傍晚)']
    : ['6:00 - 8:00 (清晨)'];
    
  return { score, level, bestTimes };
}

export default function WeatherPage() {
  const weather = {
    temperature: 23,
    condition: 'cloudy',
    pressure: 1012,
    windSpeed: 3,
    humidity: 65,
    waterTemp: 21,
  };
  
  const biteData = calculateBiteIndex(weather);
  
  return (
    <div className="p-4">
      {/* 头部定位 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">📍 武汉</h1>
          <p className="text-sm text-gray-400">今天 2月19日</p>
        </div>
      </div>

      {/* 天气卡片 */}
      <div className="bg-gradient-to-br from-[#1A5F2A] to-[#2D3E50] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Cloud className="h-16 w-16 text-white" />
            <div>
              <p className="text-5xl font-bold">{weather.temperature}°</p>
              <p className="text-gray-300">多云</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <Wind className="h-4 w-4 text-gray-300" />
            <span>风速 {weather.windSpeed}级</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="h-4 w-4 text-gray-300" />
            <span>湿度 {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-gray-300" />
            <span>气压 {weather.pressure} hPa</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Waves className="h-4 w-4 text-gray-300" />
            <span>水温 {weather.waterTemp}°C</span>
          </div>
        </div>
      </div>

      {/* 钓鱼指数 */}
      <div className="bg-[#1A2832] rounded-2xl p-6 mb-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🎣 钓鱼指数
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            biteData.score >= 80 ? 'bg-green-500' :
            biteData.score >= 60 ? 'bg-blue-500' :
            biteData.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {biteData.level}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>0</span>
            <span className="font-bold text-2xl">{biteData.score}</span>
            <span>100</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
              style={{ width: `${biteData.score}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-400">今日最佳时段：</p>
          {biteData.bestTimes.map((time, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Sun className="h-4 w-4 text-yellow-400" />
              <span>{time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 详细数据 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-400">月相</span>
          </div>
          <p className="font-semibold">满月</p>
          <p className="text-xs text-gray-500">鱼类活跃期</p>
        </div>
        
        <div className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Waves className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-400">潮汐</span>
          </div>
          <p className="font-semibold">涨潮中</p>
          <p className="text-xs text-gray-500">活跃时段</p>
        </div>
      </div>

      {/* 建议 */}
      <div className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
        <h3 className="font-semibold mb-3">📋 钓鱼建议</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>✓ 气压适中，鱼口较好</li>
          <li>✓ 多云天气，光线柔和，适合垂钓</li>
          <li>✓ 水温适宜，鱼类活跃</li>
          <li>⚠ 风力3级，建议选择避风位置</li>
        </ul>
      </div>
    </div>
  );
}
