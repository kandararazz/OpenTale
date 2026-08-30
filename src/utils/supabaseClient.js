/**
 * Lightweight Client & Persistence Engine for Supabase REST API & LocalStorage Fallback.
 * Allows storing, retrieving, and publishing stories, custom shelves, color-coded tags, and community items.
 */

const SUPABASE_URL = typeof window !== 'undefined' 
  ? (window.ENV_SUPABASE_URL || (import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 'https://demo-opentale.supabase.co') 
  : '';
const SUPABASE_ANON_KEY = typeof window !== 'undefined' 
  ? (window.ENV_SUPABASE_ANON_KEY || (import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 'demo-anon-key') 
  : '';

export const supabaseClient = {
  /**
   * Save a story to Supabase backend or local storage fallback
   */
  async saveStory(story) {
    try {
      if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('demo-opentale')) {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/stories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(story)
        });
        if (response.ok) return await response.json();
      }
    } catch (e) {
      console.warn('Supabase sync fallback to localStorage:', e);
    }

    // LocalStorage Fallback
    const existing = JSON.parse(localStorage.getItem('opentale_user_books') || '[]');
    const updated = [story, ...existing.filter(b => b.id !== story.id)];
    localStorage.setItem('opentale_user_books', JSON.stringify(updated));
    return story;
  },

  /**
   * Publish story to Community Library
   */
  async publishToCommunity(communityItem) {
    try {
      if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('demo-opentale')) {
        await fetch(`${SUPABASE_URL}/rest/v1/community_stories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(communityItem)
        });
      }
    } catch (e) {
      console.warn('Supabase community publish fallback:', e);
    }

    // LocalStorage Fallback
    const community = JSON.parse(localStorage.getItem('opentale_community_stories') || '[]');
    const updated = [communityItem, ...community.filter(c => c.id !== communityItem.id)];
    localStorage.setItem('opentale_community_stories', JSON.stringify(updated));
    return communityItem;
  },

  /**
   * Fetch all community stories
   */
  async getCommunityStories() {
    try {
      if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('demo-opentale')) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/community_stories?select=*&order=publishedAt.desc`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) return data;
        }
      }
    } catch (e) {
      console.warn('Supabase get community fallback:', e);
    }

    return JSON.parse(localStorage.getItem('opentale_community_stories') || '[]');
  }
};
