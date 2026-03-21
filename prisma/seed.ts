import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.cabBooking.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.package.deleteMany();
  await prisma.cabType.deleteMany();
  await prisma.destination.deleteMany();

  // --- Destinations ---
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: "Manali",
        slug: "manali",
        description:
          "Nestled in the Kullu Valley of Himachal Pradesh, Manali is a breathtaking hill station surrounded by snow-capped peaks, lush green forests, and the roaring Beas River. A paradise for adventure enthusiasts and honeymooners alike, it offers everything from paragliding and skiing to serene temple visits and hot spring baths.",
        region: "North India",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Goa",
        slug: "goa",
        description:
          "India's smallest state packs the biggest punch when it comes to beaches, nightlife, and Portuguese heritage. From the vibrant shores of Baga and Calangute to the tranquil beauty of Palolem, Goa offers golden sands, world-class seafood, historic churches, and a laid-back vibe that keeps travelers coming back.",
        region: "West India",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Kerala",
        slug: "kerala",
        description:
          "Known as 'God's Own Country,' Kerala is a tropical paradise of backwaters, tea plantations, and pristine beaches. Cruise through the serene backwaters of Alleppey on a houseboat, explore the misty hills of Munnar, or rejuvenate with an authentic Ayurvedic spa experience.",
        region: "South India",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Rajasthan",
        slug: "rajasthan",
        description:
          "The Land of Kings welcomes you with magnificent forts, opulent palaces, vibrant bazaars, and the vast Thar Desert. From the pink city of Jaipur to the blue city of Jodhpur, and from the golden dunes of Jaisalmer to the romantic lakes of Udaipur, Rajasthan is a royal experience.",
        region: "North India",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Ladakh",
        slug: "ladakh",
        description:
          "The roof of the world, Ladakh is a high-altitude desert of dramatic landscapes, crystal-clear lakes, and ancient Buddhist monasteries. Ride through the legendary Khardung La pass, camp beside the mesmerizing Pangong Lake, and discover a culture that has thrived for centuries amid the Himalayas.",
        region: "North India",
        image: "https://images.unsplash.com/photo-1626015365107-64e5ea3abfe4?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Andaman Islands",
        slug: "andaman-islands",
        description:
          "A tropical archipelago in the Bay of Bengal, the Andaman Islands boast pristine white-sand beaches, turquoise waters, vibrant coral reefs, and lush rainforests. Snorkel at Havelock Island, explore the historic Cellular Jail in Port Blair, and discover some of Asia's most untouched natural beauty.",
        region: "East India",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        featured: true,
      },
    }),
  ]);

  const [manali, goa, kerala, rajasthan, ladakh, andaman] = destinations;

  // --- Packages ---
  await Promise.all([
    // Manali packages
    prisma.package.create({
      data: {
        title: "Manali Adventure Expedition",
        slug: "manali-adventure-expedition",
        destinationId: manali.id,
        price: 15999,
        duration: "5 Days / 4 Nights",
        groupSize: "2-12 People",
        category: "adventure",
        itinerary: [
          { day: 1, title: "Arrival in Manali", description: "Arrive in Manali, check into hotel. Evening walk along Mall Road and visit Hadimba Temple." },
          { day: 2, title: "Solang Valley Adventure", description: "Full day at Solang Valley — paragliding, zorbing, and rope activities. Evening bonfire at camp." },
          { day: 3, title: "Rohtang Pass Excursion", description: "Drive to Rohtang Pass (3,978m). Snow activities, stunning views of Lahaul Valley. Return by evening." },
          { day: 4, title: "River Rafting & Old Manali", description: "Morning white-water rafting on Beas River. Afternoon explore Old Manali cafes and markets." },
          { day: 5, title: "Departure", description: "Breakfast, checkout, and transfer to Bhuntar Airport or Manali Bus Stand." },
        ],
        inclusions: ["Hotel accommodation (4 nights)", "Daily breakfast & dinner", "All transfers in private vehicle", "Solang Valley activities", "River rafting", "Rohtang Pass permit"],
        exclusions: ["Airfare/train tickets", "Lunch", "Personal expenses", "Travel insurance", "Any activity not mentioned"],
        images: [
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
          "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Manali Honeymoon Bliss",
        slug: "manali-honeymoon-bliss",
        destinationId: manali.id,
        price: 22999,
        duration: "4 Days / 3 Nights",
        groupSize: "2 People",
        category: "honeymoon",
        itinerary: [
          { day: 1, title: "Romantic Arrival", description: "Airport/bus pickup, check into luxury resort. Candlelight dinner with mountain views." },
          { day: 2, title: "Solang & Spa", description: "Morning cable car ride at Solang Valley. Afternoon couples spa and Ayurvedic massage." },
          { day: 3, title: "Private Excursion", description: "Private car to Naggar Castle and Roerich Art Gallery. Evening riverside picnic arranged." },
          { day: 4, title: "Farewell", description: "Leisure morning, brunch at resort, transfer to departure point with photo memories." },
        ],
        inclusions: ["Luxury resort (3 nights)", "All meals included", "Private cab throughout", "Candlelight dinner", "Couples spa session", "Flower-decorated room"],
        exclusions: ["Airfare", "Personal shopping", "Adventure activities", "Travel insurance"],
        images: [
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
        ],
        featured: false,
      },
    }),
    // Goa packages
    prisma.package.create({
      data: {
        title: "Goa Beach Carnival",
        slug: "goa-beach-carnival",
        destinationId: goa.id,
        price: 12999,
        duration: "4 Days / 3 Nights",
        groupSize: "2-8 People",
        category: "beach",
        itinerary: [
          { day: 1, title: "Welcome to Goa", description: "Airport pickup, check into beachside resort. Sunset at Baga Beach with welcome drinks." },
          { day: 2, title: "North Goa Explorer", description: "Visit Fort Aguada, Anjuna Flea Market, Vagator Beach. Evening at Tito's Lane nightlife." },
          { day: 3, title: "South Goa Serenity", description: "Visit Basilica of Bom Jesus, Se Cathedral. Afternoon at Palolem Beach. Seafood dinner cruise on Mandovi River." },
          { day: 4, title: "Departure", description: "Morning water sports (parasailing, jet ski). Checkout and airport transfer." },
        ],
        inclusions: ["Resort stay (3 nights)", "Breakfast daily", "Airport transfers", "Sightseeing in AC vehicle", "Mandovi River cruise", "Water sports (1 session)"],
        exclusions: ["Flights", "Lunch & dinner (except cruise)", "Drinks", "Personal expenses"],
        images: [
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Goa Family Fun",
        slug: "goa-family-fun",
        destinationId: goa.id,
        price: 18999,
        duration: "5 Days / 4 Nights",
        groupSize: "4-10 People",
        category: "family",
        itinerary: [
          { day: 1, title: "Family Arrival", description: "Airport pickup, resort check-in with pool access. Kids activity zone setup." },
          { day: 2, title: "Dolphin Cruise & Beaches", description: "Morning dolphin spotting cruise. Afternoon at Calangute Beach with sandcastle building." },
          { day: 3, title: "Spice Plantation & Culture", description: "Visit a Goan spice plantation with elephant ride. Afternoon at Ancestral Goa museum." },
          { day: 4, title: "Adventure Day", description: "Dudhsagar Waterfalls jeep safari. Evening at Colva Beach." },
          { day: 5, title: "Leisure & Departure", description: "Pool time, shopping at Mapusa Market. Airport transfer." },
        ],
        inclusions: ["Family suite (4 nights)", "All meals", "All transfers", "Dolphin cruise", "Spice plantation tour", "Dudhsagar jeep safari"],
        exclusions: ["Flights", "Personal purchases", "Extra activities", "Travel insurance"],
        images: [
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        ],
        featured: false,
      },
    }),
    // Kerala packages
    prisma.package.create({
      data: {
        title: "Kerala Backwater Bliss",
        slug: "kerala-backwater-bliss",
        destinationId: kerala.id,
        price: 19999,
        duration: "6 Days / 5 Nights",
        groupSize: "2-6 People",
        category: "honeymoon",
        itinerary: [
          { day: 1, title: "Cochin Heritage", description: "Arrive in Cochin. Visit Fort Kochi, Chinese Fishing Nets, Jewish Synagogue. Evening Kathakali dance show." },
          { day: 2, title: "Munnar Tea Gardens", description: "Drive to Munnar (4 hrs). Visit tea plantations, Eravikulam National Park. Stay in hillside resort." },
          { day: 3, title: "Munnar Exploration", description: "Mattupetty Dam, Echo Point, Kundala Lake. Tea museum visit. Evening Ayurvedic massage." },
          { day: 4, title: "Thekkady Wildlife", description: "Drive to Thekkady. Periyar Wildlife Sanctuary boat cruise. Spice garden walk." },
          { day: 5, title: "Alleppey Houseboat", description: "Drive to Alleppey. Board luxury houseboat for overnight backwater cruise. Kerala cuisine on board." },
          { day: 6, title: "Departure", description: "Disembark houseboat. Transfer to Cochin Airport." },
        ],
        inclusions: ["5 nights accommodation (hotels + houseboat)", "Breakfast & dinner daily", "AC vehicle transfers", "Houseboat with all meals", "Periyar boat cruise", "Kathakali show tickets"],
        exclusions: ["Flights", "Lunch", "Personal expenses", "Camera fees at parks", "Tips"],
        images: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Kerala Ayurveda Retreat",
        slug: "kerala-ayurveda-retreat",
        destinationId: kerala.id,
        price: 25999,
        duration: "5 Days / 4 Nights",
        groupSize: "1-4 People",
        category: "honeymoon",
        itinerary: [
          { day: 1, title: "Wellness Begins", description: "Arrive at Ayurvedic resort in Kovalam. Consultation with Ayurvedic doctor. Personalized treatment plan." },
          { day: 2, title: "Full Spa Day", description: "Morning yoga, Abhyanga massage, Shirodhara therapy. Afternoon meditation by the beach." },
          { day: 3, title: "Nature & Healing", description: "Herbal garden tour, cooking class for Ayurvedic meals. Evening temple visit." },
          { day: 4, title: "Beach & Rejuvenation", description: "Morning swim at Kovalam Beach. Final spa treatment. Sunset catamaran ride." },
          { day: 5, title: "Departure", description: "Final yoga session, take-home Ayurvedic wellness kit. Airport transfer." },
        ],
        inclusions: ["Ayurvedic resort (4 nights)", "All Ayurvedic meals", "Daily yoga sessions", "6 spa treatments", "Doctor consultation", "Wellness kit"],
        exclusions: ["Flights", "Personal shopping", "Extra treatments", "Travel insurance"],
        images: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        ],
        featured: false,
      },
    }),
    // Rajasthan packages
    prisma.package.create({
      data: {
        title: "Royal Rajasthan Circuit",
        slug: "royal-rajasthan-circuit",
        destinationId: rajasthan.id,
        price: 24999,
        duration: "7 Days / 6 Nights",
        groupSize: "2-10 People",
        category: "family",
        itinerary: [
          { day: 1, title: "Jaipur - Pink City", description: "Arrive in Jaipur. Visit Amber Fort with elephant ride, Hawa Mahal. Evening light show at Amber." },
          { day: 2, title: "Jaipur Exploration", description: "City Palace, Jantar Mantar observatory, Nahargarh Fort sunset. Shopping at Johari Bazaar." },
          { day: 3, title: "Jodhpur - Blue City", description: "Drive to Jodhpur (5 hrs). Visit Mehrangarh Fort, Jaswant Thada. Evening at Clock Tower market." },
          { day: 4, title: "Jaisalmer - Golden City", description: "Drive to Jaisalmer (5 hrs). Visit Jaisalmer Fort, Patwon Ki Haveli. Evening at Sam Sand Dunes." },
          { day: 5, title: "Desert Experience", description: "Camel safari at sunrise. Visit Kuldhara ghost village. Evening desert camp with folk dance." },
          { day: 6, title: "Udaipur - City of Lakes", description: "Fly/drive to Udaipur. Visit City Palace, Lake Pichola boat ride. Dinner at lakeside restaurant." },
          { day: 7, title: "Departure", description: "Visit Saheliyon Ki Bari. Shopping. Airport transfer." },
        ],
        inclusions: ["Heritage hotel stays (6 nights)", "Breakfast & dinner", "AC vehicle & driver", "All monument entry fees", "Desert camp (1 night)", "Camel safari", "Lake Pichola boat ride"],
        exclusions: ["Flights between cities", "Lunch", "Personal shopping", "Tips", "Camera fees"],
        images: [
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Rajasthan Heritage Walk",
        slug: "rajasthan-heritage-walk",
        destinationId: rajasthan.id,
        price: 14999,
        duration: "4 Days / 3 Nights",
        groupSize: "2-15 People",
        category: "religious",
        itinerary: [
          { day: 1, title: "Pushkar Sacred", description: "Arrive in Pushkar. Visit Brahma Temple, Pushkar Lake aarti ceremony. Stay near the ghats." },
          { day: 2, title: "Ajmer & Pushkar", description: "Morning visit to Ajmer Sharif Dargah. Afternoon Pushkar bazaar and camel fair grounds." },
          { day: 3, title: "Jaipur Temples", description: "Drive to Jaipur. Visit Birla Mandir, Govind Dev Ji Temple, Galtaji Monkey Temple." },
          { day: 4, title: "Departure", description: "Morning meditation at temple. Checkout and transfer." },
        ],
        inclusions: ["Hotel stays (3 nights)", "Vegetarian meals", "AC vehicle", "Guide at all temples", "Pushkar Lake aarti ceremony"],
        exclusions: ["Flights/trains", "Donations at temples", "Personal expenses", "Shopping"],
        images: [
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        ],
        featured: false,
      },
    }),
    // Ladakh packages
    prisma.package.create({
      data: {
        title: "Ladakh Bike Expedition",
        slug: "ladakh-bike-expedition",
        destinationId: ladakh.id,
        price: 29999,
        duration: "7 Days / 6 Nights",
        groupSize: "4-12 People",
        category: "adventure",
        itinerary: [
          { day: 1, title: "Arrive in Leh", description: "Fly into Leh (3,500m). Rest day for acclimatization. Evening walk through Leh Market." },
          { day: 2, title: "Leh Sightseeing", description: "Visit Leh Palace, Shanti Stupa, Hall of Fame museum. Bike orientation and safety briefing." },
          { day: 3, title: "Khardung La Pass", description: "Ride to Khardung La (5,359m) — one of the world's highest motorable roads. Views of Karakoram Range." },
          { day: 4, title: "Nubra Valley", description: "Ride to Nubra Valley via Khardung La. Double-humped Bactrian camel ride at Hunder Sand Dunes." },
          { day: 5, title: "Pangong Lake", description: "Ride to Pangong Tso (4,350m). Overnight camping beside the iconic blue lake." },
          { day: 6, title: "Return to Leh", description: "Ride back via Chang La pass. Visit Hemis Monastery. Farewell dinner in Leh." },
          { day: 7, title: "Departure", description: "Transfer to Leh Airport. Fly out with lifetime memories." },
        ],
        inclusions: ["Royal Enfield bike rental", "Fuel & mechanic support", "Camping gear", "Guest house stays", "Breakfast & dinner", "Inner Line Permits", "Oxygen cylinders"],
        exclusions: ["Flights to/from Leh", "Lunch", "Riding gear (can be rented)", "Personal expenses", "Medical insurance (strongly recommended)"],
        images: [
          "https://images.unsplash.com/photo-1626015365107-64e5ea3abfe4?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Ladakh Monastery Trail",
        slug: "ladakh-monastery-trail",
        destinationId: ladakh.id,
        price: 21999,
        duration: "5 Days / 4 Nights",
        groupSize: "2-8 People",
        category: "religious",
        itinerary: [
          { day: 1, title: "Leh Arrival", description: "Arrive and acclimatize. Visit Shanti Stupa at sunset." },
          { day: 2, title: "Thiksey & Hemis", description: "Visit Thiksey Monastery (mini Potala Palace), Hemis Monastery. Attend morning prayers." },
          { day: 3, title: "Alchi & Lamayuru", description: "Drive to Alchi (1000-year-old murals) and Lamayuru (Moonland monastery). Meditation session." },
          { day: 4, title: "Diskit & Nubra", description: "Drive to Diskit Monastery (giant Maitreya Buddha statue). Explore Nubra Valley." },
          { day: 5, title: "Departure", description: "Morning prayers at Leh monastery. Airport transfer." },
        ],
        inclusions: ["Hotel stays (4 nights)", "All meals", "AC vehicle & driver", "Monastery entry fees", "Meditation sessions", "Inner Line Permits"],
        exclusions: ["Flights", "Personal donations", "Shopping", "Travel insurance"],
        images: [
          "https://images.unsplash.com/photo-1626015365107-64e5ea3abfe4?w=800",
        ],
        featured: false,
      },
    }),
    // Andaman packages
    prisma.package.create({
      data: {
        title: "Andaman Island Hopper",
        slug: "andaman-island-hopper",
        destinationId: andaman.id,
        price: 27999,
        duration: "6 Days / 5 Nights",
        groupSize: "2-8 People",
        category: "beach",
        itinerary: [
          { day: 1, title: "Port Blair", description: "Arrive at Veer Savarkar Airport. Visit Cellular Jail, attend Light & Sound show." },
          { day: 2, title: "Havelock Island", description: "Ferry to Havelock. Snorkeling at Elephant Beach. Relax at Radhanagar Beach (Asia's best beach)." },
          { day: 3, title: "Scuba & Beach", description: "Morning scuba diving at Nemo Reef. Afternoon kayaking through mangroves." },
          { day: 4, title: "Neil Island", description: "Ferry to Neil Island. Visit Natural Bridge, Laxmanpur Beach sunset. Seafood dinner." },
          { day: 5, title: "Ross & North Bay", description: "Return to Port Blair. Glass-bottom boat at North Bay Island. Explore Ross Island ruins." },
          { day: 6, title: "Departure", description: "Morning at Corbyn's Cove Beach. Shopping. Airport transfer." },
        ],
        inclusions: ["Resort stays (5 nights)", "Breakfast & dinner", "All ferry tickets", "Scuba diving (1 session)", "Snorkeling gear", "Glass-bottom boat", "Airport & jetty transfers"],
        exclusions: ["Flights to Port Blair", "Lunch", "Extra water sports", "Personal expenses", "Camera fees underwater"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Andaman Wildlife & Coral",
        slug: "andaman-wildlife-coral",
        destinationId: andaman.id,
        price: 19999,
        duration: "4 Days / 3 Nights",
        groupSize: "2-6 People",
        category: "wildlife",
        itinerary: [
          { day: 1, title: "Port Blair Nature", description: "Visit Samudrika Naval Marine Museum, Anthropological Museum. Evening at Cellular Jail." },
          { day: 2, title: "Baratang Island", description: "Day trip to Baratang — limestone caves and mud volcanoes through mangrove creeks." },
          { day: 3, title: "Havelock Coral", description: "Ferry to Havelock. Glass-bottom boat coral viewing. Guided marine biology walk." },
          { day: 4, title: "Departure", description: "Ferry back to Port Blair. Airport transfer." },
        ],
        inclusions: ["Hotel stays (3 nights)", "All meals", "Ferry tickets", "Baratang permits", "Glass-bottom boat", "Guided nature walks"],
        exclusions: ["Flights", "Personal expenses", "Extra activities", "Camera fees"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ],
        featured: false,
      },
    }),
  ]);

  // --- Cab Types ---
  await Promise.all([
    prisma.cabType.create({
      data: {
        name: "Sedan",
        description: "Comfortable sedan perfect for couples and small families. Ideal for city tours and short-distance travel with ample luggage space.",
        pricePerKm: 12,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
        capacity: 4,
      },
    }),
    prisma.cabType.create({
      data: {
        name: "SUV",
        description: "Spacious SUV built for mountain roads and rough terrain. Perfect for hill station trips and adventure destinations.",
        pricePerKm: 18,
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
        capacity: 6,
      },
    }),
    prisma.cabType.create({
      data: {
        name: "Toyota Innova",
        description: "India's favorite family vehicle — reliable, spacious, and comfortable for long-distance highway journeys. The gold standard for group travel.",
        pricePerKm: 16,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
        capacity: 7,
      },
    }),
    prisma.cabType.create({
      data: {
        name: "Tempo Traveller",
        description: "Mini-bus with push-back seats, perfect for large groups, corporate outings, and pilgrimages. AC with music system and ample luggage space.",
        pricePerKm: 25,
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800",
        capacity: 15,
      },
    }),
  ]);

  // --- Testimonials ---
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Priya Sharma",
        location: "New Delhi",
        rating: 5,
        review: "Our Rajasthan trip was absolutely magical! The heritage hotels were stunning, and the desert camping experience was unforgettable. The team arranged everything perfectly — from the camel safari to the folk dance evening. Will definitely book again!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Rahul Mehta",
        location: "Mumbai",
        rating: 5,
        review: "Took the Ladakh Bike Expedition and it was the adventure of a lifetime. The team ensured our safety at every point, the bike was in great condition, and the camping at Pangong Lake was surreal. Worth every penny!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Ananya & Vikram",
        location: "Bangalore",
        rating: 5,
        review: "We chose the Kerala Backwater Bliss for our honeymoon and it exceeded all expectations. The houseboat experience was incredibly romantic, and the Ayurvedic spa was heavenly. Thank you for making our special trip perfect!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Sanjay Patel",
        location: "Ahmedabad",
        rating: 4,
        review: "Family trip to Goa was well organized. Kids loved the dolphin cruise and spice plantation. The hotel was right on the beach. Only wish the trip was a day longer — there was so much more to see!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Neha Gupta",
        location: "Pune",
        rating: 5,
        review: "The Andaman trip was a dream come true. Crystal clear water, amazing snorkeling, and the scuba diving experience was beyond words. The ferry arrangements were seamless. Highly recommend!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Amit & Kavita Roy",
        location: "Kolkata",
        rating: 5,
        review: "We've traveled with many agencies but WanderQuest stands out. Our Manali trip was perfectly planned — from the adventure activities to the cozy hotel. The customer support was excellent throughout. 10/10!",
        featured: true,
      },
    }),
  ]);

  // --- Sample Inquiries ---
  await Promise.all([
    prisma.inquiry.create({
      data: {
        name: "Deepak Verma",
        email: "deepak@example.com",
        phone: "+91-9876543210",
        message: "Hi, I'm interested in a customized Ladakh trip for 6 people in August. Can you help with an itinerary?",
      },
    }),
    prisma.inquiry.create({
      data: {
        name: "Meera Iyer",
        email: "meera@example.com",
        message: "Do you offer corporate retreat packages for 20-30 people? Looking for something in Goa or Kerala.",
      },
    }),
  ]);

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
