import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Anchor, Cloud, Users, User, Plus } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "钓鱼脑 - AI预测钓鱼指数",
  description: "智能钓点地图、咬钩预测、渔获记录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-[#0D1B2A] text-white`}>
        {/* 移动端底部导航栏 - 4个tab */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1A2832] border-t border-gray-700 z-50 safe-area-pb">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
            <Link href="/" className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-[#FF6B35]">
              <Anchor className="h-6 w-6" />
              <span className="text-xs mt-1">探索</span>
            </Link>
            <Link href="/weather" className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-[#FF6B35]">
              <Cloud className="h-6 w-6" />
              <span className="text-xs mt-1">天气</span>
            </Link>
            <Link href="/community" className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-[#FF6B35]">
              <Users className="h-6 w-6" />
              <span className="text-xs mt-1">社区</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-[#FF6B35]">
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">我的</span>
            </Link>
          </div>
        </nav>
        
        {/* 悬浮添加按钮 */}
        <Link 
          href="/log/add"
          className="fixed bottom-20 right-4 bg-[#FF6B35] text-white p-4 rounded-full shadow-lg hover:bg-[#e55a2b] transition-colors z-40"
        >
          <Plus className="h-6 w-6" />
        </Link>
        
        {/* 主内容区 */}
        <main className="pb-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
