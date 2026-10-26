/**
 * Selected customer reviews, transcribed by the business from its Google Maps listing (screenshots supplied
 * 2026-10-26). Rules for this file:
 *  - Text is verbatim — never edit a reviewer's words (spelling and emoji included).
 *  - Reviewers are shown by first name and last initial only.
 *  - This is a labelled selection; the page always links to every review on Google Maps.
 *  - Leave out reviews that make claims the business would have to stand behind (e.g. warranty terms),
 *    duplicates, and truncated text.
 */

export interface Testimonial {
  id: string;
  /** First name + last initial, as shown on the site. */
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source: "google-maps";
  /** Shown large at the top of the selection and on the homepage. */
  featured?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "suresh-k",
    author: "Suresh K.",
    rating: 5,
    text: "I have done stage 1 plus for my E250 Benz. A mass change in the performance.\nFully satisfied with new generation Dindigul. Charges is also very Very reasonable.\nThank you Alfar sir.",
    source: "google-maps",
    featured: true,
  },
  {
    id: "hythem-a",
    author: "Hythem A.",
    rating: 5,
    text: "Well experienced Staff and quality Products only availability, i made key for bmw key and it's really very perfect and very very cheap so i recommend this shop very highly",
    source: "google-maps",
    featured: true,
  },
  {
    id: "sajal-r",
    author: "Sajal R.",
    rating: 5,
    text: "They are able to diagnose any kind of issues...",
    source: "google-maps",
    featured: true,
  },
  { id: "syed-a", author: "Syed A.", rating: 5, text: "Best sensor key Makers in dindigul. Best automobile Diagnoster.. Well experienced staff.", source: "google-maps" },
  { id: "surya-k", author: "Surya K.", rating: 5, text: "Best diagonastic for cars in tamilnadu", source: "google-maps" },
  {
    id: "gopi-s",
    author: "Gopi S.",
    rating: 5,
    text: "Really best really best shop for making senor key and making your vechile tuned in Tamilnadu, best shop",
    source: "google-maps",
  },
  { id: "afiyullah-y", author: "Afiyullah Y.", rating: 5, text: "Best Service And affordable Cost with top quality products", source: "google-maps" },
  { id: "raj-k", author: "Raj K.", rating: 5, text: "Perfect work... perfect quality... perfect price....", source: "google-maps" },
  {
    id: "senthil-k",
    author: "Senthil K.",
    rating: 5,
    text: "I really appreciate them for providing best quality products..And High quality customer Satisfaction",
    source: "google-maps",
  },
  { id: "mohamed-a", author: "Mohamed A.", rating: 5, text: "BEST SENSOR  KEYMAKERS. HIGHLY EXPERIENCED STAFF . GOOD QUALITY PRODUCTS", source: "google-maps" },
  { id: "anand-s", author: "Anand S.", rating: 5, text: "Good Service & Very Fast", source: "google-maps" },
  { id: "manoj-s", author: "Manoj S.", rating: 5, text: "Very fast and super work", source: "google-maps" },
];

export const featuredTestimonials = () => testimonials.filter((t) => t.featured);
