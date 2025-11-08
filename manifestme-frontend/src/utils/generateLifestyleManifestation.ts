import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface UserProfile {
  name: string;
  location?: string;
  hobbies?: string[];
  adventure_type?: string;
  social_vibe?: string;
  goal_statement?: string;
  visual_feel?: string;
}

interface ManifestationRequest {
  category?: string;
  user_profile: UserProfile;
  style_preferences?: {
    tone?: string;
    voice_gender?: string;
    music_mood?: string;
    video_length_seconds?: number;
  };
}

export async function generateLifestyleManifestation({
  user_profile,
  style_preferences
}: ManifestationRequest): Promise<string> {
  
  const affirmations = [
    "I regularly enjoy experiences that bring me joy and adventure.",
    "I maintain a fulfilling social life and supportive friendships.",
    "I make time for hobbies, creativity, and play.",
    "I live in a space and location that feel aligned with me.",
    "I attend cultural, social, and enriching events regularly.",
    "I contribute meaningfully to my community.",
    "I create a balanced life with time for fun, exploration, and growth.",
    "I embrace adventure and spontaneity in ways that excite me.",
    "I make space for relaxation and enjoyment in my life.",
    "I seek experiences that inspire and rejuvenate me.",
    "I embrace leisure as an important part of my well-being.",
    "I explore new cultures, ideas, and activities with enthusiasm.",
    "I create memories that enrich my life and those around me.",
    "I allow myself to rest and recharge without guilt.",
    "I celebrate life’s joys and small pleasures daily."
  ];

  const prompt = `
Create a personalized manifestation narration for a user named ${user_profile.name}.
Category: Lifestyle & Leisure.

Scene begins with ${user_profile.visual_feel || "a peaceful, radiant morning"}.
Narration tone: ${style_preferences?.tone || "uplifting and cinematic"}.
Use second-person voice (“you”) with sensory, positive visualization.

Context:
- Location: ${user_profile.location || "a serene space that reflects your spirit"}
- Hobbies: ${(user_profile.hobbies || []).join(", ")}
- Adventure type: ${user_profile.adventure_type || "exploring life with curiosity"}
- Social vibe: ${user_profile.social_vibe || "supportive and vibrant"}
- Goal: ${user_profile.goal_statement || "to live joyfully and freely"}

Weave in at least 5 affirmations naturally throughout:
${affirmations.slice(0, 5).map(a => `• ${a}`).join("\n")}

End with gratitude and fulfillment.
Make it about ${style_preferences?.video_length_seconds || 90} seconds long.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a manifestation video script creator for a wellness app." },
      { role: "user", content: prompt }
    ],
    temperature: 0.85
  });

  return completion.choices[0].message?.content || "No script generated.";
}
