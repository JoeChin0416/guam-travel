
import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';

import Header from './components/Header';
import LoginView from './components/LoginView';
import ItineraryView from './components/ItineraryView';
import InfoView from './components/InfoView';
import ShoppingView from './components/ShoppingView';
import ExpenseView from './components/ExpenseView';
import PlanningView from './components/PlanningView';
import { ItineraryModal, ShoppingModal, ExpenseModal, PlanningModal } from './components/Modals';
import { MemberModal } from './components/MemberModal';
import { TabType, ItineraryItem, ShoppingItem, ExpenseItem, PlanningItem, Member } from './types';
import { INITIAL_DATA, INITIAL_DATES, WEATHER_DATA, APP_CONFIG, INITIAL_MEMBERS } from './constants';
import { Plus } from 'lucide-react';

// Helper to transform 2D array to Object for Firestore (Fixes nested array error)
const serializeItinerary = (itinerary: ItineraryItem[][]) => {
  return itinerary.reduce((acc, dayItems, index) => {
    acc[index.toString()] = dayItems;
    return acc;
  }, {} as Record<string, ItineraryItem[]>);
};

// Helper to transform Object back to 2D array
const deserializeItinerary = (data: Record<string, ItineraryItem[]>) => {
    if (Array.isArray(data)) return data; // Fallback if data is already array
    const sortedKeys = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
    return sortedKeys.map(key => data[key]);
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  
  const [currentTab, setCurrentTab] = useState<TabType>('itinerary'); 
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  
  // Data State
  const [itinerary, setItinerary] = useState<ItineraryItem[][]>(INITIAL_DATA.itinerary);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(INITIAL_DATA.shopping);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_DATA.expenses);
  const [planningList, setPlanningList] = useState<PlanningItem[]>(INITIAL_DATA.planning || []);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  // Modal State
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  // Helper to save data to Firestore
  const saveToFirestore = async (key: string, data: any) => {
    if (db) {
        try {
            let payload = data;
            // Special handling for itinerary to avoid nested array error
            if (key === 'itinerary' && Array.isArray(data)) {
                payload = serializeItinerary(data);
            }
            await setDoc(doc(db, 'trip_data', key), { data: payload });
        } catch (e) {
            console.error(`Error saving ${key}`, e);
        }
    }
  };

  // --- Auth & Initial Data Logic ---
  useEffect(() => {
    // 1. Members Listener (Always listen so LoginView has data)
    let unsubMembers = () => {};
    
    if (db) {
         unsubMembers = onSnapshot(collection(db, "members"), (snapshot) => {
            if (!snapshot.empty) {
                const loadedMembers = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})) as Member[];
                setMembers(loadedMembers);
            } else {
                // Seed initial members if DB is empty
                INITIAL_MEMBERS.forEach(m => setDoc(doc(db, "members", m.id), m));
                setMembers(INITIAL_MEMBERS);
            }
        });
    }

    // 2. Check Local Storage for Login
    const savedUserId = localStorage.getItem('trip_user_id');
    if (savedUserId) {
        // We temporarily set an object with just ID. 
        // Once members load, we can refine it, but for Auth check ID is enough.
        setCurrentUser({ id: savedUserId, name: 'Loading...', email: '' }); 
    }

    return () => {
        unsubMembers();
    };
  }, []);

  // Update Current User Name when Members update
  useEffect(() => {
      if (currentUser && members.length > 0) {
          const found = members.find(m => m.id === currentUser.id);
          if (found) setCurrentUser(found);
      }
  }, [members, currentUser?.id]);


  // --- Trip Data Listeners (Always active for simplicity in this private app) ---
  useEffect(() => {
    if (!db) return;

    // Trip Data Listeners
    const unsubItinerary = onSnapshot(doc(db, 'trip_data', 'itinerary'), (doc) => {
        if (doc.exists()) {
            const rawData = doc.data().data;
            if (!Array.isArray(rawData)) {
                setItinerary(deserializeItinerary(rawData));
            } else {
                setItinerary(rawData);
            }
        }
        else saveToFirestore('itinerary', INITIAL_DATA.itinerary);
    });
    
    const unsubShopping = onSnapshot(doc(db, 'trip_data', 'shopping'), (doc) => {
        if (doc.exists()) setShoppingList(doc.data().data);
        else saveToFirestore('shopping', INITIAL_DATA.shopping);
    });

    const unsubExpenses = onSnapshot(doc(db, 'trip_data', 'expenses'), (doc) => {
        if (doc.exists()) setExpenses(doc.data().data);
        else saveToFirestore('expenses', INITIAL_DATA.expenses);
    });

    const unsubPlanning = onSnapshot(doc(db, 'trip_data', 'planning'), (doc) => {
        if (doc.exists()) setPlanningList(doc.data().data);
        else saveToFirestore('planning', INITIAL_DATA.planning);
    });

    return () => {
        unsubItinerary();
        unsubShopping();
        unsubExpenses();
        unsubPlanning();
    };
  }, []); 

  // Handlers
  const handleLogin = (memberId: string) => {
      const member = members.find(m => m.id === memberId);
      if (member) {
          setCurrentUser(member);
          localStorage.setItem('trip_user_id', memberId);
      }
  };

  const handleLogout = async () => {
      if (auth) {
          await signOut(auth);
      }
      setCurrentUser(null);
      localStorage.removeItem('trip_user_id');
      window.location.reload(); // Clean state reset
  };

  const handleAddItemClick = () => {
    if (currentTab === 'itinerary') {
        setEditingItem(null);
        setShowItineraryModal(true);
    } else if (currentTab === 'shopping') {
        setShowShoppingModal(true);
    } else if (currentTab === 'expenses') {
        setEditingExpense(null);
        setShowExpenseModal(true);
    } else if (currentTab === 'planning') {
        setShowPlanningModal(true);
    }
  };

  const handleSaveItinerary = (item: Partial<ItineraryItem>) => {
    const newItinerary = [...itinerary];
    const dayList = [...newItinerary[selectedDateIndex]];

    if (editingItem) {
        const idx = dayList.findIndex(i => i.id === editingItem.id);
        if (idx !== -1) dayList[idx] = { ...editingItem, ...item } as ItineraryItem;
    } else {
        const newItem = { ...item, id: Date.now() } as ItineraryItem;
        dayList.push(newItem);
        dayList.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    }
    newItinerary[selectedDateIndex] = dayList;
    setItinerary(newItinerary);
    saveToFirestore('itinerary', newItinerary);
    setEditingItem(null);
  };

  const handleDeleteItinerary = (id: number) => {
      const newItinerary = [...itinerary];
      newItinerary[selectedDateIndex] = newItinerary[selectedDateIndex].filter(i => i.id !== id);
      setItinerary(newItinerary);
      saveToFirestore('itinerary', newItinerary);
  };

  const handleSaveShopping = (item: Partial<ShoppingItem>) => {
      const newList = [...shoppingList, { ...item, id: Date.now() } as ShoppingItem];
      setShoppingList(newList);
      saveToFirestore('shopping', newList);
  };

  const handleRemoveShopping = (id: number) => {
      const newList = shoppingList.filter(i => i.id !== id);
      setShoppingList(newList);
      saveToFirestore('shopping', newList);
  };

  const handleSaveExpense = (item: Partial<ExpenseItem>) => {
      let newList: ExpenseItem[];
      
      if (editingExpense) {
          // Edit existing
          newList = expenses.map(e => e.id === editingExpense.id ? { ...e, ...item } as ExpenseItem : e);
          setEditingExpense(null);
      } else {
          // Add new
          newList = [{ ...item, id: Date.now(), date: new Date().toLocaleDateString('en-US', {month:'numeric', day:'numeric'}) } as ExpenseItem, ...expenses];
      }
      
      setExpenses(newList);
      saveToFirestore('expenses', newList);
  };

  const handleRemoveExpense = (id: number) => {
      const newList = expenses.filter(i => i.id !== id);
      setExpenses(newList);
      saveToFirestore('expenses', newList);
  };

  const handleSavePlanning = (item: Partial<PlanningItem>) => {
      const newList = [...planningList, { ...item, id: Date.now() } as PlanningItem];
      setPlanningList(newList);
      saveToFirestore('planning', newList);
  };

  const handleTogglePlanning = (id: number) => {
      const newList = planningList.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
      );
      setPlanningList(newList);
      saveToFirestore('planning', newList);
  };
  
  const handleRemovePlanning = (id: number) => {
      const newList = planningList.filter(i => i.id !== id);
      setPlanningList(newList);
      saveToFirestore('planning', newList);
  };

  const handleAddMember = async (member: Member) => {
      if (db) {
          try {
              await setDoc(doc(db, "members", member.id), member);
          } catch (e) {
              console.error("Error adding member to DB", e);
          }
      }
      setMembers([...members, member]);
  };

  const handleRemoveMember = async (id: string) => {
      if (db) {
          try {
              await deleteDoc(doc(db, "members", id));
          } catch (e) {
               console.error("Error deleting member from DB", e);
          }
      }
      setMembers(members.filter(m => m.id !== id));
  };

  // --- Render Logic ---

  if (!currentUser) {
      return <LoginView members={members} onLogin={handleLogin} />;
  }

  return (
    <div className="app-container max-w-[480px] mx-auto min-h-screen bg-guam-sand relative shadow-[0_0_40px_rgba(13,148,136,0.1)]">
      <Header 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        title={APP_CONFIG.title}
        subtitle={APP_CONFIG.subtitle}
        coverImage={APP_CONFIG.coverImage}
        onOpenMembers={() => setShowMemberModal(true)}
      />

      {/* Logout Button (Hidden/Dev feature or in Member Modal? Let's just put it in Header area temporarily or Member Modal) */}
      <div className="fixed top-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity">
           <button onClick={handleLogout} className="bg-red-500 text-white text-xs px-2 py-1 rounded">Logout</button>
      </div>

      <main className="px-4 pt-6 relative z-0">
        {currentTab === 'itinerary' && (
            <ItineraryView 
                dates={INITIAL_DATES} 
                weather={WEATHER_DATA}
                items={itinerary[selectedDateIndex]}
                selectedDateIndex={selectedDateIndex}
                onDateSelect={setSelectedDateIndex}
                onEdit={(item) => { setEditingItem(item); setShowItineraryModal(true); }}
            />
        )}
        {currentTab === 'info' && <InfoView />}
        {currentTab === 'shopping' && (
            <ShoppingView 
                items={shoppingList} 
                onRemove={handleRemoveShopping}
                onAddClick={() => setShowShoppingModal(true)}
            />
        )}
        {currentTab === 'planning' && (
            <PlanningView 
                items={planningList}
                onToggle={handleTogglePlanning}
                onRemove={handleRemovePlanning}
            />
        )}
        {currentTab === 'expenses' && (
            <ExpenseView 
                expenses={expenses}
                onRemove={handleRemoveExpense}
                onEdit={(item) => { setEditingExpense(item); setShowExpenseModal(true); }}
                members={members}
            />
        )}
      </main>

      {currentTab !== 'info' && (
        <button 
            onClick={handleAddItemClick}
            className="fixed bottom-24 right-6 w-14 h-14 bg-guam-coral text-white rounded-full shadow-[0_4px_20px_rgba(251,113,133,0.6)] text-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
        >
            <Plus size={24} />
        </button>
      )}

      {/* Modals */}
      <ItineraryModal 
        isOpen={showItineraryModal} 
        onClose={() => setShowItineraryModal(false)} 
        onSave={handleSaveItinerary} 
        initialData={editingItem}
        onDelete={handleDeleteItinerary}
      />
      <ShoppingModal isOpen={showShoppingModal} onClose={() => setShowShoppingModal(false)} onSave={handleSaveShopping} />
      <ExpenseModal 
        isOpen={showExpenseModal} 
        onClose={() => setShowExpenseModal(false)} 
        onSave={handleSaveExpense} 
        members={members}
        initialData={editingExpense} 
      />
      <PlanningModal 
        isOpen={showPlanningModal} 
        onClose={() => setShowPlanningModal(false)} 
        onSave={handleSavePlanning} 
        members={members}
      />
      <MemberModal 
        isOpen={showMemberModal} 
        onClose={() => setShowMemberModal(false)} 
        members={members} 
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
};

export default App;
