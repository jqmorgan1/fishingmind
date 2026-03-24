import Link from "next/link";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Trophy, Plus, Filter } from "lucide-react";

// 模拟动态数据
const mockPosts = [
  {
    id: 1,
    user: "钓鱼老王",
    avatar: "🐟",
    content: "今天在东湖搞到一条大翘嘴，2.3kg，太激动了！",
    image: null,
    likes: 52,
    comments: 12,
    time: "2小时前",
    location: "东湖",
  },
  {
    id: 2,
    user: "路亚小陈",
    avatar: "🎣",
    content: "新入的马口亮片到了，明天去试试货。",
    image: null,
    likes: 28,
    comments: 5,
    time: "5小时前",
    location: null,
  },
  {
    id: 3,
    user: "台钓大师",
    avatar: "🧑‍🌾",
    content: "分享一下今天的渔获，鲫鱼口很好，用蚯蚓钓了十几条。",
    image: null,
    likes: 89,
    comments: 23,
    time: "昨天",
    location: "墨水湖",
  },
];

export default function CommunityPage() {
  return (
    <div className="p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">🗣️ 社区</h1>
        <Link 
          href="/community/contest"
          className="flex items-center gap-1 text-yellow-400 text-sm hover:text-yellow-300"
        >
          <Trophy className="h-4 w-4" />
          竞赛
        </Link>
      </div>

      {/* 快捷功能 */}
      <div className="flex gap-3 mb-4">
        <Link 
          href="/community/contest"
          className="flex-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-3 flex items-center justify-center gap-2"
        >
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span className="text-sm font-medium">参加竞赛</span>
        </Link>
        <button className="flex-1 bg-[#1A2832] border border-gray-700 rounded-xl p-3 flex items-center justify-center gap-2">
          <Plus className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400">发动态</span>
        </button>
      </div>

      {/* 话题标签 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['推荐', '关注', '路亚', '台钓', '海钓', '渔具', '新手'].map((tag, i) => (
          <Link
            key={tag}
            href={tag === '推荐' ? '/community' : `/community/topic/${tag}`}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              i === 0 
                ? 'bg-[#FF6B35] text-white' 
                : 'bg-[#1A2832] text-gray-300 border border-gray-700'
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
        <Filter className="h-4 w-4" />
        <span>最新动态</span>
      </div>

      {/* 动态列表 */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
            {/* 用户信息 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1A5F2A] rounded-full flex items-center justify-center text-lg">
                  {post.avatar}
                </div>
                <div>
                  <p className="font-semibold">{post.user}</p>
                  <p className="text-xs text-gray-500">{post.time}</p>
                </div>
              </div>
              <button className="text-gray-500">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* 内容 */}
            <p className="mb-2">{post.content}</p>
            {post.location && (
              <p className="text-xs text-gray-500 mb-3">📍 {post.location}</p>
            )}

            {/* 图片占位 */}
            {post.image && (
              <div className="mb-3 bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                <Image className="h-8 w-8 text-gray-500" />
              </div>
            )}

            {/* 互动按钮 */}
            <div className="flex items-center gap-6 pt-3 border-t border-gray-700">
              <button className="flex items-center gap-2 text-gray-400 hover:text-[#FF6B35]">
                <Heart className="h-5 w-5" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 更多内容提示 */}
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">登录查看更多动态</p>
        <Link 
          href="/profile"
          className="text-[#FF6B35] text-sm hover:underline mt-2 inline-block"
        >
          立即登录 →
        </Link>
      </div>
    </div>
  );
}
