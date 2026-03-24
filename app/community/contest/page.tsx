import { Trophy, Medal, Users, Clock, ChevronRight, Crown, Fish, Target, Star } from "lucide-react";

// 模拟竞赛数据
const contests = [
  {
    id: 1,
    title: "春季翘嘴争霸赛",
    description: "钓获最大翘嘴，赢取顶级路亚装备！",
    type: "重量赛",
    prize: "高端路亚竿 + 3000元",
    participants: 128,
    timeLeft: "还剩3天",
    status: "进行中",
    cover: "🎣",
  },
  {
    id: 2,
    title: "周末渔乐赛",
    description: "周末休闲钓，开心最重要",
    type: "娱乐赛",
    prize: "渔具优惠券",
    participants: 56,
    timeLeft: "还剩1天",
    status: "进行中",
    cover: "🧑‍🌾",
  },
  {
    id: 3,
    title: "巨物挑战赛",
    description: "单尾最重，冲击10斤巨物！",
    type: "重量赛",
    prize: "现金5000元",
    participants: 89,
    timeLeft: "还剩5天",
    status: "进行中",
    cover: "🐋",
  },
  {
    id: 4,
    title: "路亚大师赛",
    description: "专业路亚选手的终极对决",
    type: "技艺赛",
    prize: "专业级路亚套装",
    participants: 234,
    timeLeft: "已结束",
    status: "已结束",
    cover: "🎯",
  },
];

// 热门话题
const topics = [
  { id: 1, name: "路亚专区", posts: "2.3k", icon: "🎣" },
  { id: 2, name: "台钓进阶", posts: "1.8k", icon: "🧑‍🌾" },
  { id: 3, name: "海钓冒险", posts: "956", icon: "⚓" },
  { id: 4, name: "渔具评测", posts: "1.2k", icon: "🔧" },
  { id: 5, name: "新手入门", posts: "3.1k", icon: "📚" },
];

export default function ContestPage() {
  return (
    <div className="p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-400" />
          竞赛活动
        </h1>
      </div>

      {/* 进行中的竞赛 */}
      <h2 className="text-lg font-semibold mb-4">🏆 正在进行</h2>
      <div className="space-y-4 mb-8">
        {contests.filter(c => c.status === '进行中').map((contest) => (
          <a 
            href={`/community/contest/${contest.id}`}
            key={contest.id}
            className="block bg-[#1A2832] rounded-xl p-4 border border-gray-700 hover:border-[#FF6B35] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{contest.cover}</div>
                <div>
                  <h3 className="font-semibold">{contest.title}</h3>
                  <p className="text-sm text-gray-400">{contest.description}</p>
                </div>
              </div>
              <Crown className="h-5 w-5 text-yellow-400" />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-gray-400">
                  <Users className="h-4 w-4" />
                  {contest.participants}人
                </span>
                <span className="flex items-center gap-1 text-orange-400">
                  <Clock className="h-4 w-4" />
                  {contest.timeLeft}
                </span>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                {contest.type}
              </span>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-400">🏅 奖品</span>
              <span className="font-semibold text-yellow-400">{contest.prize}</span>
            </div>
          </a>
        ))}
      </div>

      {/* 已结束竞赛 */}
      <h2 className="text-lg font-semibold mb-4">✅ 已结束</h2>
      <div className="space-y-3 mb-8">
        {contests.filter(c => c.status === '已结束').map((contest) => (
          <div 
            key={contest.id}
            className="block bg-[#1A2832] rounded-xl p-4 border border-gray-700 opacity-60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{contest.cover}</div>
                <div>
                  <h3 className="font-semibold text-gray-400">{contest.title}</h3>
                  <p className="text-xs text-gray-500">{contest.participants}人参与</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                已结束
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 我的竞赛成就 */}
      <div className="bg-gradient-to-r from-[#1A5F2A] to-[#2D3E50] rounded-xl p-4 mb-8">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Medal className="text-yellow-400" />
          我的竞赛成就
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#FF6B35]">3</p>
            <p className="text-xs text-gray-300">参赛次数</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">1</p>
            <p className="text-xs text-gray-300">获得名次</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">156</p>
            <p className="text-xs text-gray-300">累计积分</p>
          </div>
        </div>
      </div>

      {/* 热门话题 */}
      <h2 className="text-lg font-semibold mb-4">🔥 热门话题</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {topics.map((topic) => (
          <a
            key={topic.id}
            href={`/community/topic/${topic.id}`}
            className="flex-shrink-0 bg-[#1A2832] rounded-full px-4 py-2 border border-gray-700 hover:border-[#FF6B35] transition-colors"
          >
            <span className="mr-1">{topic.icon}</span>
            <span className="text-sm">{topic.name}</span>
            <span className="text-xs text-gray-500 ml-1">{topic.posts}</span>
          </a>
        ))}
      </div>

      {/* 创建竞赛按钮 */}
      <button className="w-full bg-[#FF6B35] text-white py-4 rounded-xl font-semibold hover:bg-[#e55a2b] transition-colors flex items-center justify-center gap-2">
        <Target className="h-5 w-5" />
        创建新竞赛
      </button>
    </div>
  );
}
