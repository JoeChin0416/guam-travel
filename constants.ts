
import { AppData, DayInfo, WeatherInfo, Member } from './types';

export const EXCHANGE_RATE = 32.5;

// 已移除 ACCESS_CODE，改用 Google Auth 白名單

export const APP_CONFIG = {
  title: "Guam Vacation",
  subtitle: "Feb 07 - Feb 11, 2026",
  coverImage: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=2069&auto=format&fit=crop"
};

export const INITIAL_DATES: DayInfo[] = [
  { date: '2/07', weekday: 'SAT', hasCar: false },
  { date: '2/08', weekday: 'SUN', hasCar: true }, // 開始租車
  { date: '2/09', weekday: 'MON', hasCar: true }, // 全天租車
  { date: '2/10', weekday: 'TUE', hasCar: true }, // 晚上還車
  { date: '2/11', weekday: 'WED', hasCar: false },
];

export const WEATHER_DATA: WeatherInfo[] = [
  { condition: 'sunny', temp: '29' },
  { condition: 'cloudy', temp: '28' },
  { condition: 'rain', temp: '27' },
  { condition: 'sunny', temp: '30' },
  { condition: 'sunny', temp: '29' },
];

// 請在此處填入真實的 Google Email，這將是初始的白名單
export const INITIAL_MEMBERS: Member[] = [
    { id: '1', name: 'Mom', email: 'mom@gmail.com' }, 
    { id: '2', name: 'Sister1', email: 'sister1@gmail.com' },
    { id: '3', name: 'Sister2', email: 'hope78121@gmail.com' },
];

export const INITIAL_DATA: AppData = {
  itinerary: [
    // Day 1
    [
      { id: 101, name: '抵達關島機場', category: 'transport', startTime: '16:50', address: 'Antonio B. Won Pat International Airport', note: '填寫海關單，領取行李，搭計程車前往飯店', transportType: 'flight', travelTime: '' },
      { id: 102, name: 'Bayview Hotel Check-in', category: 'accommodation', startTime: '17:30', address: 'Bayview Hotel Guam', note: '市區飯店，簡單安頓', transportType: 'transport', travelTime: '15m' },
      { id: 103, name: '市區散步 (西班牙廣場)', category: 'sightseeing', startTime: '18:00', address: 'Plaza de España', note: '聖母瑪利亞大教堂拍照', hours: 'Open 24H', price: 'Free', transportType: 'transport', travelTime: '10m' },
      { id: 104, name: '海濱公園夕陽散步', category: 'sightseeing', startTime: '18:40', address: 'Paseo de Susana Park', note: '自由女神像，看日落', transportType: 'walk', travelTime: '5m' },
      { id: 105, name: '晚餐: Agana Shopping Center', category: 'food', startTime: '19:30', address: 'Agana Shopping Center', note: '吃當地 BBQ 或 Chamorro 料理', hours: '10:00-20:00', price: '~$30', transportType: 'transport', travelTime: '5m' },
    ],
    // Day 2
    [
      { id: 201, name: '退房 & 租車', category: 'transport', startTime: '09:00', address: 'Nippon Rent-A-Car', note: '開始自駕環島，行李放車上', transportType: 'car', travelTime: '' },
      { id: 202, name: '魚眼海洋公園', category: 'sightseeing', startTime: '10:00', address: 'Fish Eye Marine Park', note: '著名的海底觀景塔', hours: '08:00-17:00', price: '$16', transportType: 'car', travelTime: '20m' },
      { id: 203, name: 'Umatac 西班牙古村', category: 'sightseeing', startTime: '11:30', address: 'Umatac Bay Park', note: '麥哲倫登陸紀念碑，猶馬塔克橋', price: 'Free', transportType: 'car', travelTime: '30m' },
      { id: 204, name: 'Inarajan 天然泳池', category: 'sightseeing', startTime: '13:00', address: 'Inarajan Natural Pool', note: '必去！天然海水泳池拍照', price: 'Free', transportType: 'car', travelTime: '20m' },
      { id: 206, name: '戀人岬 Two Lovers Point', category: 'sightseeing', startTime: '15:30', address: 'Two Lovers Point', note: '回程往北，著名的觀景台', hours: '07:00-19:00', price: '$3', transportType: 'car', travelTime: '45m' },
      { id: 207, name: 'Crowne Plaza Check-in', category: 'accommodation', startTime: '17:00', address: 'Crowne Plaza Resort Guam', note: '海邊夕陽 + 飯店晚餐', transportType: 'car', travelTime: '15m' },
    ],
    // Day 3
    [
      { id: 301, name: '退房: Crowne Plaza', category: 'accommodation', startTime: '10:30', address: 'Crowne Plaza Resort Guam', note: '不用開車，移動到隔壁星野', transportType: 'transport', travelTime: '' },
      { id: 302, name: 'Hoshino Resorts Check-in', category: 'accommodation', startTime: '11:00', address: 'Hoshino Resorts RISONARE Guam', note: 'Check-in 放行李，直奔私人沙灘', transportType: 'transport', travelTime: '10m' },
      { id: 303, name: '星野私人沙灘玩水', category: 'ticket', startTime: '11:30', address: 'Hoshino Resorts RISONARE Guam', note: '浮潛、SUP、透明獨木舟玩到爽', price: 'Free for guests', transportType: 'walk', travelTime: '0m' },
      { id: 306, name: '晚餐: Hoshino / Tumon', category: 'food', startTime: '18:30', address: 'Hoshino Resorts RISONARE Guam', note: '夜拍海浪 + 燈光', transportType: 'walk', travelTime: '0m' },
    ],
    // Day 4
    [
      { id: 402, name: 'Guam Plaza Check-in', category: 'accommodation', startTime: '10:30', address: 'Guam Plaza Resort', note: '寄放行李，市中心位置超好', transportType: 'transport', travelTime: '15m' },
      { id: 404, name: 'Plaza Spa 按摩', category: 'ticket', startTime: '12:30', address: 'Guam Plaza Resort', note: '放鬆一下', price: '~$80', transportType: 'walk', travelTime: '5m' },
      { id: 405, name: 'DFS / Micronesia Mall', category: 'shopping', startTime: '14:30', address: 'T Galleria by DFS', note: '精品、伴手禮一次買齊', hours: '10:00-20:00', transportType: 'transport', travelTime: '10m' },
      { id: 406, name: '晚餐: Hard Rock Cafe', category: 'food', startTime: '19:00', address: 'Hard Rock Cafe Guam', note: '美式搖滾風格晚餐', hours: '11:00-22:00', price: '~$40', transportType: 'walk', travelTime: '5m' },
    ],
    // Day 5
    [
      { id: 501, name: '退房 & 叫車', category: 'transport', startTime: '05:00', address: 'Guam Plaza Resort', note: '清晨退房，叫車去機場', transportType: 'transport', travelTime: '15m' },
      { id: 503, name: '回程起飛', category: 'transport', startTime: '07:30', address: 'Guam Airport', note: '再見關島', transportType: 'flight', travelTime: '4h30m' },
      { id: 504, name: '抵達台北', category: 'transport', startTime: '10:00', address: 'Taoyuan Airport', note: '回到溫暖的家', transportType: 'flight', travelTime: '' },
    ]
  ],
  shopping: [
    { id: 1, name: 'Banana Boat 防曬乳 (SPF110)', note: 'ABC Store 買' },
    { id: 2, name: 'Godiva 巧克力', note: "Macy's 比較便宜" },
    { id: 3, name: 'Guam 啤酒 (6入)', note: '送禮用' },
  ],
  expenses: [
    { id: 1, name: '機票 (TPE-GUM)', amount: 650, category: 'transport', date: '01/15', payment: 'Card', payerId: '1', splits: [{memberId: '1', amount: 650}] }, // Mom paid for herself
    { id: 2, name: 'Bayview Hotel 訂金', amount: 150, category: 'accommodation', date: '01/20', payment: 'Card', payerId: '1', splits: [{memberId: '1', amount: 50}, {memberId: '2', amount: 50}, {memberId: '3', amount: 50}] }, // Mom paid, split 3 ways
    { id: 3, name: 'Wifi 機租借', amount: 30, category: 'ticket', date: '02/07', payment: 'Card', payerId: '2', splits: [{memberId: '1', amount: 10}, {memberId: '2', amount: 10}, {memberId: '3', amount: 10}] }, // Sister1 paid, split 3 ways
  ],
  planning: [
    { id: 1, title: '護照效期檢查 (>6個月)', category: 'documents', completed: true, assignedTo: 'All' },
    { id: 2, title: '列印電子機票', category: 'documents', completed: false, assignedTo: 'Mom' },
    { id: 3, title: '駕照日文譯本/國際駕照', category: 'documents', completed: false, assignedTo: 'Sister1' },
    { id: 4, title: '泳衣/水母衣', category: 'luggage', completed: false, assignedTo: 'All' },
    { id: 5, title: '防水相機/Gopro', category: 'luggage', completed: false, assignedTo: 'Sister2' },
    { id: 6, title: '預約機場接送', category: 'todo', completed: true, assignedTo: 'Mom' },
  ]
};
