// 🔒 BLOCK seeding unless running on localhost
if (
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  alert("🚨 Seeder blocked: Not running on localhost!");
  throw new Error("Seeder blocked: Not localhost.");
}

// seedDummyData.js



async function seedDummyMenus() {

    const menus = {
        "2026-03-02": {
            Lunch: {
                m1: "Beef Lasagne",
                m2: "Lemon Herb Chicken",
                c1: "Roast Potatoes",
                v1: "Green Beans",
                v2: "Carrots",
                d1: "Rice Pudding",
                d2: "Apple Crumble",
                d3: "Fresh Fruit"
            },
            Dinner: {
                m1: "Baked Fish",
                m2: "Vegetable Stir Fry",
                c1: "Steamed Rice",
                v1: "Broccoli",
                v2: "Corn",
                d1: "Custard",
                d2: "Sponge Cake",
                d3: "Jelly"
            }
        },

        "2026-03-03": {
            Lunch: {
                m1: "Roast Pork",
                m2: "Vegetable Quiche",
                c1: "Mashed Potato",
                v1: "Peas",
                v2: "Carrots",
                d1: "Chocolate Mousse",
                d2: "Ice Cream",
                d3: "Fruit Salad"
            },
            Dinner: {
                m1: "Chicken Stir Fry",
                m2: "Pumpkin Soup",
                c1: "Noodles",
                v1: "Snow Peas",
                v2: "Capsicum",
                d1: "Custard Tart",
                d2: "Jelly",
                d3: "Banana"
            }
        },

        "2026-03-04": {
            Lunch: {
                m1: "Slow Cooked Lamb",
                m2: "Grilled Fish",
                c1: "Roast Pumpkin",
                v1: "Beans",
                v2: "Carrots",
                d1: "Apple Pie",
                d2: "Ice Cream",
                d3: "Fruit Cup"
            },
            Dinner: {
                m1: "Beef Stew",
                m2: "Vegetable Pasta",
                c1: "Rice",
                v1: "Broccoli",
                v2: "Peas",
                d1: "Vanilla Custard",
                d2: "Cake",
                d3: "Jelly"
            }
        },

        "2026-03-05": {
            Lunch: {
                m1: "Chicken Schnitzel",
                m2: "Spinach Ricotta Cannelloni",
                c1: "Chips",
                v1: "Salad",
                v2: "Corn",
                d1: "Cheesecake",
                d2: "Fruit Salad",
                d3: "Custard"
            },
            Dinner: {
                m1: "Baked Ham",
                m2: "Vegetable Soup",
                c1: "Bread Roll",
                v1: "Pumpkin",
                v2: "Beans",
                d1: "Jelly",
                d2: "Rice Pudding",
                d3: "Ice Cream"
            }
        },

        "2026-03-06": {
            Lunch: {
                m1: "Roast Turkey",
                m2: "Vegetable Curry",
                c1: "Rice",
                v1: "Broccoli",
                v2: "Carrots",
                d1: "Apple Crumble",
                d2: "Ice Cream",
                d3: "Fruit"
            },
            Dinner: {
                m1: "Fish Cakes",
                m2: "Tomato Pasta",
                c1: "Mashed Potato",
                v1: "Peas",
                v2: "Beans",
                d1: "Custard",
                d2: "Sponge Cake",
                d3: "Banana"
            }
        },

        "2026-03-07": {
            Lunch: {
                m1: "Beef Roast",
                m2: "Vegetable Frittata",
                c1: "Roast Potato",
                v1: "Carrots",
                v2: "Broccoli",
                d1: "Chocolate Cake",
                d2: "Ice Cream",
                d3: "Fruit Salad"
            },
            Dinner: {
                m1: "Chicken Noodle Soup",
                m2: "Grilled Fish",
                c1: "Rice",
                v1: "Beans",
                v2: "Corn",
                d1: "Jelly",
                d2: "Custard",
                d3: "Apple"
            }
        },

        "2026-03-08": {
            Lunch: {
                m1: "Pork Chops",
                m2: "Vegetable Lasagne",
                c1: "Mashed Potato",
                v1: "Peas",
                v2: "Carrots",
                d1: "Apple Pie",
                d2: "Ice Cream",
                d3: "Fruit"
            },
            Dinner: {
                m1: "Beef Casserole",
                m2: "Pumpkin Soup",
                c1: "Bread Roll",
                v1: "Broccoli",
                v2: "Beans",
                d1: "Custard",
                d2: "Cake",
                d3: "Jelly"
            }
        },

        "2026-03-09": {
            Lunch: {
                m1: "Chicken Parmigiana",
                m2: "Vegetable Stir Fry",
                c1: "Chips",
                v1: "Salad",
                v2: "Corn",
                d1: "Cheesecake",
                d2: "Fruit Salad",
                d3: "Ice Cream"
            },
            Dinner: {
                m1: "Fish Pie",
                m2: "Tomato Soup",
                c1: "Rice",
                v1: "Carrots",
                v2: "Peas",
                d1: "Custard",
                d2: "Jelly",
                d3: "Banana"
            }
        },

        "2026-03-10": {
            Lunch: {
                m1: "Roast Beef",
                m2: "Vegetable Quiche",
                c1: "Roast Potatoes",
                v1: "Beans",
                v2: "Carrots",
                d1: "Apple Crumble",
                d2: "Ice Cream",
                d3: "Fruit"
            },
            Dinner: {
                m1: "Chicken Curry",
                m2: "Grilled Fish",
                c1: "Rice",
                v1: "Broccoli",
                v2: "Peas",
                d1: "Custard",
                d2: "Cake",
                d3: "Jelly"
            }
        }
    };

    try {
        for (const date in menus) {
            for (const mealType in menus[date]) {
                await db.collection("menus")
                    .doc(date)
                    .collection("meals")
                    .doc(mealType)
                    .set(menus[date][mealType]);
            }
        }

        console.log("✅ 9 days of dummy menus inserted successfully");

    } catch (error) {
        console.error("❌ Error seeding data:", error);
    }
}

seedDummyMenus();