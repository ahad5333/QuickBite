import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Plus, Search } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

const SAMPLE_MENU: Partial<MenuItem>[] = [
  {
    name: "Veggie Supreme Burger",
    description: "Grilled veggie patty with lettuce, tomato, and vegan mayo.",
    price: 11.99,
    category: "Burgers",
    image: "https://picsum.photos/seed/veg-burger/400/300",
    available: true
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Grilled chicken, BBQ sauce, onions, and mozzarella.",
    price: 15.99,
    category: "Pizza",
    image: "https://picsum.photos/seed/bbq-chicken-pizza/400/300",
    available: true
  },
  {
    name: "Greek Salad",
    description: "Feta cheese, olives, cucumber, and tomatoes.",
    price: 10.50,
    category: "Salads",
    image: "https://picsum.photos/seed/greek-salad/400/300",
    available: true
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked layers.",
    price: 8.00,
    category: "Desserts",
    image: "https://picsum.photos/seed/tiramisu/400/300",
    available: true
  },
  {
    name: "Cappuccino",
    description: "Espresso with steamed milk foam.",
    price: 4.50,
    category: "Beverages",
    image: "https://picsum.photos/seed/cappuccino/400/300",
    available: true
  },

  {
    name: "Spaghetti Bolognese",
    description: "Pasta with rich meat sauce.",
    price: 13.99,
    category: "Pasta",
    image: "https://picsum.photos/seed/spaghetti-bolognese/400/300",
    available: true
  },
  {
    name: "Penne Alfredo",
    description: "Creamy alfredo sauce with parmesan.",
    price: 12.99,
    category: "Pasta",
    image: "https://picsum.photos/seed/alfredo-pasta/400/300",
    available: true
  },
  {
    name: "Chicken Wings",
    description: "Spicy grilled wings with dip.",
    price: 9.50,
    category: "Appetizers",
    image: "https://picsum.photos/seed/chicken-wings/400/300",
    available: true
  },
  {
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter.",
    price: 5.99,
    category: "Appetizers",
    image: "https://picsum.photos/seed/garlic-bread/400/300",
    available: true
  },
  {
    name: "French Fries",
    description: "Crispy golden fries.",
    price: 4.99,
    category: "Sides",
    image: "https://picsum.photos/seed/french-fries/400/300",
    available: true
  },

  {
    name: "Onion Rings",
    description: "Deep fried crispy onion rings.",
    price: 5.50,
    category: "Sides",
    image: "https://picsum.photos/seed/onion-rings/400/300",
    available: true
  },
  {
    name: "Grilled Chicken Sandwich",
    description: "Tender grilled chicken with lettuce and mayo.",
    price: 10.99,
    category: "Sandwiches",
    image: "https://picsum.photos/seed/chicken-sandwich/400/300",
    available: true
  },
  {
    name: "Club Sandwich",
    description: "Triple layer sandwich with chicken, bacon, and veggies.",
    price: 11.50,
    category: "Sandwiches",
    image: "https://picsum.photos/seed/club-sandwich/400/300",
    available: true
  },
  {
    name: "Paneer Tikka",
    description: "Grilled paneer cubes with spices.",
    price: 12.00,
    category: "Indian",
    image: "https://picsum.photos/seed/paneer-tikka/400/300",
    available: true
  },
  {
    name: "Butter Chicken",
    description: "Creamy tomato-based chicken curry.",
    price: 14.99,
    category: "Indian",
    image: "https://picsum.photos/seed/butter-chicken/400/300",
    available: true
  },

  {
    name: "Veg Biryani",
    description: "Aromatic rice with vegetables.",
    price: 11.99,
    category: "Indian",
    image: "https://picsum.photos/seed/veg-biryani/400/300",
    available: true
  },
  {
    name: "Chicken Biryani",
    description: "Spiced rice with chicken.",
    price: 13.99,
    category: "Indian",
    image: "https://picsum.photos/seed/chicken-biryani/400/300",
    available: true
  },
  {
    name: "Fish Curry",
    description: "Spicy fish cooked in curry sauce.",
    price: 15.50,
    category: "Seafood",
    image: "https://picsum.photos/seed/fish-curry/400/300",
    available: true
  },
  {
    name: "Grilled Salmon",
    description: "Fresh salmon with herbs.",
    price: 18.99,
    category: "Seafood",
    image: "https://picsum.photos/seed/grilled-salmon/400/300",
    available: true
  },
  {
    name: "Shrimp Pasta",
    description: "Creamy pasta with shrimp.",
    price: 16.99,
    category: "Seafood",
    image: "https://picsum.photos/seed/shrimp-pasta/400/300",
    available: true
  },

  {
    name: "Chocolate Milkshake",
    description: "Thick chocolate shake.",
    price: 6.50,
    category: "Beverages",
    image: "https://picsum.photos/seed/chocolate-milkshake/400/300",
    available: true
  },
  {
    name: "Strawberry Smoothie",
    description: "Fresh strawberry blended drink.",
    price: 6.00,
    category: "Beverages",
    image: "https://picsum.photos/seed/strawberry-smoothie/400/300",
    available: true
  },
  {
    name: "Mango Juice",
    description: "Fresh mango juice.",
    price: 4.99,
    category: "Beverages",
    image: "https://picsum.photos/seed/mango-juice/400/300",
    available: true
  },
  {
    name: "Lemon Iced Tea",
    description: "Refreshing iced tea with lemon.",
    price: 3.99,
    category: "Beverages",
    image: "https://picsum.photos/seed/lemon-iced-tea/400/300",
    available: true
  },
  {
    name: "Espresso",
    description: "Strong black coffee shot.",
    price: 3.50,
    category: "Beverages",
    image: "https://picsum.photos/seed/espresso/400/300",
    available: true
  },

  {
    name: "Vanilla Ice Cream",
    description: "Classic vanilla scoop.",
    price: 4.00,
    category: "Desserts",
    image: "https://picsum.photos/seed/vanilla-ice-cream/400/300",
    available: true
  },
  {
    name: "Brownie Sundae",
    description: "Warm brownie with ice cream.",
    price: 7.00,
    category: "Desserts",
    image: "https://picsum.photos/seed/brownie-sundae/400/300",
    available: true
  },
  {
    name: "Cheesecake",
    description: "Creamy cheesecake slice.",
    price: 6.99,
    category: "Desserts",
    image: "https://picsum.photos/seed/cheesecake/400/300",
    available: true
  },
  {
    name: "Apple Pie",
    description: "Classic baked apple pie.",
    price: 5.99,
    category: "Desserts",
    image: "https://picsum.photos/seed/apple-pie/400/300",
    available: true
  },
  {
    name: "Donuts",
    description: "Sweet glazed donuts.",
    price: 4.50,
    category: "Desserts",
    image: "https://picsum.photos/seed/donuts/400/300",
    available: true
  },

  {
    name: "Chicken Noodles",
    description: "Stir-fried noodles with chicken.",
    price: 10.99,
    category: "Chinese",
    image: "https://picsum.photos/seed/chicken-noodles/400/300",
    available: true
  },
  {
    name: "Veg Fried Rice",
    description: "Rice with vegetables and soy sauce.",
    price: 9.99,
    category: "Chinese",
    image: "https://picsum.photos/seed/veg-fried-rice/400/300",
    available: true
  },
  {
    name: "Manchurian",
    description: "Fried veggie balls in sauce.",
    price: 8.99,
    category: "Chinese",
    image: "https://picsum.photos/seed/manchurian/400/300",
    available: true
  },
  {
    name: "Spring Rolls",
    description: "Crispy rolls with veggies.",
    price: 7.50,
    category: "Chinese",
    image: "https://picsum.photos/seed/spring-rolls/400/300",
    available: true
  },
  {
    name: "Hot & Sour Soup",
    description: "Spicy and tangy soup.",
    price: 6.50,
    category: "Soups",
    image: "https://picsum.photos/seed/hot-and-sour-soup/400/300",
    available: true
  },

  {
    name: "Tomato Soup",
    description: "Creamy tomato soup.",
    price: 5.99,
    category: "Soups",
    image: "https://picsum.photos/seed/tomato-soup/400/300",
    available: true
  },
  {
    name: "Minestrone Soup",
    description: "Italian vegetable soup.",
    price: 6.99,
    category: "Soups",
    image: "https://picsum.photos/seed/minestrone/400/300",
    available: true
  },
  {
    name: "Grilled Paneer Sandwich",
    description: "Paneer stuffed sandwich.",
    price: 9.99,
    category: "Sandwiches",
    image: "https://picsum.photos/seed/paneer-sandwich/400/300",
    available: true
  },
  {
    name: "Egg Omelette",
    description: "Fluffy egg omelette.",
    price: 5.50,
    category: "Breakfast",
    image: "https://picsum.photos/seed/omelette/400/300",
    available: true
  },
  {
    name: "Pancakes",
    description: "Stack of fluffy pancakes.",
    price: 6.99,
    category: "Breakfast",
    image: "https://picsum.photos/seed/pancakes/400/300",
    available: true
  },

  {
    name: "Waffles",
    description: "Crispy waffles with syrup.",
    price: 7.50,
    category: "Breakfast",
    image: "https://picsum.photos/seed/waffles/400/300",
    available: true
  },
  {
    name: "Fruit Bowl",
    description: "Fresh seasonal fruits.",
    price: 5.99,
    category: "Healthy",
    image: "https://picsum.photos/seed/fruit-bowl/400/300",
    available: true
  },
  {
    name: "Avocado Toast",
    description: "Toast with mashed avocado.",
    price: 8.99,
    category: "Healthy",
    image: "https://picsum.photos/seed/avocado-toast/400/300",
    available: true
  },
  {
    name: "Quinoa Salad",
    description: "Healthy quinoa with veggies.",
    price: 10.99,
    category: "Healthy",
    image: "https://picsum.photos/seed/quinoa-salad/400/300",
    available: true
  }
]

export const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const menuRef = collection(db, 'menu');
    
    const seedMenu = async () => {
      try {
        const snapshot = await getDocs(menuRef);
        const existingDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        const existingNamesMap = new Map(existingDocs.map(doc => [doc.name, doc]));
        
        for (const item of SAMPLE_MENU) {
          const existingItem = existingNamesMap.get(item.name!);
          if (!existingItem) {
            // Add missing item
            await addDoc(menuRef, item);
          } else {
            // Update existing item if image or price changed
            if (existingItem.image !== item.image || existingItem.price !== item.price || existingItem.description !== item.description) {
              const docRef = doc(db, 'menu', existingItem.id);
              await updateDoc(docRef, {
                image: item.image,
                price: item.price,
                description: item.description,
                category: item.category,
                available: item.available
              });
            }
          }
        }
      } catch (error) {
        console.error('Error seeding menu:', error);
      }
    };
    
    seedMenu();

    const q = query(menuRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const menuItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setItems(menuItems);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'menu');
    });

    return unsubscribe;
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(items.map(item => item.category)));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search for dishes..." 
            className="pl-9 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Button 
              variant={selectedCategory === null ? 'default' : 'outline'} 
              size="sm"
              className="rounded-full px-6"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button 
                key={cat} 
                variant={selectedCategory === cat ? 'default' : 'outline'} 
                size="sm"
                className="rounded-full px-6 whitespace-nowrap"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-card/50 backdrop-blur-sm">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur text-black border-none font-semibold">
                  {item.category}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                  <span className="font-bold text-lg text-primary">${item.price.toFixed(2)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{item.description}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  className="w-full gap-2 h-11 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" 
                  onClick={() => {
                    addToCart({
                      menuItemId: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image
                    });
                    toast.success(`Added ${item.name} to cart`);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          <Button 
            variant="link" 
            className="mt-4"
            onClick={() => {
              setSearch('');
              setSelectedCategory(null);
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};
