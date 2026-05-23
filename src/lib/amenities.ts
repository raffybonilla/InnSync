export const AMENITIES_MAP: Record<
  string,
  { label: string; icon: string; description: string }
> = {
  wifi: { label: "Free Wi-Fi", icon: "📶", description: "High-speed internet" },
  pool: { label: "Pool Access", icon: "🏊", description: "Swimming pool" },
  breakfast: { label: "Breakfast", icon: "🍳", description: "Free breakfast included" },
  tv: { label: "Smart TV", icon: "📺", description: "Entertainment system" },
  aircon: {
    label: "Individual room climate control",
    icon: "🌡️",
    description: "Climate control",
  },
  mini_fridge: { label: "Minibar or fridge", icon: "🧊", description: "In-room refrigerator" },
  hairdryer: { label: "Professional hair dryer", icon: "💇", description: "Hair dryer" },
  dining: { label: "Dining room area", icon: "🍽️", description: "Dining area" },
  bathrobe: { label: "Bathrobe and slippers", icon: "🧥", description: "Luxury amenities" },
  workspace: { label: "Work Desk", icon: "💼", description: "Business center" },
  safe: { label: "In-room Safe", icon: "🔐", description: "Security deposit box" },
  view: { label: "City/Ocean View", icon: "🌆", description: "Scenic view" },
};

export function getAmenityLabel(id: string): string {
  return AMENITIES_MAP[id]?.label || id;
}
