import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "./supabase";

type WardrobeItem = {
  id: string;
  category: string;
  name: string;
  color: string | null;
  image_path: string | null;
  active: boolean;
};

type AccessoryOptionItemRow = {
  id: string;
  sort_order: number;
  item: WardrobeItem | WardrobeItem[] | null;
};

type AccessoryOptionRow = {
  id: string;
  option_number: number;
  original_label: string | null;
  items: AccessoryOptionItemRow[];
};

type AccessoryOption = {
  id: string;
  optionNumber: number;
  originalLabel: string | null;
  items: WardrobeItem[];
};

type DbOutfit = {
  id: string;
  signature: boolean;
  occasion: string;
  mood: string[];
  top: WardrobeItem | null;
  pants: WardrobeItem | null;
  shoes: WardrobeItem | null;
  accessoryOptions: AccessoryOptionRow[];
};

type Outfit = {
  id: string;
  top: string;
  pants: string;
  shoes: string;
  topImageUrl: string | null;
  pantsImageUrl: string | null;
  shoesImageUrl: string | null;
  signature: boolean;
  occasion: string;
  mood: string[];
  accessoryOptions: AccessoryOption[];
};

// const baseMoods = [
//   "All",
//   "clean",
//   "day",
//   "easy",
//   "casual",
//   "night",
//   "edge",
//   "date",
//   "smart",
//   "stylish",
// ];

const wardrobeSections = [
  { key: "tops", title: "Tops" },
  { key: "pants", title: "Pants" },
  { key: "shoes", title: "Shoes" },
  { key: "rings", title: "Rings" },
  { key: "necklaces", title: "Necklaces" },
  { key: "bracelets", title: "Bracelets" },
  { key: "earrings", title: "Earrings" },
];

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function getImageUrl(imagePath?: string | null) {
  if (!imagePath) return null;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/^\/+/, "");

  const { data } = supabase.storage
    .from("wardrobe")
    .getPublicUrl(cleanPath);

  return data.publicUrl;
}

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
  if (value.includes("light blue")) return { bg: "#9ec5e8", color: "#111111", border: "#9ec5e8" };
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
        whiteSpace: "pre-line",
      }}
    >
      {label}
    </div>
  );
}

function ItemImageCard({
  label,
  imageUrl,
}: {
  label: string;
  imageUrl: string | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageUrl || imageFailed) {
    return <SwatchBox label={imageFailed ? `${label}\nImage failed` : label} />;
  }

  return (
    <div
      style={{
        border: "1px solid #2a2a2a",
        borderRadius: 14,
        overflow: "hidden",
        background: "#090909",
        minHeight: 132,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 108,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
          boxSizing: "border-box",
        }}
      >
        <img
          src={imageUrl}
          alt={label}
          onError={() => setImageFailed(true)}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          padding: "9px 10px",
          fontSize: 13,
          fontWeight: 700,
          textAlign: "center",
          color: "#eee",
          lineHeight: 1.25,
        }}
      >
        {label}
      </div>
    </div>
  );
}
function SmallItemImageCard({
  label,
  imageUrl,
}: {
  label: string;
  imageUrl: string | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageUrl || imageFailed) {
    return (
      <div
        style={{
          border: "1px solid #2a2a2a",
          borderRadius: 10,
          background: "#111",
          minHeight: 76,
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#eee",
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #2a2a2a",
        borderRadius: 10,
        overflow: "hidden",
        background: "#090909",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 54,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          boxSizing: "border-box",
        }}
      >
        <img
          src={imageUrl}
          alt={label}
          onError={() => setImageFailed(true)}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          padding: "6px 6px",
          fontSize: 10,
          fontWeight: 700,
          textAlign: "center",
          color: "#eee",
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
    </div>
  );
}


function TinyItemImage({
  label,
  imageUrl,
}: {
  label: string;
  imageUrl: string | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const swatch = getSwatch(label);

  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${swatch.border}`,
        background: swatch.bg,
        color: swatch.color,
        flexShrink: 0,
      }}
      title={label}
    >
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt={label}
          onError={() => setImageFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {label.slice(0, 1).toUpperCase()}
        </div>
      )}
    </div>
  );
}

function OutfitImageStrip({ outfit }: { outfit: Outfit }) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
      <TinyItemImage label={outfit.top} imageUrl={outfit.topImageUrl} />
      <TinyItemImage label={outfit.pants} imageUrl={outfit.pantsImageUrl} />
      <TinyItemImage label={outfit.shoes} imageUrl={outfit.shoesImageUrl} />
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: "#111111",
  border: "1px solid #2a2a2a",
  borderRadius: 20,
  padding: 16,
};

const buttonStyle: CSSProperties = {
  borderRadius: 999,
  border: "1px solid #3a3a3a",
  background: "#111111",
  color: "white",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: 14,
};

function uniqueValues(items: Outfit[], key: keyof Outfit): string[] {
  return ["All", ...new Set(items.map((item) => String(item[key])).filter(Boolean))];
}

function SectionCard({
  title,
  items,
  onItemClick,
}: {
  title: string;
  items: WardrobeItem[];
  onItemClick: (item: WardrobeItem) => void;
}) {
  return (
    <div style={{ ...cardStyle, background: "#090909" }}>
      <div
        style={{
          fontSize: 16,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#aaa",
          marginBottom: 14,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {title}
      </div>

      {items.length === 0 ? (
        <div style={{ color: "#777", fontSize: 14 }}>No items yet.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                color: "inherit",
                textAlign: "inherit",
              }}
            >
              <ItemImageCard
                label={item.name}
                imageUrl={getImageUrl(item.image_path)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [dbOutfits, setDbOutfits] = useState<DbOutfit[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [top, setTop] = useState("All");
  const [pants, setPants] = useState("All");
  const [shoes, setShoes] = useState("All");
  const [occasion, setOccasion] = useState("All");
  const [mood, setMood] = useState("All");
  const [signatureOnly, setSignatureOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [screen, setScreen] = useState<"outfits" | "wardrobe">("outfits");
  const matchingOutfitsRef = useRef<HTMLDivElement | null>(null);  
  const selectedOutfitRef = useRef<HTMLDivElement | null>(null);  

  const [necklace, setNecklace] = useState("All");
  const [bracelet, setBracelet] = useState("All");
  const [ring, setRing] = useState("All");
  const [earring, setEarring] = useState("All");

  const [showBackToTop, setShowBackToTop] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (top !== "All") count += 1;
    if (pants !== "All") count += 1;
    if (shoes !== "All") count += 1;
    if (occasion !== "All") count += 1;
    // if (mood !== "All") count += 1;
    if (signatureOnly) count += 1;
    if (necklace !== "All") count += 1;
    if (bracelet !== "All") count += 1;
    if (ring !== "All") count += 1;
    if (earring !== "All") count += 1;
    
    return count;
    }, [top, pants, shoes, occasion, mood, necklace, bracelet, ring, earring, signatureOnly]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);    

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setLoadError(null);

        const [outfitsResult, wardrobeResult] = await Promise.all([
          supabase
            .from("outfits")
            .select(`
              id,
              signature,
              occasion,
              mood,
              created_at,
              top:top_id(id, category, name, color, image_path, active),
              pants:pants_id(id, category, name, color, image_path, active),
              shoes:shoes_id(id, category, name, color, image_path, active),
              accessoryOptions:outfit_accessory_options(
              id,
              option_number,
              original_label,
              items:outfit_accessory_option_items(
                id,
                sort_order,
                item:wardrobe_item_id(id, category, name, color, image_path, active)
              )
            )
            `)
            .order("created_at", { ascending: true }),

          supabase
            .from("wardrobe_items")
            .select("id, category, name, color, image_path, active")
            .eq("active", true)
            .order("category", { ascending: true })
            .order("name", { ascending: true }),
        ]);

        if (outfitsResult.error) throw outfitsResult.error;
        if (wardrobeResult.error) throw wardrobeResult.error;

        const normalizedOutfits: DbOutfit[] = (outfitsResult.data ?? []).map((row: any) => ({
          id: row.id,
          signature: Boolean(row.signature),
          occasion: row.occasion ?? "",
          mood: Array.isArray(row.mood) ? row.mood : [],
          top: firstRelation<WardrobeItem>(row.top),
          pants: firstRelation<WardrobeItem>(row.pants),
          shoes: firstRelation<WardrobeItem>(row.shoes),
          accessoryOptions: Array.isArray(row.accessoryOptions) ? row.accessoryOptions : [],
        }));

        setDbOutfits(normalizedOutfits);
        setWardrobeItems((wardrobeResult.data ?? []) as WardrobeItem[]);
      } catch (error: any) {
        console.error("Error loading Supabase data:", error);
        setLoadError(error?.message ?? "Could not load outfit data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };  

  const outfits: Outfit[] = useMemo(() => {
    return dbOutfits.map((o) => ({
      id: o.id,
      top: o.top?.name ?? "",
      pants: o.pants?.name ?? "",
      shoes: o.shoes?.name ?? "",
      topImageUrl: getImageUrl(o.top?.image_path),
      pantsImageUrl: getImageUrl(o.pants?.image_path),
      shoesImageUrl: getImageUrl(o.shoes?.image_path),
      signature: o.signature,
      occasion: o.occasion,
      mood: o.mood ?? [],
      accessoryOptions: (o.accessoryOptions ?? [])
        .map((option) => ({
          id: option.id,
          optionNumber: option.option_number,
          originalLabel: option.original_label,
          items: (option.items ?? [])
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((optionItem) => firstRelation<WardrobeItem>(optionItem.item))
            .filter((item): item is WardrobeItem => Boolean(item)),
        }))
        .sort((a, b) => a.optionNumber - b.optionNumber),
    }));
  }, [dbOutfits]);

  useEffect(() => {
    if (!outfits.length) return;
    if (selectedId) return;

    const randomOutfit = outfits[Math.floor(Math.random() * outfits.length)];
    setSelectedId(randomOutfit.id);
  }, [outfits, selectedId]);  

  const wardrobe = useMemo(() => {
    const grouped: Record<string, WardrobeItem[]> = {};

    for (const section of wardrobeSections) {
      grouped[section.key] = [];
    }

    for (const item of wardrobeItems) {
      if (!item.active) continue;

      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }

      grouped[item.category].push(item);
    }

    return grouped;
  }, [wardrobeItems]);

  // const moodOptions = useMemo(() => {
  //   const values = new Set<string>();

  //   for (const item of baseMoods) {
  //     if (item !== "All") values.add(item);
  //   }

  //   for (const outfit of outfits) {
  //     for (const item of outfit.mood) {
  //       if (item) values.add(item);
  //     }
  //   }

  //   return ["All", ...Array.from(values)];
  // }, [outfits]);

  const jumpToFilteredOutfits = () => {
    matchingOutfitsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };  

  const filterByWardrobeItem = (item: WardrobeItem) => {
    if (item.category === "tops") {
      setTop(item.name);
    } else if (item.category === "pants") {
      setPants(item.name);
    } else if (item.category === "shoes") {
      setShoes(item.name);
    } else if (item.category === "necklaces") {
      setNecklace(item.name);
    } else if (item.category === "bracelets") {
      setBracelet(item.name);
    } else if (item.category === "rings") {
      setRing(item.name);
    } else if (item.category === "earrings") {
      setEarring(item.name);
    }

    setScreen("outfits");
    setShowFilters(false);
    setSelectedId(null);

    window.setTimeout(() => {
      matchingOutfitsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };  

  const resetFilters = () => {
    setTop("All");
    setPants("All");
    setShoes("All");
    setOccasion("All");
    setMood("All");
    setNecklace("All");
    setBracelet("All");
    setRing("All");
    setEarring("All");
    setSignatureOnly(false);
  };

  const topOptions = uniqueValues(outfits, "top");
  const pantsOptions = uniqueValues(outfits, "pants");
  const shoesOptions = uniqueValues(outfits, "shoes");
  const occasionOptions = uniqueOccasionGroups(outfits);
  const getAccessoryOptionsByCategory = (category: string) => {
    const values = new Set<string>();

    for (const outfit of outfits) {
      for (const option of outfit.accessoryOptions) {
        for (const item of option.items) {
          if (item.category === category && item.name) {
            values.add(item.name);
          }
        }
      }
    }

    return ["All", ...Array.from(values).sort()];
  };

  const necklaceOptions = useMemo(
    () => getAccessoryOptionsByCategory("necklaces"),
    [outfits]
  );

  const braceletOptions = useMemo(
    () => getAccessoryOptionsByCategory("bracelets"),
    [outfits]
  );

  const ringOptions = useMemo(
    () => getAccessoryOptionsByCategory("rings"),
    [outfits]
  );

  const earringOptions = useMemo(
    () => getAccessoryOptionsByCategory("earrings"),
    [outfits]
  ); 

  const filtered = useMemo(() => {
    return outfits.filter((o) => {
      const moodMatch = mood === "All" || o.mood.includes(mood);

  const selectedAccessoryFilters = [
    { category: "necklaces", value: necklace },
    { category: "bracelets", value: bracelet },
    { category: "rings", value: ring },
    { category: "earrings", value: earring },
  ].filter((filter) => filter.value !== "All");

  const accessoryMatch =
    selectedAccessoryFilters.length === 0 ||
    o.accessoryOptions.some((option) =>
      selectedAccessoryFilters.every((filter) =>
        option.items.some(
          (item) =>
            item.category === filter.category &&
            item.name === filter.value
        )
      )
    );

      return (
        (top === "All" || o.top === top) &&
        (pants === "All" || o.pants === pants) &&
        (shoes === "All" || o.shoes === shoes) &&
        (occasion === "All" || getOccasionGroup(o.occasion) === occasion) &&
        (!signatureOnly || o.signature) &&
        moodMatch &&
        accessoryMatch
      );
    });
    }, [
    outfits,
    top,
    pants,
    shoes,
    occasion,
    mood,
    necklace,
    bracelet,
    ring,
    earring,
    signatureOnly,
  ]);

  const selected = selectedId
    ? filtered.find((o) => o.id === selectedId) || filtered[0]
    : null;

  const selectMatchingOutfit = (id: string) => {
    setSelectedId(id);
    setShowFilters(false);

    window.setTimeout(() => {
      selectedOutfitRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };    

  const randomPick = () => {
    if (!filtered.length) return;

    if (filtered.length === 1) {
      setSelectedId(filtered[0].id);
      return;
    }

    const availableOutfits = filtered.filter((o) => o.id !== selectedId);
    const next = availableOutfits[Math.floor(Math.random() * availableOutfits.length)];

    setSelectedId(next.id);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          color: "white",
          fontFamily: "Inter, Arial, sans-serif",
          padding: 24,
        }}
      >
        Loading outfits...
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          color: "white",
          fontFamily: "Inter, Arial, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ ...cardStyle, maxWidth: 480 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Could not load outfits</div>
          <div style={{ color: "#aaa", lineHeight: 1.5 }}>{loadError}</div>
        </div>
      </div>
    );
  }

  if (!outfits.length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          color: "white",
          fontFamily: "Inter, Arial, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ ...cardStyle, maxWidth: 480 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No outfits found</div>
          <div style={{ color: "#aaa", lineHeight: 1.5 }}>
            Add rows to your Supabase <strong>outfits</strong> table first.
          </div>
        </div>
      </div>
    );
  }

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
          <div style={{ display: "grid", gap: 6, justifyItems: "center" }}>
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

            <button
              onClick={resetFilters}
              style={{
                height: 14,
                fontSize: 11,
                color: "#aaa",
                textAlign: "center",
                whiteSpace: "nowrap",
                visibility: activeFilterCount > 0 ? "visible" : "hidden",
                background: "transparent",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: activeFilterCount > 0 ? "pointer" : "default",
                textDecoration: "underline",
              }}
            >
              Reset {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"}
            </button>
          </div>
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
              onClick={() => setScreen("wardrobe")}
              style={{
                ...buttonStyle,
                borderRadius: 16,
                background: screen === "wardrobe" ? "white" : "#111111",
                color: screen === "wardrobe" ? "black" : "white",
                borderColor: screen === "wardrobe" ? "white" : "#3a3a3a",
                fontWeight: 600,
              }}
            >
              Wardrobe
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
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
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
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
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
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
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
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
                        Necklace
                      </div>

                      <select
                        value={necklace}
                        onChange={(e) => setNecklace(e.target.value)}
                        style={{ ...buttonStyle, borderRadius: 16, width: "100%" }}
                      >
                        {necklaceOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
                        Bracelet
                      </div>

                      <select
                        value={bracelet}
                        onChange={(e) => setBracelet(e.target.value)}
                        style={{ ...buttonStyle, borderRadius: 16, width: "100%" }}
                      >
                        {braceletOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
                        Ring
                      </div>

                      <select
                        value={ring}
                        onChange={(e) => setRing(e.target.value)}
                        style={{ ...buttonStyle, borderRadius: 16, width: "100%" }}
                      >
                        {ringOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
                        Earring
                      </div>

                      <select
                        value={earring}
                        onChange={(e) => setEarring(e.target.value)}
                        style={{ ...buttonStyle, borderRadius: 16, width: "100%" }}
                      >
                        {earringOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>                 

                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
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

                    {/* <div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
                        Mood
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {moodOptions.map((item) => {
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
                    </div> */}

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

                    <button
                      onClick={jumpToFilteredOutfits}
                      style={{
                        ...buttonStyle,
                        width: "100%",
                        borderRadius: 16,
                        background: "white",
                        color: "black",
                        border: "none",
                        fontWeight: 700,
                      }}
                    >
                      Jump to filtered outfits
                    </button>
                  </div>
                </div>
              )}

              {!selected ? (
                <div style={cardStyle}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>No matching outfits</div>
                  <div style={{ color: "#aaa", marginTop: 8 }}>Try changing or resetting your filters.</div>
                </div>
              ) : (
                <>
                  <div ref={selectedOutfitRef} style={{ ...cardStyle, scrollMarginTop: 96 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      {/* <div>
                        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888" }}>
                          Selected
                        </div>

                        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{selected.top}</div>

                        <div style={{ color: "#aaa", marginTop: 6 }}>
                          {selected.pants} · {selected.shoes}
                        </div>
                      </div> */}

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", width: "100%"}}>
                        {selected.signature && (
                          <span
                            style={{
                              border: "1px solid #3a3a3a",
                              borderRadius: 999,
                              padding: "6px 10px",
                              fontSize: 12,
                              color: "#ddd",
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
                            fontSize: 14,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: "#888",
                            marginBottom: 6,
                          }}
                        >
                          Top
                        </div>
                        <ItemImageCard label={selected.top} imageUrl={selected.topImageUrl} />
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: "#888",
                            marginBottom: 6,
                          }}
                        >
                          Pants
                        </div>
                        <ItemImageCard label={selected.pants} imageUrl={selected.pantsImageUrl} />
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: "#888",
                            marginBottom: 6,
                          }}
                        >
                          Shoes
                        </div>
                        <ItemImageCard label={selected.shoes} imageUrl={selected.shoesImageUrl} />
                      </div>
                    </div>

                    <div style={{ ...cardStyle, marginTop: 16, background: "#090909" }}>
                      <div
                        style={{
                          fontSize: 14,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: "#888",
                          marginBottom: 12,
                        }}
                      >
                        Accessory options
                      </div>

                      {selected.accessoryOptions.length === 0 ? (
                        <div style={{ color: "#777", fontSize: 14 }}>No accessories saved for this outfit.</div>
                      ) : (
                        <div style={{ display: "grid", gap: 10 }}>
                          {selected.accessoryOptions.map((option) => (
                            <div key={option.id} style={{ ...cardStyle, padding: 12, background: "#000" }}>
                              <div
                                style={{
                                  fontSize: 10,
                                  letterSpacing: 2,
                                  textTransform: "uppercase",
                                  color: "#666",
                                  marginBottom: 8,
                                }}
                              >
                                Option {option.optionNumber}
                              </div>

                              {/* {option.originalLabel && (
                                <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.4, marginBottom: 10 }}>
                                  {option.originalLabel}
                                </div>
                              )} */}

                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                                {option.items.map((item) => (
                                  <SmallItemImageCard
                                    key={item.id}
                                    label={item.name}
                                    imageUrl={getImageUrl(item.image_path)}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                    <div ref={matchingOutfitsRef} style={{ marginTop: 16, scrollMarginTop: 96 }}>
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
                            onClick={() => selectMatchingOutfit(o.id)}
                            style={{
                              ...cardStyle,
                              textAlign: "left",
                              background: active ? "white" : "#111111",
                              color: active ? "black" : "white",
                              borderColor: active ? "white" : "#2a2a2a",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 10,
                                alignItems: "flex-start",
                              }}
                            >
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

                                <OutfitImageStrip outfit={o} />
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
              )}
            </>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {wardrobeSections.map((section) => (
                <SectionCard
                  key={section.key}
                  title={section.title}
                  items={wardrobe[section.key] ?? []}
                  onItemClick={filterByWardrobeItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
 
      {showBackToTop && (
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 50,
          width: 48,
          height: 48,
          borderRadius: 999,
          border: "1px solid #3a3a3a",
          background: "white",
          color: "black",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5" />
          <path d="M6 11l6-6 6 6" />
        </svg>
      </button>
    )}
      
    </div>
  );
}