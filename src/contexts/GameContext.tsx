import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'budgeting' | 'saving' | 'investing' | 'debt';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  xpReward: number;
  progress: number;
  completed: boolean;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  purchased: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  completedQuests: number;
  unlockedAchievements: number;
}

interface GameContextType {
  userProfile: UserProfile;
  quests: Quest[];
  achievements: Achievement[];
  shopItems: ShopItem[];
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  updateQuest: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  purchaseItem: (itemId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'finquest_game_data';

const initialQuests: Quest[] = [
  {
    id: 'safety-cushion',
    title: 'Финансовая подушка безопасности: твой первый шаг к свободе',
    description: 'Освой навык регулярного накопления и научись грамотному выбору финансовых инструментов',
    category: 'saving',
    difficulty: 'easy',
    reward: 75,
    xpReward: 50,
    progress: 0,
    completed: false,
    icon: '🛡️',
  },
  {
    id: 'investment-start',
    title: 'Инвестиционный старт — управляй будущим сегодня!',
    description: 'Освой базовые принципы долгосрочных инвестиций и создай свой первый портфель',
    category: 'investing',
    difficulty: 'medium',
    reward: 100,
    xpReward: 60,
    progress: 0,
    completed: false,
    icon: '📈',
  },
  {
    id: 'antifraud',
    title: 'Антифрод: Стань ловцом мошенников!',
    description: 'Научись распознавать мошеннические схемы и защищать свои финансы',
    category: 'saving',
    difficulty: 'medium',
    reward: 75,
    xpReward: 60,
    progress: 0,
    completed: false,
    icon: '🕵️',
  },
  {
    id: '1',
    title: 'Создай свой первый бюджет',
    description: 'Научись планировать свои доходы и расходы',
    category: 'budgeting',
    difficulty: 'easy',
    reward: 100,
    xpReward: 50,
    progress: 0,
    completed: false,
    icon: '📊',
  },
  {
    id: '2',
    title: 'Сбереги 1000 рублей',
    description: 'Начни формировать свою финансовую подушку',
    category: 'saving',
    difficulty: 'easy',
    reward: 150,
    xpReward: 75,
    progress: 0,
    completed: false,
    icon: '💰',
  },
  {
    id: '3',
    title: 'Изучи основы инвестиций',
    description: 'Узнай, как заставить деньги работать на тебя',
    category: 'investing',
    difficulty: 'medium',
    reward: 200,
    xpReward: 100,
    progress: 0,
    completed: false,
    icon: '📈',
  },
  {
    id: '4',
    title: 'Закрой свой первый кредит',
    description: 'Научись управлять долгами',
    category: 'debt',
    difficulty: 'hard',
    reward: 300,
    xpReward: 150,
    progress: 0,
    completed: false,
    icon: '💳',
  },
];

const initialAchievements: Achievement[] = [
  { id: '1', title: 'Первые шаги', description: 'Завершено первое задание', icon: '🎯', unlocked: false },
  { id: '2', title: 'Сберегатель', description: 'Накоплено 1000 монет', icon: '💎', unlocked: false },
  { id: '3', title: 'Инвестор', description: 'Изучены основы инвестиций', icon: '📊', unlocked: false },
  { id: '4', title: 'Мастер финансов', description: 'Выполнено 10 квестов', icon: '👑', unlocked: false },
];

const initialShopItems: ShopItem[] = [
  { id: '1', name: 'Золотой аватар', description: 'Эксклюзивная рамка для аватара', price: 500, icon: '🏆', purchased: false },
  { id: '2', name: 'Удвоение XP', description: 'Получай удвоенный опыт на 1 день', price: 300, icon: '⚡', purchased: false },
  { id: '3', name: 'Подсказка', description: 'Получи подсказку для сложного квеста', price: 100, icon: '💡', purchased: false },
];

const initialUserProfile: UserProfile = {
  name: 'Игрок',
  avatar: '👤',
  level: 1,
  xp: 0,
  coins: 0,
  completedQuests: 0,
  unlockedAchievements: 0,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [shopItems, setShopItems] = useState<ShopItem[]>(initialShopItems);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setHasCompletedOnboarding(data.hasCompletedOnboarding || false);
        setUserProfile(data.userProfile || initialUserProfile);

        // Merge saved quests with initial ones (add new quests, keep progress/completion)
        const savedQuests: Quest[] = Array.isArray(data.quests) ? data.quests : [];
        const savedById = new Map(savedQuests.map((q) => [q.id, q]));

        // Start from initial to ensure new definitions/titles are present, but keep user's progress/completion
        const mergedBase = initialQuests.map((initQ) => {
          const existing = savedById.get(initQ.id);
          return existing ? { ...initQ, ...existing } : initQ;
        });

        // Keep any extra custom quests that might have been in saved data but not in initial
        const extras = savedQuests.filter((q) => !initialQuests.some((iq) => iq.id === q.id));
        let mergedAll = [...mergedBase, ...extras];

        // Ensure safety-cushion quest exists
        if (!mergedAll.some((q) => q.id === 'safety-cushion')) {
          const sc = initialQuests.find((q) => q.id === 'safety-cushion');
          if (sc) mergedAll = [sc, ...mergedAll];
        }

        // Put safety-cushion quest first
        const scIndex = mergedAll.findIndex((q) => q.id === 'safety-cushion');
        if (scIndex > 0) {
          const [sc] = mergedAll.splice(scIndex, 1);
          mergedAll = [sc, ...mergedAll];
        }

        setQuests(mergedAll);
        setAchievements(data.achievements || initialAchievements);
        setShopItems(data.shopItems || initialShopItems);
      } catch (e) {
        console.error('Failed to load game data:', e);
      }
    } else {
      // First run: make sure quests are set (safety-cushion is already first in initialQuests)
      setQuests(initialQuests);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      hasCompletedOnboarding,
      userProfile,
      quests,
      achievements,
      shopItems,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [hasCompletedOnboarding, userProfile, quests, achievements, shopItems]);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const updateQuest = (questId: string, progress: number) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId ? { ...quest, progress: Math.min(progress, 100) } : quest
      )
    );
  };

  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    setQuests(prevQuests =>
      prevQuests.map(q =>
        q.id === questId ? { ...q, completed: true, progress: 100 } : q
      )
    );

    setUserProfile(prev => {
      const newXP = prev.xp + quest.xpReward;
      const newLevel = Math.floor(newXP / 200) + 1;
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        coins: prev.coins + quest.reward,
        completedQuests: prev.completedQuests + 1,
      };
    });

    // Check for achievements
    if (userProfile.completedQuests === 0) {
      unlockAchievement('1'); // First quest
    }
    if (userProfile.completedQuests + 1 >= 10) {
      unlockAchievement('4'); // 10 quests
    }
    if (userProfile.coins + quest.reward >= 1000) {
      unlockAchievement('2'); // 1000 coins
    }
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prevAchievements =>
      prevAchievements.map(achievement =>
        achievement.id === achievementId && !achievement.unlocked
          ? { ...achievement, unlocked: true, unlockedAt: new Date() }
          : achievement
      )
    );

    setUserProfile(prev => ({
      ...prev,
      unlockedAchievements: achievements.filter(a => a.unlocked).length + 1,
    }));
  };

  const purchaseItem = (itemId: string) => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item || item.purchased || userProfile.coins < item.price) return;

    setShopItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId ? { ...i, purchased: true } : i
      )
    );

    setUserProfile(prev => ({
      ...prev,
      coins: prev.coins - item.price,
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <GameContext.Provider
      value={{
        userProfile,
        quests,
        achievements,
        shopItems,
        hasCompletedOnboarding,
        completeOnboarding,
        updateQuest,
        completeQuest,
        unlockAchievement,
        purchaseItem,
        updateProfile,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
