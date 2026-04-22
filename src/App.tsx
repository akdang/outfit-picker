import { useMemo, useState } from "react";

type Outfit = {
  id: number;
  top: string;
  pants: string;
  shoes: string;
  signature: boolean;
  occasion: string;
  mood: string[];
  accessories: string[];
};

const outfits: Outfit[] = [
  {
    id: 1,
    top: "White tee",
    pants: "Black chinos",
    shoes: "White sneakers",
    signature: true,
    occasion: "Daily / clean",
    mood: ["clean", "day", "easy"],
    accessories: [
      "Silver chain + black rectangle + matte cuff + studs",
      "Shiny thin band (thumb) + studs",
      "Shiny 3mm cuff + arrow ring",
      "Silver chain + signet + thin band + studs",
      "Silver chain + rectangle + shiny thin band + white diamond stud",
      "Silver chain + rectangle + thin band + silver gauge",
      "Silver chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 2,
    top: "White tee",
    pants: "Black chinos",
    shoes: "Black sneakers",
    signature: false,
    occasion: "Casual hangout",
    mood: ["social", "casual", "day"],
    accessories: [
      "Black chain + arrow ring + black Mobius + thin hoop",
      "Rectangle ring + shiny 3mm cuff + studs",
      "Black chain + signet + thin band + studs",
      "Black chain + rectangle + thin band + silver gauge",
      "Black chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 3,
    top: "White tee",
    pants: "Black jeans",
    shoes: "White sneakers",
    signature: false,
    occasion: "Weekend",
    mood: ["casual", "easy", "day"],
    accessories: [
      "Silver chain + rectangle ring + matte cuff + studs",
      "Thin silver band (right) + studs",
      "Silver chain + signet + studs",
      "Silver chain + thin band + silver gauge",
      "Silver chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 4,
    top: "Light gray tee",
    pants: "Black chinos",
    shoes: "White sneakers",
    signature: true,
    occasion: "Clean modern",
    mood: ["clean", "day", "date"],
    accessories: [
      "Silver chain + arrow ring + shiny thin band (thumb) + studs",
      "Shiny 3mm cuff + rectangle ring",
      "Silver chain + signet + thin band + studs",
      "Silver chain + arrow ring + shiny thin band + white diamond stud",
      "Silver chain + arrow ring + thin band + silver gauge",
      "Silver chain + arrow ring + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 5,
    top: "Light gray tee",
    pants: "Charcoal chinos",
    shoes: "Black sneakers",
    signature: false,
    occasion: "Casual office",
    mood: ["casual", "smart", "day"],
    accessories: [
      "Black chain + rectangle ring + black Mobius + studs",
      "Thin band + shiny 3mm cuff",
      "Black chain + signet + studs",
      "Black chain + rectangle + thin band + silver gauge",
      "Black chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 6,
    top: "Charcoal tee",
    pants: "Black chinos",
    shoes: "Black sneakers",
    signature: false,
    occasion: "Daily",
    mood: ["casual", "night", "easy"],
    accessories: [
      "Black chain + rectangle ring + matte cuff + studs",
      "Shiny thin band (thumb) + studs",
      "Black chain + signet + studs",
      "Black chain + rectangle + thin band + silver gauge",
      "Black chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 7,
    top: "Charcoal tee",
    pants: "Black jeans",
    shoes: "Black sneakers",
    signature: false,
    occasion: "Casual",
    mood: ["casual", "night", "edge"],
    accessories: [
      "Silver chain + arrow ring + black Mobius + thick hoop",
      "Shiny 6mm cuff + studs",
      "Silver chain + signet + studs",
      "Silver chain + thin band + silver gauge",
    ],
  },
  {
    id: 8,
    top: "Black tee",
    pants: "Black chinos",
    shoes: "Black sneakers",
    signature: true,
    occasion: "Night",
    mood: ["night", "edge", "date"],
    accessories: [
      "Black chain + rectangle ring + black Mobius + thick hoop",
      "Shiny thin band (thumb) + thin hoop",
      "Black chain + signet + thin band + studs",
      "Silver chain + rectangle + thin band + silver gauge",
      "Black chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 9,
    top: "Black tee",
    pants: "Black chinos",
    shoes: "Black boots",
    signature: false,
    occasion: "Casual date",
    mood: ["date", "night", "edge"],
    accessories: [
      "Silver chain + arrow ring + matte cuff + studs",
      "Shiny 3mm cuff + thin band",
      "Silver chain + signet + studs",
      "Silver chain + thin band + silver gauge",
      "Silver chain + arrow ring + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 10,
    top: "Black tee",
    pants: "Black jeans",
    shoes: "Black sneakers",
    signature: false,
    occasion: "Casual",
    mood: ["casual", "night", "easy"],
    accessories: [
      "Rectangle ring + matte cuff + studs",
      "Shiny thin band + studs",
      "Signet + thin band + studs",
      "Thin band + silver gauge",
    ],
  },
  {
    id: 11,
    top: "White button-up",
    pants: "Black chinos",
    shoes: "Black sneakers",
    signature: true,
    occasion: "Casual date",
    mood: ["date", "clean", "day"],
    accessories: [
      "Silver chain + arrow ring + shiny 3mm cuff + thin hoop",
      "Thin band + studs",
      "Silver chain + signet + studs",
      "Silver chain + signet + shiny 3mm cuff + white diamond studs",
      "Silver chain + signet + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 12,
    top: "White button-up",
    pants: "Dark blue jeans",
    shoes: "White sneakers",
    signature: false,
    occasion: "Daytime",
    mood: ["day", "clean", "smart"],
    accessories: [
      "Silver chain + rectangle ring + matte cuff + studs",
      "Shiny thin band + studs",
      "Silver chain + signet + studs",
      "Silver chain + rectangle + shiny thin band + white diamond stud",
      "Silver chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 13,
    top: "Light gray button-up",
    pants: "Black chinos",
    shoes: "White sneakers",
    signature: false,
    occasion: "Clean daytime",
    mood: ["day", "clean", "date"],
    accessories: [
      "Silver chain + arrow ring + shiny thin band + studs",
      "Shiny 3mm cuff + rectangle ring",
      "Silver chain + signet + thin band + studs",
      "Silver chain + signet + shiny thin band + white diamond stud",
      "Silver chain + signet + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 14,
    top: "Light gray button-up",
    pants: "Charcoal chinos",
    shoes: "Black sneakers",
    signature: false,
    occasion: "Casual office",
    mood: ["smart", "day", "casual"],
    accessories: [
      "Black chain + rectangle ring + black Mobius + thin hoop",
      "Shiny 3mm cuff + studs",
      "Black chain + signet + studs",
      "Black chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 15,
    top: "Light gray button-up",
    pants: "Black chinos",
    shoes: "Black boots",
    signature: true,
    occasion: "3rd date / night",
    mood: ["date", "night", "smart"],
    accessories: ["Silver chain + black rectangle + signet + shiny 3mm cuff + studs"],
  },
  {
    id: 16,
    top: "Dark gray button-up",
    pants: "Black chinos",
    shoes: "Black boots",
    signature: true,
    occasion: "Best overall",
    mood: ["smart", "night", "date"],
    accessories: [
      "Silver chain + rectangle ring + matte cuff + studs",
      "Thin band + shiny 3mm cuff",
      "Silver chain + signet + thin band + studs",
      "Silver chain + rectangle + shiny 3mm cuff + white diamond stud",
      "Silver chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 17,
    top: "Dark gray button-up",
    pants: "Charcoal chinos",
    shoes: "Black boots",
    signature: false,
    occasion: "Dinner",
    mood: ["smart", "night", "edge"],
    accessories: [
      "Black chain + arrow ring + black Mobius + thick hoop",
      "Shiny 6mm cuff + studs",
      "Black chain + signet + studs",
    ],
  },
  {
    id: 18,
    top: "Sage green button-up",
    pants: "Black chinos",
    shoes: "Black boots",
    signature: true,
    occasion: "Stylish",
    mood: ["date", "stylish", "night"],
    accessories: [
      "Black chain + arrow ring + black Mobius + thick hoop",
      "Shiny thin band + studs",
      "Black chain + signet + studs",
    ],
  },
  {
    id: 19,
    top: "Sage green button-up",
    pants: "Charcoal chinos",
    shoes: "Gray suede boots",
    signature: false,
    occasion: "Weekend",
    mood: ["day", "stylish", "casual"],
    accessories: [
      "Silver chain + rectangle ring + matte cuff + thin hoop",
      "Shiny 3mm cuff + studs",
      "Silver chain + signet + studs",
    ],
  },
  {
    id: 20,
    top: "Beige button-up",
    pants: "Black chinos",
    shoes: "Black boots",
    signature: true,
    occasion: "Smart casual",
    mood: ["date", "smart", "day"],
    accessories: [
      "Silver chain + arrow ring + shiny 3mm cuff + studs",
      "Thin band + studs",
      "Silver chain + signet + studs",
      "Silver chain + arrow ring + shiny thin band + white diamond stud",
      "Silver chain + arrow ring + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 21,
    top: "Beige button-up",
    pants: "Charcoal chinos",
    shoes: "Black boots",
    signature: false,
    occasion: "Evening",
    mood: ["smart", "night", "date"],
    accessories: [
      "Black chain + rectangle ring + black Mobius + thin hoop",
      "Shiny 6mm cuff + studs",
      "Black chain + signet + studs",
    ],
  },
  {
    id: 22,
    top: "Black button-up",
    pants: "Black chinos",
    shoes: "Black boots",
    signature: true,
    occasion: "Upscale",
    mood: ["smart", "night", "edge"],
    accessories: [
      "Silver chain + rectangle ring + matte cuff + studs",
      "Shiny thin band + studs",
      "Silver chain + signet + thin band + studs",
      "Silver chain + rectangle + thin band + silver/black mixed studs",
    ],
  },
  {
    id: 23,
    top: "Black button-up",
    pants: "Black jeans",
    shoes: "Black boots",
    signature: false,
    occasion: "Night out",
    mood: ["night", "edge", "stylish"],
    accessories: [
      "Black chain + arrow ring + black Mobius + gauge",
      "Shiny 6mm cuff + studs",
      "Black chain + signet + studs",
    ],
  },
  {
    id: 24,
    top: "White tee",
    pants: "Charcoal chinos",
    shoes: "White sneakers",
    signature: true,
    occasion: "Soft daytime",
    mood: ["day", "clean", "easy"],
    accessories: [
      "Silver chain + black rectangle + matte or shiny 3mm cuff + studs",
      "Shiny thin band (thumb) + studs",
      "Silver chain + signet + thin band + studs",
      "Silver chain + rectangle + thin band + silver gauge",
    ],
  },
  {
    id: 25,
    top: "Black tee",
    pants: "Charcoal chinos",
    shoes: "Black sneakers",
    signature: true,
    occasion: "Tonal night",
    mood: ["night", "edge", "smart"],
    accessories: [
      "Silver chain + black rectangle + matte cuff + studs",
      "Black chain + signet + thin band + studs",
      "Shiny thin band (thumb) + studs",
      "Silver chain + rectangle + thin band + silver gauge",
    ],
  },
];

const inventory = {
  tops: [
    "White tee",
    "Light gray tee",
    "Charcoal tee",
    "Black tee",
    "White button-up",
    "Light gray button-up",
    "Dark gray button-up",
    "Sage green button-up",
    "Beige button-up",
    "Black button-up",
  ],
  pants: [
    "Black chinos",
    "Charcoal chinos",
    "Black jeans",
    "Dark blue jeans",
    "Light blue jeans",
  ],
  shoes: [
    "Black sneakers",
    "White sneakers",
    "Black boots",
    "Gray suede boots",
  ],
  rings: [
    "Black thin rectangle ring",
    "Silver arrow retro ring",
    "Thin silver band",
    "Shiny thin silver band",
    "Silver/black top signet",
  ],
  necklaces: [
    'Silver 3mm box chain (20")',
    'Black 3mm box chain (20")',
  ],
  bracelets: [
    "Silver matte cuff (3mm)",
    "Shiny silver cuff (3mm)",
    "Shiny silver cuff (6mm)",
    "Shiny silver Mobius bracelet",
    "Black Mobius bracelet",
  ],
  earrings: [
    "Black studs",
    "White diamond studs",
    "Silver/black mixed studs",
    "Silver gauge",
    "Black gauge",
    "Black thin hoop",
    "Black thick hoop",
  ],
};

const moods = ["All", "clean", "day", "easy", "casual", "night", "edge", "date", "smart", "stylish"];

function getOccasionGroup(occasion: string) {
  const value = occasion.toLowerCase();

  if (value.includes("date")) return "Date";
  if (value.includes("office")) return "Office / Smart Casual";

  if (
    value.includes("night") ||
    value.includes("evening") ||
    value.includes("dinner") ||
    value.includes("upscale")
  ) {
    return "Night / Going Out";
  }

  if (
    value.includes("daily") ||
    value.includes("daytime") ||
    value.includes("weekend") ||
    value.includes("casual hangout") ||
    value === "casual"
  ) {
    return "Daytime / Casual";
  }

  if (
    value.includes("smart casual") ||
    value.includes("best overall") ||
    value.includes("stylish") ||
    value.includes("clean modern") ||
    value.includes("clean daytime") ||
    value.includes("soft daytime")
  ) {
    return "Elevated / Stylish";
  }

  return occasion;
}

function uniqueOccasionGroups(items: Outfit[]) {
  return ["All", ...new Set(items.map((item) => getOccasionGroup(item.occasion)))];
}

function getSwatch(label: string) {
  const value = label.toLowerCase();
  if (value.includes("sage green")) return { bg: "#9caf88", color: "#111111", border: "#9caf88" };
  if (value.includes("beige")) return { bg: "#d8c7ab", color: "#111111", border: "#d8c7ab" };
  if (value.includes("light gray")) return { bg: "#d9d9d9", color: "#111111", border: "#cfcfcf" };
  if (value.includes("dark gray")) return { bg: "#3d3d3d", color: "#ffffff", border: "#3d3d3d" };
  if (value.includes("charcoal")) return { bg: "#4a4a4a", color: "#ffffff", border: "#4a4a4a" };
  if (value.includes("white")) return { bg: "#f5f5f5", color: "#111111", border: "#cfcfcf" };
  if (value.includes("black")) return { bg: "#111111", color: "#ffffff", border: "#3a3a3a" };
  if (value.includes("dark blue")) return { bg: "#243a73", color: "#ffffff", border: "#243a73" };
  if (value.includes("gray suede")) return { bg: "#7f858d", color: "#ffffff", border: "#7f858d" };
  return { bg: "#222222", color: "#ffffff", border: "#3a3a3a" };
}

function SwatchBox({ label }: { label: string }) {
  const swatch = getSwatch(label);
  return (
    <div
      style={{
        background: swatch.bg,
        color: swatch.color,
        border: `1px solid ${swatch.border}`,
        borderRadius: 14,
        padding: "12px 10px",
        minHeight: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontWeight: 600,
        fontSize: 14,
        lineHeight: 1.25,
      }}
    >
      {label}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#111111",
  border: "1px solid #2a2a2a",
  borderRadius: 20,
  padding: 16,
};

const buttonStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid #3a3a3a",
  background: "#111111",
  color: "white",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: 14,
};

function uniqueValues(items: Outfit[], key: keyof Outfit): string[] {
  return ["All", ...new Set(items.map((item) => String(item[key])))];
}

function SectionCard({ title, items }: { title: string; items: string[] }) {
  const useSwatches = ["Tops", "Pants", "Shoes"].includes(title);

  return (
    <div style={{ ...cardStyle, background: "#090909" }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#888",
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((item) =>
          useSwatches ? (
            <SwatchBox key={item} label={item} />
          ) : (
            <div
              key={item}
              style={{
                border: "1px solid #222",
                background: "#000",
                borderRadius: 14,
                padding: "10px 12px",
                fontSize: 14,
                color: "#eee",
              }}
            >
              {item}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [top, setTop] = useState("All");
  const [pants, setPants] = useState("All");
  const [shoes, setShoes] = useState("All");
  const [occasion, setOccasion] = useState("All");
  const [mood, setMood] = useState("All");
  const [signatureOnly, setSignatureOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [showFilters, setShowFilters] = useState(false);
  const [screen, setScreen] = useState<"outfits" | "inventory">("outfits");

  const resetFilters = () => {
    setTop("All");
    setPants("All");
    setShoes("All");
    setOccasion("All");
    setMood("All");
    setSignatureOnly(false);
  };

  const topOptions = uniqueValues(outfits, "top");
  const pantsOptions = uniqueValues(outfits, "pants");
  const shoesOptions = uniqueValues(outfits, "shoes");
  const occasionOptions = uniqueOccasionGroups(outfits);

  const filtered = useMemo(() => {
    return outfits.filter((o) => {
      const moodMatch = mood === "All" || o.mood.includes(mood);
      return (
        (top === "All" || o.top === top) &&
        (pants === "All" || o.pants === pants) &&
        (shoes === "All" || o.shoes === shoes) &&
        (occasion === "All" || getOccasionGroup(o.occasion) === occasion) &&
        (!signatureOnly || o.signature) &&
        moodMatch
      );
    });
  }, [top, pants, shoes, occasion, mood, signatureOnly]);

  const selected = filtered.find((o) => o.id === selectedId) || filtered[0] || outfits[0];

  const randomPick = () => {
    if (!filtered.length) return;
    const next = filtered[Math.floor(Math.random() * filtered.length)];
    setSelectedId(next.id);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "white",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 96 }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(0,0,0,0.95)",
            borderBottom: "1px solid #1f1f1f",
            padding: 16,
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888" }}>
                Mobile outfit app
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>Paul&apos;s Outfit Picker</div>
            </div>
            {screen === "outfits" && (
              <button
                onClick={randomPick}
                style={{
                  ...buttonStyle,
                  background: "white",
                  color: "black",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Random
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <button
              onClick={() => setScreen("outfits")}
              style={{
                ...buttonStyle,
                borderRadius: 16,
                background: screen === "outfits" ? "white" : "#111111",
                color: screen === "outfits" ? "black" : "white",
                borderColor: screen === "outfits" ? "white" : "#3a3a3a",
                fontWeight: 600,
              }}
            >
              Outfits
            </button>
            <button
              onClick={() => setScreen("inventory")}
              style={{
                ...buttonStyle,
                borderRadius: 16,
                background: screen === "inventory" ? "white" : "#111111",
                color: screen === "inventory" ? "black" : "white",
                borderColor: screen === "inventory" ? "white" : "#3a3a3a",
                fontWeight: 600,
              }}
            >
              Inventory
            </button>
          </div>

          {screen === "outfits" ? (
            <>
              <button
                onClick={() => setShowFilters((v) => !v)}
                style={{ ...buttonStyle, width: "100%", borderRadius: 16, marginBottom: 16 }}
              >
                {showFilters ? "Hide filters" : "Show filters"}
              </button>

              {showFilters && (
                <div style={{ ...cardStyle, marginBottom: 16 }}>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>
                        Top
                      </div>
                      <select
                        value={top}
                        onChange={(e) => setTop(e.target.value)}
                        style={{ ...buttonStyle, borderRadius: 16, width: "100%" }}
                      >
                        {topOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>
                        Bottom
                      </div>
                      <select
                        value={pants}
                        onChange={(e) => setPants(e.target.value)}
                        style={{ ...buttonStyle, borderRadius: 16, width: "100%" }}
                      >
                        {pantsOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>
                        Shoes
                      </div>
                      <select
                        value={shoes}
                        onChange={(e) => setShoes(e.target.value)}
                        style={{ ...buttonStyle, borderRadius: 16, width: "100%" }}
                      >
                        {shoesOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>
                        Occasion
                      </div>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        style={{ ...buttonStyle, borderRadius: 16, width: "100%" }}
                      >
                        {occasionOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>
                        Mood
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {moods.map((item) => {
                          const active = mood === item;
                          return (
                            <button
                              key={item}
                              onClick={() => setMood(item)}
                              style={{
                                ...buttonStyle,
                                background: active ? "white" : "#111111",
                                color: active ? "black" : "white",
                                borderColor: active ? "white" : "#3a3a3a",
                              }}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                      <input
                        type="checkbox"
                        checked={signatureOnly}
                        onChange={(e) => setSignatureOnly(e.target.checked)}
                      />
                      Signature fits only
                    </label>

                    <button
                      onClick={resetFilters}
                      style={{
                        ...buttonStyle,
                        width: "100%",
                        borderRadius: 16,
                        background: "#1a1a1a",
                      }}
                    >
                      Reset all filters
                    </button>
                  </div>
                </div>
              )}

              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888" }}>
                      Selected
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{selected.top}</div>
                    <div style={{ color: "#aaa", marginTop: 6 }}>
                      {selected.pants} · {selected.shoes}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {selected.signature && (
                      <span
                        style={{
                          background: "white",
                          color: "black",
                          borderRadius: 999,
                          padding: "6px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Signature
                      </span>
                    )}
                    <span
                      style={{
                        border: "1px solid #3a3a3a",
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontSize: 12,
                        color: "#ddd",
                      }}
                    >
                      {getOccasionGroup(selected.occasion)}
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 18 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: "#888",
                        marginBottom: 6,
                      }}
                    >
                      Top
                    </div>
                    <SwatchBox label={selected.top} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: "#888",
                        marginBottom: 6,
                      }}
                    >
                      Pants
                    </div>
                    <SwatchBox label={selected.pants} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: "#888",
                        marginBottom: 6,
                      }}
                    >
                      Shoes
                    </div>
                    <SwatchBox label={selected.shoes} />
                  </div>
                </div>

                <div style={{ ...cardStyle, marginTop: 16, background: "#090909" }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#888",
                      marginBottom: 12,
                    }}
                  >
                    Accessory options
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {selected.accessories.map((option, idx) => (
                      <div key={`${selected.id}-${idx}`} style={{ ...cardStyle, padding: 12, background: "#000" }}>
                        <div
                          style={{
                            fontSize: 10,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: "#666",
                            marginBottom: 8,
                          }}
                        >
                          Option {idx + 1}
                        </div>
                        <div style={{ fontSize: 14, color: "#eee", lineHeight: 1.5 }}>{option}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888" }}>
                    Matching outfits
                  </div>
                  <div style={{ fontSize: 12, color: "#777" }}>{filtered.length} found</div>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {filtered.map((o) => {
                    const active = selected.id === o.id;
                    const pantsSwatch = getSwatch(o.pants);
                    const shoesSwatch = getSwatch(o.shoes);

                    return (
                      <button
                        key={o.id}
                        onClick={() => setSelectedId(o.id)}
                        style={{
                          ...cardStyle,
                          textAlign: "left",
                          background: active ? "white" : "#111111",
                          color: active ? "black" : "white",
                          borderColor: active ? "white" : "#2a2a2a",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 600 }}>{o.top}</div>
                            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                              <span
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 999,
                                  fontSize: 12,
                                  background: active ? "#e5e5e5" : pantsSwatch.bg,
                                  color: active ? "#111111" : pantsSwatch.color,
                                  border: `1px solid ${active ? "#d1d1d1" : pantsSwatch.border}`,
                                }}
                              >
                                {o.pants}
                              </span>
                              <span
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 999,
                                  fontSize: 12,
                                  background: active ? "#e5e5e5" : shoesSwatch.bg,
                                  color: active ? "#111111" : shoesSwatch.color,
                                  border: `1px solid ${active ? "#d1d1d1" : shoesSwatch.border}`,
                                }}
                              >
                                {o.shoes}
                              </span>
                            </div>
                          </div>
                          {o.signature && (
                            <span
                              style={{
                                background: active ? "black" : "#222",
                                color: "white",
                                borderRadius: 999,
                                padding: "6px 10px",
                                fontSize: 12,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Signature
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: 10, fontSize: 13, color: active ? "#555" : "#777" }}>
                          {getOccasionGroup(o.occasion)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              <SectionCard title="Tops" items={inventory.tops} />
              <SectionCard title="Pants" items={inventory.pants} />
              <SectionCard title="Shoes" items={inventory.shoes} />
              <SectionCard title="Rings" items={inventory.rings} />
              <SectionCard title="Necklaces" items={inventory.necklaces} />
              <SectionCard title="Bracelets" items={inventory.bracelets} />
              <SectionCard title="Earrings" items={inventory.earrings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}