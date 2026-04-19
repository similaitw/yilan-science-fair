"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// 原生 SVG 圖示元件
const Icons = {
  Trophy: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  BookOpen: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Award: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
  School: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>
    </svg>
  ),
  Search: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  ArrowUpDown: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>
    </svg>
  ),
  ChevronDown: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
};

// --- 自訂下拉展開多選元件 (MultiSelect) ---
const MultiSelect = ({ options, selected, onChange, searchPlaceholder = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleOption = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(item => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  // 決定顯示文字
  const getDisplayText = () => {
    if (selected.length === 0) return '全部 (不限)';
    if (selected.length === 1) return selected[0];
    return `已選擇 ${selected.length} 項`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="p-2.5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white cursor-pointer flex justify-between items-center transition-colors shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate text-sm select-none ${selected.length > 0 ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
          {getDisplayText()}
        </span>
        <Icons.ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden max-h-72">
          {searchPlaceholder && (
            <div className="p-2 border-b border-gray-100 bg-gray-50/50">
              <input
                type="text"
                className="w-full p-1.5 text-sm border border-gray-200 rounded outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <div className="overflow-y-auto p-1 flex-1">
            {filteredOptions.length > 0 ? filteredOptions.map(opt => (
              <label key={opt} className="flex items-center px-2 py-2 hover:bg-blue-50 rounded cursor-pointer text-sm transition-colors">
                <input
                  type="checkbox"
                  className="mr-2.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  checked={selected.includes(opt)}
                  onChange={() => toggleOption(opt)}
                />
                <span className="truncate text-gray-700 select-none">{opt}</span>
              </label>
            )) : (
              <div className="p-4 text-sm text-gray-400 text-center">無符合項目</div>
            )}
          </div>
          {options.length > 0 && (
            <div className="p-2 border-t border-gray-100 flex justify-between gap-2 bg-gray-50">
              <button onClick={() => onChange(options)} className="flex-1 text-xs py-1.5 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 rounded text-gray-700 transition-colors font-medium">全選</button>
              <button onClick={() => onChange([])} className="flex-1 text-xs py-1.5 bg-white border border-gray-200 hover:bg-gray-100 rounded text-gray-700 transition-colors font-medium">清空</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 作者與指導老師(以編號 id 對應)
const authorData = {
  // 國中
  '030101': { authors: '鄭宇晴、吳宥蓉', teachers: '黃俊嘉' },
  '030102': { authors: '魏津碩、林晨澔、蔡潤中', teachers: '賴麗姝、賴忻旻' },
  '030103': { authors: '李以瑀、洪晟樺', teachers: '陳家齊' },
  '030104': { authors: '張竣嚴、曾佐恩、徐宏陞', teachers: '黃俊嘉' },
  '030105': { authors: '吳宸軒、鄭鈞學、盧苡葦', teachers: '陳建維' },
  '030106': { authors: '梁祐穎', teachers: '曾方琪、蘇畇喻' },
  '030107': { authors: '吳昱辰、黃程瀚、方艷如', teachers: '陳家彬' },
  '030108': { authors: '李宥丞、蔡筠筠', teachers: '陳家彬' },
  '030109': { authors: '吳禹橙、裘卉蓉', teachers: '曾方琪' },
  '030110': { authors: '藍嶼、陳恩樂、洪和晴', teachers: '沈志強、簡子宏' },
  '030111': { authors: '秋禹岑、周昀橙、楊晰和', teachers: '林浩誌、黃御庭' },
  '030112': { authors: '江睿岑、陳立洋、秦南一', teachers: '李義德' },
  '030201': { authors: '姜斌樵、譚翊彤、宮政晴', teachers: '林佳德、吳學霖' },
  '030202': { authors: '魏連翰、魏連福', teachers: '林祚、林宜姍' },
  '030203': { authors: '游則安、陳廷任', teachers: '吳欣桓' },
  '030204': { authors: '廖朱丞、洪子祥、廖朱浩', teachers: '許靖誠、保任安' },
  '030301': { authors: '吳丹、洪子涵、陳微安', teachers: '林建廷、沈志強' },
  '030302': { authors: '衡映潔、吳宜君、魏芷欣', teachers: '陳昱華、吳宜廷' },
  '030303': { authors: '魏祟樺、田景禾、尤浩一', teachers: '諶詠仁、邱麗芬' },
  '030304': { authors: '李書萊、陳和學、許亦漾', teachers: '吳鳴貴、陳信璋' },
  '030305': { authors: '尤志楷、林亞樺', teachers: '邱麗芬、吳宜廷' },
  '030401': { authors: '陳以宸、陳和文', teachers: '張意函、黃藝莊' },
  '030402': { authors: '歐憲誌', teachers: '陳勛、何保賢' },
  '030403': { authors: '方劭茗、蔡宜豪', teachers: '蘇彥、朱江翰' },
  '030404': { authors: '李秋澤、宋亮靚', teachers: '覺天容、李宥安' },
  '030405': { authors: '藍苡潔、吳子維', teachers: '何唯欣、賴映晴' },
  '030406': { authors: '林佳諭、藍忻儀、陳奏璇', teachers: '吳修箏、康淇華' },
  '030407': { authors: '林安涵、譚浩源、陳翊', teachers: '何唯欣、賴映晴' },
  '030501': { authors: '李泳逸、張庭宇、張翔寧', teachers: '蕭霓桑、陳鈴筑' },
  '030502': { authors: '李沛宸、衡安一、李德楊', teachers: '陳信璋、吳鳴貴' },
  '030503': { authors: '廖禹翔、黃科渝', teachers: '陳信宏' },
  '030801': { authors: '衡秋嶸、梅子燐', teachers: '劉德嫻' },
  '030802': { authors: '蘇安宸、蘇宸謙', teachers: '黃斯筠、方宣蓉' },
  '030803': { authors: '吳侑岑、蕭秋彥、盛泓寧', teachers: '保任安、許靖誠' },
  '030804': { authors: '黃祐昀、李大康', teachers: '劉苦暘' },
  '030805': { authors: '李安騰、吳瑋桓、曾晉廷', teachers: '許苡寧、楊源豪' },
  '030806': { authors: '陳彥章、曾云宸、曾顥彥', teachers: '劉子禾' },
  '030807': { authors: '李安樺、蘇子彥、游宸宇', teachers: '陳榮政、沈志強' },
  '030901': { authors: '陳艾澤、徐楊豢、謝雪涵', teachers: '吳宜妍、徐霈琪' },
  '030902': { authors: '簡妤庭、汪姵瑜、李秋軒', teachers: '林修昱、康瑋展' },
  '030903': { authors: '陳苡綸、陳乃苡、林立柏', teachers: '賴映晴' },
  '030904': { authors: '蘇永洋、李品安', teachers: '邱懷彬、潘品安' },
  '031001': { authors: '張翊潔、方妤珊、李諼庭', teachers: '劉子禾' },
  '031002': { authors: '陳奕溱、魏翊妤', teachers: '邱懷彬、潘品安' },
  '031003': { authors: '楊晨橙、潘宥儒', teachers: '何保賢、沈子涵' },
  '031004': { authors: '李宥安、汪勁瀚、賴夢蓉', teachers: '方魯英' },
  // 國小
  '080101': { authors: '賴沐柔、李妤妡、簡辰薇、邱祈廷、謝宥安', teachers: '陳暉、吳思宥' },
  '080102': { authors: '陳佐廷', teachers: '林慧宸、陳建淳' },
  '080201': { authors: '李奕賢、程昀修', teachers: '譚宥翔' },
  '080202': { authors: '陳侑樺、李東橙、黃祥筑', teachers: '陳庭庚、吳佳穎' },
  '080203': { authors: '吳桓、吳昱涵、李宥均、高子耕', teachers: '李澄賢、李明志' },
  '080204': { authors: '陳柏安、黃鈺崙、張定涵、張銘媞、彭依樺、陳宥廷', teachers: '裘雅保' },
  '080205': { authors: '蘇士穎、吳姈姈、蕭揚圻、李安瑀、李念軒', teachers: '吳思宥、陳暉' },
  '080206': { authors: '張家誌、李俞伶、鞠姿云', teachers: '何侑樟' },
  '080207': { authors: '周朗誠、游竣瑋、陳侑樂、張和碩', teachers: '楊晨憶' },
  '080208': { authors: '謝紫丹、潘安竣、李義峯', teachers: '魏甫萱' },
  '080301': { authors: '黃翊巧', teachers: '江靖茹' },
  '080302': { authors: '吳翊維、楊晟泓、游諺誌', teachers: '吳佳恩、游馥亦' },
  '080303': { authors: '黃永朵、古易廷、吳錢麒、陳亭妤、石迦石', teachers: '陳苡蓁、李澄賢' },
  '080304': { authors: '李昊澤、陳蓁悅', teachers: '吳和耕、李宥廷' },
  '080305': { authors: '陳伶頤、李方桓、黃鈺均、李宥璃、楊旭濠', teachers: '楊槿溧' },
  '080401': { authors: '李安晉', teachers: '吳思宥' },
  '080402': { authors: '游竣昊、彭向晨、李尚治', teachers: '詹思豪、吳天晴' },
  '080403': { authors: '張芸豆、謝庭豊、賴宥讀、謝佩瑩', teachers: '邱麗芬、諶詠仁' },
  '080501': { authors: '吳芸安', teachers: '黃斯筠、李秋蓉' },
  '080502': { authors: '黃柔瑢、吳承衡、羅容筠、徐若諭、黃品苡', teachers: '黃祈珺、游種和' },
  '080503': { authors: '衡簡麗、張耘綸、方詠菲、陳竣豪、薩昊喻', teachers: '陳蘊文、李宜伶' },
  '080504': { authors: '錢崇加、李宥辰、錢楷中', teachers: '李丞麟' },
  '080801': { authors: '陳和陞、毓昕尹、李曜昕、吳蘊淳、李信安', teachers: '賴玟妤、魏劭妤' },
  '080802': { authors: '黃子洋、黃子騰、謝佳廷', teachers: '吳芸芸' },
  '080803': { authors: '余淞橙、宋祈妤、游子禾', teachers: '邱牧修' },
  '080804': { authors: '簡廷安', teachers: '陳玟華、李秋甫' },
  '080805': { authors: '桑叡橙', teachers: '陳玟華' },
  '080901': { authors: '周之彤、汪蕎妤、黃若綺', teachers: '楊陽寬' },
  '080902': { authors: '江宸愷、黃尹豆、伯諺樺', teachers: '王育婷、楊安璃' },
  '080903': { authors: '李睿晴、陳昊樺、李楊', teachers: '李仲崑、李和涵' },
  '080904': { authors: '吳彩伶、游子洋、游源機、吳品廷', teachers: '萬富國小' },
  '080905': { authors: '余三軒、衡三樺、駱亭妤、徐鈺範', teachers: '謝宗賢、蘇鈺範' },
  '080906': { authors: '陳蘊祈', teachers: '吳宜妍、陳琦佩' },
  '080907': { authors: '蘇來昊、李心昊、龐來諺、蘇苡茹、張子宏', teachers: '衡小滿、李森華' },
  '080908': { authors: '廖翊伶', teachers: '黃斯筠、楊虹紜' },
  '081001': { authors: '魏劭妤、晏邑橙、甲立加、廖禹澤', teachers: '李丞麟' },
  '081002': { authors: '廖彥軒、蘇嶸宸、李晰蓁、李楊佳、張芸碩', teachers: '王育婷、楊安璃' },
  '081003': { authors: '許顥崙、魏紫寬', teachers: '李子風' },
};

// 完整資料集
const rawData = [
  // === 國小組 ===
  { group: '國小', category: '數學', award: '佳作', id: '080101', title: '瓶瓶出陣蓋厲害', school: '宜蘭縣羅東鎮竹林國民小學', isNational: false },
  { group: '國小', category: '數學', award: '團隊合作獎', id: '080101', title: '瓶瓶出陣蓋厲害', school: '宜蘭縣羅東鎮竹林國民小學', isNational: false },
  { group: '國小', category: '數學', award: '優等', id: '080102', title: '闖進『魔方vs數學』的世界中', school: '宜蘭縣冬山鄉清溝國民小學', isNational: false },
  { group: '國小', category: '物理', award: '優等', id: '080201', title: '就你和別人不一樣!匹克球奥秘的探究', school: '宜蘭縣羅東鎮公正國民小學', isNational: false },
  { group: '國小', category: '物理', award: '探究精神獎', id: '080201', title: '就你和別人不一樣!匹克球奧秘的探究', school: '宜蘭縣羅東鎮公正國民小學', isNational: false },
  { group: '國小', category: '物理', award: '佳作', id: '080202', title: '空氣子彈 空氣砲', school: '宜蘭縣宜蘭市光復國民小學', isNational: false },
  { group: '國小', category: '物理', award: '優等', id: '080203', title: '「旋」機妙算一紙蜻蜓的降落秘密', school: '宜蘭縣宜蘭市宜蘭國民小學', isNational: false },
  { group: '國小', category: '物理', award: '團隊合作獎', id: '080203', title: '「旋」機妙算一紙蜻蜓的降落秘密', school: '宜蘭縣宜蘭市宜蘭國民小學', isNational: false },
  { group: '國小', category: '物理', award: '特優', id: '080204', title: '旋風之翼-懸浮陀螺探究', school: '宜蘭縣羅東鎮公正國民小學', isNational: true },
  { group: '國小', category: '物理', award: '優等', id: '080205', title: '浮沉人生-探討浮沉子', school: '宜蘭縣羅東鎮竹林國民小學', isNational: false },
  { group: '國小', category: '物理', award: '佳作', id: '080206', title: '手搖發電機', school: '宜蘭縣壯圍鄉過嶺國民小學', isNational: false },
  { group: '國小', category: '物理', award: '優等', id: '080207', title: '「翼」飛沖天:探討機身結構與發射角度對紙飛機飛行距離之影響', school: '宜蘭縣三星鄉大洲國民小學', isNational: false },
  { group: '國小', category: '物理', award: '佳作', id: '080208', title: '「咻咻」聲從哪裡來?-旋轉繩子的發聲探究', school: '宜蘭縣壯圍鄉壯圍國民小學', isNational: false },
  { group: '國小', category: '化學', award: '特優', id: '080301', title: '天然之「紫」,色彩「劑」憶', school: '宜蘭縣宜蘭市凱旋國民小學', isNational: false },
  { group: '國小', category: '化學', award: '探究精神獎', id: '080301', title: '天然之「紫」,色彩「劑」憶', school: '宜蘭縣宜蘭市凱旋國民小學', isNational: false },
  { group: '國小', category: '化學', award: '優等', id: '080302', title: '蔬果變色秀-天然指示劑選拔賽', school: '宜蘭縣羅東鎮公正國民小學', isNational: false },
  { group: '國小', category: '化學', award: '優等', id: '080303', title: '氫電感應-氫燃料電池效能增進之探究', school: '宜蘭縣宜蘭市宜蘭國民小學', isNational: false },
  { group: '國小', category: '化學', award: '特優', id: '080304', title: '冰雪奇緣Let It Go', school: '宜蘭縣員山鄉大湖國民小學', isNational: false },
  { group: '國小', category: '化學', award: '團隊合作獎', id: '080304', title: '冰雪奇緣Let It Go', school: '宜蘭縣員山鄉大湖國民小學', isNational: false },
  { group: '國小', category: '化學', award: '優等', id: '080305', title: '紫色精靈在哪裡?校園花青素相揣', school: '宜蘭縣礁溪鄉龍潭國民小學', isNational: false },
  { group: '國小', category: '化學', award: '鄉土教材獎', id: '080305', title: '紫色精靈在哪裡?校園花青素相揣', school: '宜蘭縣礁溪鄉龍潭國民小學', isNational: false },
  { group: '國小', category: '生物', award: '特優', id: '080401', title: '羅東林場樹皮微棲地結構與節肢動物活動差異之研究', school: '宜蘭縣羅東鎮竹林國民小學', isNational: false },
  { group: '國小', category: '生物', award: '鄉土教材獎', id: '080401', title: '羅東林場樹皮微棲地結構與節肢動物活動差異之研究', school: '宜蘭縣羅東鎮竹林國民小學', isNational: false },
  { group: '國小', category: '生物', award: '佳作', id: '080402', title: '『菇』且一試-金針菇再生能力與生長環境之探討', school: '宜蘭縣礁溪鄉四結國民小學', isNational: false },
  { group: '國小', category: '生物', award: '佳作', id: '080403', title: '「蕨」能之「鹿」——探討不同光照時數與光暗週期對銀鹿鹿角蕨生長型態與單位能源利用效率之影響', school: '宜蘭縣立內城國民中小學', isNational: false },
  { group: '國小', category: '地球科學', award: '佳作', id: '080501', title: '爺爺菜園的秘密一探究菜園土壤組成', school: '宜蘭縣宜蘭市中山國民小學', isNational: false },
  { group: '國小', category: '地球科學', award: '佳作', id: '080502', title: '鐵定是你在搞怪-土壤成色機制之探討', school: '宜蘭縣員山鄉七賢國民小學', isNational: false },
  { group: '國小', category: '地球科學', award: '探究精神獎', id: '080502', title: '鐵定是你在搞怪-土壤成色機制之探討', school: '宜蘭縣員山鄉七賢國民小學', isNational: false },
  { group: '國小', category: '地球科學', award: '優等', id: '080503', title: '鋪面材料與植物覆蓋對都市微氣候調節之探究-探討不同地表鋪面對環境溫度與濕度變化的影響', school: '宜蘭縣宜蘭市宜蘭國民小學', isNational: false },
  { group: '國小', category: '地球科學', award: '團隊合作獎', id: '080503', title: '鋪面材料與植物覆蓋對都市微氣候調節之探究-探討不同地表鋪面對環境溫度與濕度變化的影響', school: '宜蘭縣宜蘭市宜蘭國民小學', isNational: false },
  { group: '國小', category: '地球科學', award: '優等', id: '080504', title: '寸草心守護萬年土~探討以在地禾本科種子球強化坡地穩定性與攔截土石流~', school: '宜蘭縣羅東鎮成功國民小學', isNational: false },
  { group: '國小', category: '地球科學', award: '鄉土教材獎', id: '080504', title: '寸草心守護萬年土~探討以在地禾本科種子球強化坡地穩定性與攔截土石流~', school: '宜蘭縣羅東鎮成功國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(一)', award: '特優', id: '080801', title: '「灶」就健康:青銀共廚AI辨識系統之迭代開發', school: '宜蘭縣羅東鎮竹林國民小學', isNational: true },
  { group: '國小', category: '生活與應用科學(一)', award: '鄉土教材獎', id: '080801', title: '「灶」就健康:青銀共廚AI辨識系統之迭代開發', school: '宜蘭縣羅東鎮竹林國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(一)', award: '佳作', id: '080802', title: '探討不同結構機器人夾子的重量負載與速度表現', school: '宜蘭縣羅東鎮光復國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(一)', award: '特優', id: '080803', title: '讓塗鴉成為健康幫手:自製壓力感測器在智慧飲水杯墊之應用', school: '宜蘭縣羅東鎮公正國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(一)', award: '佳作', id: '080804', title: '「借力使力」,探究不同底盤動力結構之表現', school: '宜蘭縣宜蘭市南屏國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(一)', award: '優等', id: '080805', title: '遙控掃地鴨', school: '宜蘭縣宜蘭市南屏國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(二)', award: '鄉土教材獎', id: '080901', title: '蔥蔥榮榮,油韌有餘——蔥的加工與環境溫度對保存的影響', school: '宜蘭縣宜蘭市新生國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(二)', award: '優等', id: '080902', title: '新式生醃,美味不受限', school: '宜蘭縣羅東鎮北成國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(二)', award: '優等', id: '080903', title: '黃金滴定液-自製維他命C檢測劑', school: '宜蘭縣冬山鄉清溝國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(二)', award: '探究精神獎', id: '080904', title: '剎那即永恆:探討不同藥劑對製作永生花成品之效果', school: '宜蘭縣三星鄉萬富國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(二)', award: '優等', id: '080905', title: '你的牙齒「泡湯」了嗎? 探討市售飲品在不同溫度下對牙齒腐蝕的引響', school: '宜蘭縣宜蘭市光復國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(二)', award: '佳作', id: '080906', title: '冰不融的祕密-「最佳化冰鹽冷劑」與「複合保溫結構」之極限探究', school: '宜蘭縣宜蘭市中山國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(二)', award: '團隊合作獎', id: '080907', title: '「凍」如軟玉,安心無虞探究廚房常見可食用凝膠之保冷效果與冰敷袋應用', school: '宜蘭縣宜蘭市南屏國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(二)', award: '佳作', id: '080908', title: '椪椪運「氣」探究酸鹼中和反應對椪糖影響', school: '宜蘭縣宜蘭市中山國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(三)', award: '優等', id: '081001', title: '「渣」現生機~豆渣循環新經濟~', school: '宜蘭縣羅東鎮成功國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(三)', award: '鄉土教材獎', id: '081001', title: '「渣」現生機~豆渣循環新經濟~', school: '宜蘭縣羅東鎮成功國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(三)', award: '特優', id: '081002', title: '皮革大變身-植物皮革開發之研究', school: '宜蘭縣羅東鎮北成國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(三)', award: '團隊合作獎', id: '081002', title: '皮革大變身-植物皮革開發之研究', school: '宜蘭縣羅東鎮北成國民小學', isNational: false },
  { group: '國小', category: '生活與應用科學(三)', award: '佳作', id: '081003', title: '一「觸」即「融」:看見都市熱島的威力', school: '中道高中附小', isNational: false },
  { group: '國小', category: '生活與應用科學(三)', award: '探究精神獎', id: '081003', title: '一「觸」即「融」:看見都市熱島的威力', school: '中道高中附小', isNational: false },

  // === 國中組 ===
  { group: '國中', category: '數學', award: '參展', id: '030101', title: '數字接力填空', school: '宜蘭縣立宜蘭國民中學', isNational: false },
  { group: '國中', category: '數學', award: '參展', id: '030102', title: '點生萬象~棋盤格點中的結點生成極限與線性法則', school: '宜蘭縣立壯圍國民中學', isNational: false },
  { group: '國中', category: '數學', award: '佳作', id: '030103', title: '兩水相逢一從兩水容量探討倒出特定容量倒水次數的最小值', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '數學', award: '參展', id: '030104', title: '階梯魔數', school: '宜蘭縣立宜蘭國民中學', isNational: false },
  { group: '國中', category: '數學', award: '佳作', id: '030105', title: '『蜘蛛數』中最美的floor function', school: '宜蘭縣立冬山國民中學', isNational: false },
  { group: '國中', category: '數學', award: '參展', id: '030106', title: '棋逢敵手', school: '宜蘭縣立中華國民中學', isNational: false },
  { group: '國中', category: '數學', award: '佳作', id: '030107', title: '「長短之間」探討正n邊形內接m邊形的周長關係', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '數學', award: '優等', id: '030108', title: '正n邊形的幾何重疊之美', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '數學', award: '佳作', id: '030109', title: '「圍」數不多的真相', school: '宜蘭縣立中華國民中學', isNational: false },
  { group: '國中', category: '數學', award: '探究精神獎', id: '030109', title: '「圍」數不多的真相', school: '宜蘭縣立中華國民中學', isNational: false },
  { group: '國中', category: '數學', award: '特優', id: '030110', title: '交點上的天平-圖形分割中隱藏的對頂區域平衡', school: '宜蘭縣立國華國民中學', isNational: true },
  { group: '國中', category: '數學', award: '優等', id: '030111', title: '擁擠的外切圓', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '數學', award: '特優', id: '030112', title: '正五邊形的神祕分割術', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '物理', award: '佳作', id: '030201', title: '板擦的摩擦力險記', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '物理', award: '鄉土教材獎', id: '030201', title: '板擦的摩擦力險記', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '物理', award: '優等', id: '030202', title: '磁力的平衡藝術:永久磁鐵排斥磁場下的懸浮穩定條件', school: '宜蘭縣立東光國民中學', isNational: false },
  { group: '國中', category: '物理', award: '探究精神獎', id: '030202', title: '磁力的平衡藝術:永久磁鐵排斥磁場下的懸浮穩定條件', school: '宜蘭縣立東光國民中學', isNational: false },
  { group: '國中', category: '物理', award: '特優', id: '030203', title: '落水生花', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '物理', award: '優等', id: '030204', title: '靜電消失的祕密-材料、曲度與環境對靜電衰退的影響', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '物理', award: '團隊合作獎', id: '030204', title: '靜電消失的祕密-材料、曲度與環境對靜電衰退的影響', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '化學', award: '特優', id: '030301', title: '顏色密碼-建立比色法檢測地下水鹽化問題', school: '宜蘭縣立國華國民中學', isNational: true },
  { group: '國中', category: '化學', award: '鄉土教材獎', id: '030301', title: '顏色密碼-建立比色法檢測地下水鹽化問題', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '化學', award: '優等', id: '030302', title: '發熱包-溫度升了沒?', school: '宜蘭縣立員山國民中學', isNational: false },
  { group: '國中', category: '化學', award: '團隊合作獎', id: '030302', title: '發熱包-溫度升了沒?', school: '宜蘭縣立員山國民中學', isNational: false },
  { group: '國中', category: '化學', award: '參展', id: '030303', title: '湛藍的呼吸-原來氧化還原也可以這麼美麗:探討多重變因對藍瓶實驗變色速率之影響', school: '宜蘭縣立內城國民中小學', isNational: false },
  { group: '國中', category: '化學', award: '優等', id: '030304', title: '各式玻璃表面塗層導電性評估', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '化學', award: '探究精神獎', id: '030304', title: '各式玻璃表面塗層導電性評估', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '化學', award: '佳作', id: '030305', title: '膠連在地味:探討宜蘭愛玉果膠與不同二價金屬離子之交聯作用及水質變因對凝膠特性之影響', school: '宜蘭縣立內城國民中小學', isNational: false },
  { group: '國中', category: '生物', award: '參展', id: '030401', title: '乳酸菌在不同溫度下代謝糖類產酸速率之研究', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '生物', award: '優等', id: '030402', title: '「囊」括無遺一絲葉狸藻表型可塑性之探討', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '生物', award: '優等', id: '030403', title: 'HIGH?害?探討光週期及咖啡因對豐年蝦的影響', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '生物', award: '特優', id: '030404', title: '浪起食動-水黽行為策略與覓食偏好之探究', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '生物', award: '探究精神獎', id: '030404', title: '浪起食動-水黽行為策略與覓食偏好之探究', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '生物', award: '佳作', id: '030405', title: '「錠」出新高度-磁力對植物光合作用之探究', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '生物', award: '佳作', id: '030406', title: '乳酸菌檢測', school: '宜蘭縣立員山國民中學', isNational: false },
  { group: '國中', category: '生物', award: '特優', id: '030407', title: '光影下的拔河:探討不同色光與照度對綠豆幼苗向光性與背地性交互作用之影響', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '地球科學', award: '優等', id: '030501', title: '油汙染之偵測與影像辨識', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '地球科學', award: '佳作', id: '030502', title: '思如泉湧_探討各地區溫泉基本性質與其相關性', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '地球科學', award: '鄉土教材獎', id: '030502', title: '思如泉湧_探討各地區溫泉基本性質與其相關性', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '地球科學', award: '參展', id: '030503', title: '蘭陽地區降雨之研究', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(一)', award: '參展', id: '030801', title: 'Ardino腳位檢測系統之設計與實作', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(一)', award: '參展', id: '030802', title: '氣勢磅礡-VEXIQ機器人長短氣筒對操作效能與行駛穩定度之影響研究', school: '宜蘭縣立宜蘭國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(一)', award: '優等', id: '030803', title: '必勝!夜市套圈圈發射器', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(一)', award: '優等', id: '030804', title: '影像辨識於教室設備自動化巡檢系統之研究', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(一)', award: '參展', id: '030805', title: '體感遊戲應用於三維運動訓練之輔助評估', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(一)', award: '優等', id: '030806', title: '「智閥能聚」一基於特斯拉閥與IoT 低溫廢熱回收系統', school: '慧燈中學', isNational: false },
  { group: '國中', category: '生活與應用科學(一)', award: '特優', id: '030807', title: '仿生捲曲結構設計', school: '宜蘭縣立國華國民中學', isNational: true },
  { group: '國中', category: '生活與應用科學(二)', award: '佳作', id: '030901', title: '「野」力覺醒——野菜的抗氧化特性研究與創意飲食之應用研究', school: '宜蘭縣立宜蘭國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(二)', award: '佳作', id: '030902', title: '羊氣催生-羊蹄甲所含酵素對雙氧水催化之探討', school: '宜蘭縣立中華國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(二)', award: '優等', id: '030903', title: '「饅」工出細活-旺仔小饅頭麻糬之最佳配方初探', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(二)', award: '探究精神獎', id: '030903', title: '「饅」工出細活-旺仔小饅頭麻糬之最佳配方初探', school: '宜蘭縣立羅東國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(二)', award: '團隊合作獎', id: '030904', title: '咖啡內化學物質與風味之關聯性', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(三)', award: '佳作', id: '031001', title: '織理清洗-智能影像辨識清洗效率評估系統', school: '慧燈中學', isNational: false },
  { group: '國中', category: '生活與應用科學(三)', award: '團隊合作獎', id: '031001', title: '織理清洗-智能影像辨識清洗效率評估系統', school: '慧燈中學', isNational: false },
  { group: '國中', category: '生活與應用科學(三)', award: '佳作', id: '031002', title: '「皂」到宜「樂」一臺灣欒樹之皂苷研究', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(三)', award: '探究精神獎', id: '031002', title: '「皂」到宜「樂」一臺灣欒樹之皂苷研究', school: '宜蘭縣立國華國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(三)', award: '佳作', id: '031003', title: '深溝水中生物觀察報告-原生種與外來種生態大解密', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(三)', award: '鄉土教材獎', id: '031003', title: '深溝水中生物觀察報告-原生種與外來種生態大解密', school: '宜蘭縣立復興國民中學', isNational: false },
  { group: '國中', category: '生活與應用科學(三)', award: '特優', id: '031004', title: '烈焰交響曲-第二樂章:木氣爐孔洞配置對二次燃燒的影響', school: '宜蘭縣立中華國民中學', isNational: true }
];

export default function App() {
  // 篩選狀態 (全面支援陣列多選)
  const [filters, setFilters] = useState({
    groups: [],      // 多選：組別
    categories: [],  // 多選：科別
    awards: [],      // 多選：名次/獎項
    schools: [],     // 多選：學校名稱
    teachers: []     // 多選：指導老師
  });

  // 排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  // 分頁狀態
  const [activeTab, setActiveTab] = useState('table');

  // 提取選項清單
  const uniqueGroups = [...new Set(rawData.map(item => item.group))];
  const uniqueCategories = [...new Set(rawData.map(item => item.category))];
  const uniqueSchools = [...new Set(rawData.map(item => item.school))].sort();
  
  const awardWeights = { '特優': 1, '優等': 2, '佳作': 3, '探究精神獎': 4, '團隊合作獎': 5, '鄉土教材獎': 6, '參展': 7 };
  const uniqueAwards = [...new Set(rawData.map(item => item.award))].sort((a, b) => (awardWeights[a] || 99) - (awardWeights[b] || 99));

  // 指導老師清單(拆分多位老師 + 去重)
  const uniqueTeachers = useMemo(() => {
    const set = new Set();
    Object.values(authorData).forEach(v => {
      if (!v?.teachers) return;
      v.teachers.split(/[、,,\s]+/).forEach(t => {
        const name = t.trim();
        if (name && name !== '—') set.add(name);
      });
    });
    return [...set].sort();
  }, []);

  // 判斷單筆作品是否包含任一指定老師
  const itemMatchTeachers = (item, teachers) => {
    if (teachers.length === 0) return true;
    const raw = authorData[item.id]?.teachers || '';
    const names = raw.split(/[、,,\s]+/).map(s => s.trim()).filter(Boolean);
    return teachers.some(t => names.includes(t));
  };

  // 多重條件篩選過濾資料
  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const matchGroup = filters.groups.length === 0 || filters.groups.includes(item.group);
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
      const matchAward = filters.awards.length === 0 || filters.awards.includes(item.award);
      const matchSchool = filters.schools.length === 0 || filters.schools.includes(item.school);
      const matchTeacher = itemMatchTeachers(item, filters.teachers);
      return matchGroup && matchCategory && matchAward && matchSchool && matchTeacher;
    });
  }, [filters]);

  // 排序資料
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'award') {
            aValue = awardWeights[aValue] || 99;
            bValue = awardWeights[bValue] || 99;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const stats = useMemo(() => {
    const totalAwards = filteredData.filter(d => d.award !== '參展').length;
    const uniqueProjects = new Set(filteredData.map(d => d.id)).size;
    
    const schoolCounts = {};
    filteredData.forEach(d => {
      if(d.award !== '參展') {
        schoolCounts[d.school] = (schoolCounts[d.school] || 0) + 1;
      }
    });
    
    let topSchool = '無';
    let maxCount = 0;
    Object.entries(schoolCounts).forEach(([school, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topSchool = school;
      }
    });

    return { totalAwards, uniqueProjects, topSchool, maxCount };
  }, [filteredData]);

  // 圖表 1:各組別 × 獎項 堆疊長條圖資料
  const chartGroupAward = useMemo(() => {
    const awardOrder = ['特優', '優等', '佳作', '探究精神獎', '團隊合作獎', '鄉土教材獎', '參展'];
    return uniqueGroups.map(g => {
      const row = { group: g };
      awardOrder.forEach(a => {
        row[a] = filteredData.filter(d => d.group === g && d.award === a).length;
      });
      return row;
    });
  }, [filteredData, uniqueGroups]);

  // 圖表 2:各科別得獎數(排除「參展」)
  const chartCategoryCount = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      if (d.award !== '參展') {
        counts[d.category] = (counts[d.category] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // 圖表 3:獲獎前 10 名學校(排除「參展」)
  const chartTopSchools = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      if (d.award !== '參展') {
        counts[d.school] = (counts[d.school] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([school, count]) => ({ school, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredData]);

  // 圖表:指導老師獲獎數排行(排除「參展」,同一編號一件作品的老師各計 1)
  const chartTopTeachers = useMemo(() => {
    const counts = {};
    const seen = new Set();
    filteredData.forEach(d => {
      if (d.award === '參展') return;
      const key = `${d.id}|${d.award}`;
      if (seen.has(key)) return;
      seen.add(key);
      const raw = authorData[d.id]?.teachers || '';
      raw.split(/[、,,\s]+/).map(s => s.trim()).filter(Boolean).forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([teacher, count]) => ({ teacher, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredData]);

  // 圖表 4:獎項分布圓餅(排除「參展」)
  const chartAwardPie = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      if (d.award !== '參展') {
        counts[d.award] = (counts[d.award] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // 全國代表作品清單
  const nationalList = useMemo(() => {
    const seen = new Set();
    return filteredData.filter(d => {
      if (!d.isNational) return false;
      if (seen.has(d.id)) return false;
      seen.add(d.id);
      return true;
    });
  }, [filteredData]);

  const awardColors = {
    '特優': '#eab308',
    '優等': '#3b82f6',
    '佳作': '#10b981',
    '探究精神獎': '#8b5cf6',
    '團隊合作獎': '#ec4899',
    '鄉土教材獎': '#f97316',
    '參展': '#9ca3af'
  };

  const SortIconComponent = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <Icons.ArrowUpDown className="w-3.5 h-3.5 ml-1 text-gray-400 opacity-50 shrink-0" />;
    return <Icons.ArrowUpDown className={`w-3.5 h-3.5 ml-1 shrink-0 ${sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-red-600'}`} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 精簡版表頭 */}
        <header className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <Icons.Trophy className="w-8 h-8 text-yellow-500 mr-3" />
            宜蘭縣 115 年度中小學科展成績統計
          </h1>
          <p className="text-gray-500 text-sm mt-2 md:mt-0 bg-gray-100 px-3 py-1.5 rounded-full">
            即時動態多重篩選儀表板
          </p>
        </header>

        {/* 統計概覽區 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
              <Icons.BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">篩選作品總數</p>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueProjects} <span className="text-sm font-normal text-gray-500">件</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg mr-4">
              <Icons.Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">篩選獎項總數</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAwards} <span className="text-sm font-normal text-gray-500">個</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg mr-4">
              <Icons.School className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">獲獎最多學校 (當前條件)</p>
              <p className="text-lg font-bold text-gray-900 truncate max-w-[200px]" title={stats.topSchool}>
                {stats.topSchool}
              </p>
              {stats.maxCount > 0 && <p className="text-xs text-emerald-600 mt-1">共 {stats.maxCount} 獎項</p>}
            </div>
          </div>
        </div>

        {/* --- 全新單列式多重篩選條件區塊 --- */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            
            {/* 組別多選 */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-600 mb-1.5 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>組別
              </label>
              <MultiSelect 
                options={uniqueGroups}
                selected={filters.groups}
                onChange={(newGroups) => setFilters(prev => ({ ...prev, groups: newGroups }))}
              />
            </div>

            {/* 科別多選 */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-600 mb-1.5 flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>科別
              </label>
              <MultiSelect 
                options={uniqueCategories}
                selected={filters.categories}
                onChange={(newCategories) => setFilters(prev => ({ ...prev, categories: newCategories }))}
              />
            </div>

            {/* 名次/獎項多選 */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-600 mb-1.5 flex items-center">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></span>名次/獎項
              </label>
              <MultiSelect 
                options={uniqueAwards}
                selected={filters.awards}
                onChange={(newAwards) => setFilters(prev => ({ ...prev, awards: newAwards }))}
              />
            </div>

            {/* 學校名稱多選 (含搜尋) */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-600 mb-1.5 flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>學校名稱
              </label>
              <MultiSelect
                options={uniqueSchools}
                selected={filters.schools}
                onChange={(newSchools) => setFilters(prev => ({ ...prev, schools: newSchools }))}
                searchPlaceholder="請輸入學校關鍵字搜尋..."
              />
            </div>

            {/* 指導老師多選 (含搜尋) */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-600 mb-1.5 flex items-center">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>指導老師
              </label>
              <MultiSelect
                options={uniqueTeachers}
                selected={filters.teachers}
                onChange={(newTeachers) => setFilters(prev => ({ ...prev, teachers: newTeachers }))}
                searchPlaceholder="請輸入老師姓名搜尋..."
              />
            </div>

          </div>
        </div>

        {/* --- 分頁切換 --- */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'table' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            資料表格
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'charts' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            圖表統計
          </button>
        </div>

        {activeTab === 'charts' && (
          <div className="space-y-6">
            {/* 全國代表概覽 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Icons.Trophy className="w-5 h-5 text-red-500 mr-2" />
                全國代表作品 ({nationalList.length} 件)
              </h2>
              {nationalList.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nationalList.map(item => (
                    <li key={item.id} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-white border border-red-200 text-red-700">{item.group}</span>
                        <span className="text-xs text-gray-500">{item.category}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 leading-snug">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.school}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">目前篩選條件下無全國代表作品</p>
              )}
            </div>

            {/* 各組別 × 獎項堆疊圖 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">各組別獎項分布</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartGroupAward}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="group" tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  {['特優', '優等', '佳作', '探究精神獎', '團隊合作獎', '鄉土教材獎', '參展'].map(a => (
                    <Bar key={a} dataKey={a} fill={awardColors[a]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 各科別得獎數 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">各科別得獎數</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartCategoryCount} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={140} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 獎項分布圓餅 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">獎項類型占比(不含參展)</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={chartAwardPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartAwardPie.map((entry) => (
                        <Cell key={entry.name} fill={awardColors[entry.name] || '#9ca3af'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 獲獎前 10 名學校 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">獲獎前 10 名學校(不含參展)</h2>
              <ResponsiveContainer width="100%" height={Math.max(300, chartTopSchools.length * 36)}>
                <BarChart data={chartTopSchools} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="school" tick={{ fontSize: 11 }} width={220} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 指導老師獲獎排行 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">指導老師獲獎排行 前 10 名(不含參展)</h2>
              {chartTopTeachers.length > 0 ? (
                <ResponsiveContainer width="100%" height={Math.max(300, chartTopTeachers.length * 36)}>
                  <BarChart data={chartTopTeachers} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="teacher" tick={{ fontSize: 12 }} width={140} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                    <Bar dataKey="count" fill="#ec4899" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-400">目前篩選條件下無得獎作品</p>
              )}
            </div>
          </div>
        )}

        {/* --- 資料表格區塊 --- */}
        {activeTab === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px] table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  {/* 強制固定前四欄的寬度 */}
                  <th className="p-3 w-20 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('id')}>
                    <div className="flex items-center">編號 <SortIconComponent columnKey="id" /></div>
                  </th>
                  <th className="p-3 w-20 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('group')}>
                    <div className="flex items-center">組別 <SortIconComponent columnKey="group" /></div>
                  </th>
                  <th className="p-3 w-28 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('category')}>
                    <div className="flex items-center">科別 <SortIconComponent columnKey="category" /></div>
                  </th>
                  <th className="p-3 w-32 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('award')}>
                    <div className="flex items-center">名次/獎項 <SortIconComponent columnKey="award" /></div>
                  </th>
                  {/* 剩下的彈性空間留給這兩欄 */}
                  <th className="p-3 min-w-[200px] w-1/4 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('school')}>
                    <div className="flex items-center">學校名稱 <SortIconComponent columnKey="school" /></div>
                  </th>
                  <th className="p-3 w-auto cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('title')}>
                    <div className="flex items-center">作品題目 <SortIconComponent columnKey="title" /></div>
                  </th>
                  <th className="p-3 min-w-[160px] w-[180px]">
                    <div className="flex items-center">作者</div>
                  </th>
                  <th className="p-3 min-w-[120px] w-[140px]">
                    <div className="flex items-center">指導老師</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr 
                      key={`${item.id}-${item.award}-${index}`} 
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      {/* 前四欄設定不換行 */}
                      <td className="p-3 text-gray-500 font-mono text-sm whitespace-nowrap">{item.id}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.group === '國小' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                          {item.group}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700 break-words leading-snug" title={item.category}>
                        {item.category}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          item.award === '特優' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          item.award === '優等' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          item.award === '佳作' ? 'bg-green-50 text-green-700 border-green-200' :
                          item.award === '參展' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                          'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {item.award}
                        </span>
                      </td>
                      {/* 內容最長的兩欄保留完整文字空間 */}
                      <td className="p-3 font-medium text-gray-900 leading-snug">{item.school}</td>
                      <td className="p-3 text-gray-600 leading-snug">
                        <div className="flex items-center flex-wrap gap-2">
                          <span>{item.title}</span>
                          {item.isNational && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200 whitespace-nowrap shadow-sm">
                              <Icons.Trophy className="w-3.5 h-3.5 mr-1" />
                              全國代表
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-gray-700 text-sm leading-snug break-words">
                        {authorData[item.id]?.authors || '—'}
                      </td>
                      <td className="p-3 text-gray-700 text-sm leading-snug break-words">
                        {authorData[item.id]?.teachers || '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <Icons.Search className="w-12 h-12 text-gray-300 mb-4" />
                        <p>找不到符合條件的資料，請嘗試放寬多重篩選的設定。</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 p-4 border-t border-gray-100 text-sm text-gray-500 text-right">
            顯示 {sortedData.length} 筆紀錄
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
