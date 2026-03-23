import { Fish, Ruler, Award, Settings, Crown, Star, HelpCircle, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-4">
      {/* 头部信息 */}
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 bg-[#1A5F2A] rounded-full flex items-center justify-center text-3xl mb-4">
          🐟
        </div>
        <h1 className="text-xl font-bold mb-1">钓鱼小白</h1>
        <p className="text-gray-400 text-sm">武汉 · 钓鱼爱好者</p>
        
        {/* 统计 */}
        <div className="flex gap-8 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FF6B35]">23</p>
            <p className="text-xs text-gray-400">捕获</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FF6B35]">15.6</p>
            <p className="text-xs text-gray-400">kg</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FF6B35]">8</p>
            <p className="text-xs text-gray-400">鱼种</p>
          </div>
        </div>
      </div>

      {/* 会员卡片 */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-white" />
            <div>
              <p className="font-semibold">开通会员</p>
              <p className="text-xs opacity-80">高清地图、离线下载</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-white opacity-60" />
        </div>
      </div>

      {/* 功能列表 */}
      <div className="space-y-2">
        <div className="bg-[#1A2832] rounded-xl overflow-hidden border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-yellow-400" />
              <span>排行榜</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-purple-400" />
              <span>我的成就</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Fish className="h-5 w-5 text-green-400" />
              <span>我的装备</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="bg-[#1A2832] rounded-xl overflow-hidden border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-gray-400" />
              <span>设置</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-gray-400" />
              <span>帮助与反馈</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* 版本信息 */}
      <p className="text-center text-gray-600 text-xs mt-8">
        钓鱼脑 v0.1.0
      </p>
    </div>
  );
}
