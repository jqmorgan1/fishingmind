'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Trophy, Plus, Filter } from "lucide-react";

// 从本地存储获取动态
function getPosts() {
  if (typeof window === 'undefined') return [];
  
  const myPosts = JSON.parse(localStorage.getItem('community_posts') || '[]');
  return myPosts;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  return (
    <div className="p-4">
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

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
        <Filter className="h-4 w-4" />
        <span>最新动态</span>
      </div>

      {/* 动态列表 */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-[#1A2832] rounded-xl border border-gray-700">
            <p className="text-gray-400 mb-4">还没有动态</p>
            <p className="text-sm text-gray-500">添加渔获时开启"分享到社区"就能发布</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1A5F2A] rounded-full flex items-center justify-center text-lg">
                    {post.avatar || '🐟'}
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

              <p className="mb-2">{post.content}</p>

              {post.image && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img src={post.image} alt="渔获" className="w-full max-h-64 object-cover" />
                </div>
              )}

              <div className="flex items-center gap-6 pt-3 border-t border-gray-700">
                <button className="flex items-center gap-2 text-gray-400 hover:text-[#FF6B35]">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">{post.likes || 0}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{post.comments || 0}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
