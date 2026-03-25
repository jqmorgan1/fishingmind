'use client'

import { useState, useRef } from 'react';
import { Fish, Camera, MapPin, Thermometer, Cloud, BugPlay, X, Upload, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function AddLogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shareToCommunity, setShareToCommunity] = useState(true);
  const [formData, setFormData] = useState({
    fishType: '',
    weight: '',
    length: '',
    spot: '',
    bait: '',
    notes: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert('请先上传渔获照片！');
      return;
    }
    
    if (!formData.fishType || !formData.spot) {
      alert('请填写鱼种和钓点！');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      let photoUrl = '';
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('fishing-logs')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.log('Upload error, using local mode');
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('fishing-logs')
            .getPublicUrl(fileName);
          photoUrl = publicUrl;
        }
      }

      // 保存渔获记录
      const { data: logData, error: insertError } = await supabase
        .from('fishing_logs')
        .insert({
          fish_type: formData.fishType,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          length: formData.length ? parseFloat(formData.length) : null,
          spot_name: formData.spot,
          bait: formData.bait || null,
          notes: formData.notes || null,
          photo_url: photoUrl,
          weather: '多云 23°C',
          temperature: 23,
        })
        .select();

      if (insertError) throw insertError;

      // 如果选择分享到社区，同时发布动态
      if (shareToCommunity && logData?.[0]) {
        const log = logData[0];
        const content = `今天在${formData.spot}钓到一条${formData.fishType}${
          formData.weight ? `，${formData.weight}kg` : ''
        }！${formData.notes ? formData.notes : ''}`;

        await supabase.from('posts').insert({
          content,
          image_url: photoUrl,
          fish_log_id: log.id,
        });
      }

      alert(shareToCommunity ? '记录成功，已分享到社区！' : '渔获记录成功！');
      router.push('/log');
    } catch (error) {
      console.error('Error:', error);
      // 本地模式
      const logs = JSON.parse(localStorage.getItem('fishing_logs') || '[]');
      const newLog = {
        id: Date.now(),
        ...formData,
        photo: imagePreview,
        date: new Date().toISOString(),
        weather: '多云 23°C',
      };
      logs.unshift(newLog);
      localStorage.setItem('fishing_logs', JSON.stringify(logs));

      // 本地也模拟发布到社区
      if (shareToCommunity) {
        const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
        posts.unshift({
          id: Date.now(),
          user: '钓鱼小白',
          avatar: '🐟',
          content: `今天在${formData.spot}钓到一条${formData.fishType}${
            formData.weight ? `，${formData.weight}kg` : ''
          }！`,
          image: imagePreview,
          likes: 0,
          comments: 0,
          time: '刚刚',
          isMyPost: true,
        });
        localStorage.setItem('community_posts', JSON.stringify(posts));
      }

      alert(shareToCommunity ? '记录成功，已分享到社区！' : '记录已保存！（本地模式）');
      router.push('/log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">添加渔获</h1>
        <span className="text-red-400 text-sm">* 必须拍照</span>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="bg-[#1A2832] rounded-xl p-8 mb-6 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35] transition-colors"
      >
        {imagePreview ? (
          <div className="relative w-full">
            <img 
              src={imagePreview} 
              alt="渔获" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Camera className="h-12 w-12 text-gray-500 mb-2" />
            <p className="text-gray-400 text-sm">点击拍照或上传照片</p>
            <p className="text-red-400 text-xs mt-2">* 必须上传渔获照片</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">鱼种 *</label>
          <input
            type="text"
            required
            placeholder="如：翘嘴、鲫鱼、鲤鱼"
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
            value={formData.fishType}
            onChange={(e) => setFormData({...formData, fishType: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">体重 (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="如：2.3"
              className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">长度 (cm)</label>
            <input
              type="number"
              step="0.1"
              placeholder="如：65"
              className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
              value={formData.length}
              onChange={(e) => setFormData({...formData, length: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">钓点 *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              required
              placeholder="选择或输入钓点"
              className="w-full bg-[#1A2832] rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
              value={formData.spot}
              onChange={(e) => setFormData({...formData, spot: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">饵料</label>
          <input
            type="text"
            placeholder="如：亮片、蚯蚓、玉米"
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
            value={formData.bait}
            onChange={(e) => setFormData({...formData, bait: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">备注</label>
          <textarea
            rows={2}
            placeholder="添加备注..."
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none resize-none"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        {/* 分享到社区开关 */}
        <div className="bg-[#1A2832] rounded-lg p-4 border border-gray-700">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={shareToCommunity}
                onChange={(e) => setShareToCommunity(e.target.checked)}
                className="w-5 h-5 rounded accent-[#FF6B35]"
              />
              <div>
                <p className="font-medium">分享到社区</p>
                <p className="text-xs text-gray-400">让钓友看看你的渔获</p>
              </div>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !imagePreview}
          className="w-full bg-[#FF6B35] text-white py-4 rounded-lg font-semibold hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              保存记录
            </>
          )}
        </button>
      </form>
    </div>
  );
}
