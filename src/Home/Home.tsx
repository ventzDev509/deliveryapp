import FoodCard from "../FoodCard/FoodCard";
import PopularRestaurantCard from "../FoodCard/PopularRestaurantCard";
import BannerSlider from "./BannerSlide";
import CategorySlider from "./Category";
import Header from "./Header";

const foodItems = [
    {
        id: 1,
        title: "Classic Cheeseburger",
        category: "Burger",
        price: 12.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
        deliveryTime: "20-30 min",
        discount: 20,
        isPopular: true
    },
    {
        id: 2,
        title: "Pepperoni Supreme Pizza",
        category: "Pizza",
        price: 15.50,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
        deliveryTime: "25-35 min",
        discount: 15,
        isPopular: true
    },
    {
        id: 3,
        title: "Crispy Fried Chicken",
        category: "Chicken",
        price: 10.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1200&auto=format&fit=crop",
        deliveryTime: "15-25 min",
        discount: 0,
        isPopular: false
    },
    {
        id: 4,
        title: "Fresh Salmon Sushi",
        category: "Sushi",
        price: 18.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
        deliveryTime: "30-40 min",
        discount: 10,
        isPopular: true
    }
];

// Nou kreye yon array pou restoran yo tou
const restaurants = [
    {
        id: "1",
        name: "Burger House & Grill",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
        cuisine: "Fast Food, Burgers, American",
        rating: 4.8,
        deliveryTime: "20-30 min",
        priceRange: "$$"
    },
    {
        id: "2",
        name: "Sushi Master Tokyo",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
        cuisine: "Japanese, Sushi, Seafood",
        rating: 4.9,
        deliveryTime: "30-40 min",
        priceRange: "$$$"
    }
];

export default function Home() {
    return (
        <div className="pb-28">
            <Header />
            <BannerSlider />
            <CategorySlider />
            
            {/* SEKSYON POPULAR FOODS */}
            <div className="max-w-7xl mx-auto ">
                <div className="flex px-5 justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-lg tracking-wide">
                        Popular Foods
                    </h3>
                    <button className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                        See All
                    </button>
                </div>
                
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-3 pt-1">
                    {foodItems.map((food) => (
                        <div key={food.id} className="w-[240px] sm:w-[270px] flex-shrink-0">
                            <FoodCard 
                                title={food.title}
                                category={food.category}
                                price={food.price}
                                rating={food.rating}
                                image={food.image}
                                deliveryTime={food.deliveryTime}
                                discount={food.discount}
                                isPopular={food.isPopular}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* SEKSYON POPULAR RESTAURANTS */}
            <div className="max-w-7xl mx-auto mt-8">
                <div className="flex px-5 justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-lg tracking-wide">
                        Popular Restaurants
                    </h3>
                    <button className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                        See All
                    </button>
                </div>
                
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 px-5">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="w-[260px] sm:w-[290px] flex-shrink-0">
                            <PopularRestaurantCard 
                                id={restaurant.id}
                                name={restaurant.name}
                                image={restaurant.image}
                                cuisine={restaurant.cuisine}
                                rating={restaurant.rating}
                                deliveryTime={restaurant.deliveryTime}
                                priceRange={restaurant.priceRange}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}