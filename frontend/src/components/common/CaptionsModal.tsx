import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Edit2, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface CaptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawResponse: string;
}

export interface ParsedContent {
  imageUrl?: string;
  caption?: string;
  shortCaption?: string;
  cta?: string;
  hashtags?: string[];
  rawText?: string;
}

export function parseWebhookResponse(rawResponse: string): ParsedContent {
  if (!rawResponse) return {};

  let imageUrl: string | undefined;
  let textToParse = rawResponse;

  // 1. Try to extract Supabase or image URL from raw text
  const urlRegex = /(https?:\/\/[^\s{}|[\]"'\\]+)/gi;
  let match;
  while ((match = urlRegex.exec(rawResponse)) !== null) {
    const url = match[0];
    if (url.includes('supabase') || url.match(/\.(jpg|jpeg|png|webp|gif|svg)/i)) {
      imageUrl = url;
      textToParse = rawResponse.replace(url, '').trim();
      break;
    }
  }

  // 2. Clean leading/trailing quotes and escaped markdown code blocks from textToParse
  let cleanedText = textToParse.trim();
  
  if (cleanedText.startsWith('"')) {
    if (cleanedText.endsWith('"')) {
      try {
        cleanedText = JSON.parse(cleanedText);
      } catch {
        cleanedText = cleanedText.slice(1, -1);
      }
    } else {
      try {
        cleanedText = JSON.parse(cleanedText + '"');
      } catch {
        cleanedText = cleanedText.slice(1);
      }
    }
  } else if (cleanedText.endsWith('"')) {
    cleanedText = cleanedText.slice(0, -1);
  }

  cleanedText = cleanedText.trim();
  if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '');
  }
  cleanedText = cleanedText.trim();

  // 3. Try parsing as JSON
  let parsedJson: any = null;
  try {
    parsedJson = JSON.parse(cleanedText);
  } catch {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedJson = JSON.parse(jsonMatch[0]);
      } catch {}
    }
  }

  // 4. Extract content recursively from JSON
  if (parsedJson) {
    const extracted = extractContent(parsedJson);
    return {
      imageUrl: imageUrl || extracted.imageUrl,
      caption: extracted.caption,
      shortCaption: extracted.shortCaption,
      cta: extracted.cta,
      hashtags: extracted.hashtags,
      rawText: cleanedText,
    };
  }

  return {
    imageUrl,
    caption: cleanedText,
    rawText: cleanedText,
  };
}

function parseJsonSafely(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    const jsonMatch = str.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {}
    }
  }
  return null;
}

function extractContent(json: any): any {
  if (!json) return {};

  if (Array.isArray(json)) {
    for (const item of json) {
      const res = extractContent(item);
      if (res.caption || res.text || res.cta || res.imageUrl) return res;
    }
    return {};
  }

  // OpenAI / Groq choices
  if (json.choices?.[0]?.message?.content) {
    const content = json.choices[0].message.content;
    const nested = parseJsonSafely(content);
    if (nested) return extractContent(nested);
    return { caption: content };
  }

  // Gemini / parts
  if (json.parts?.[0]?.text) {
    const content = json.parts[0].text;
    const nested = parseJsonSafely(content);
    if (nested) return extractContent(nested);
    return { caption: content };
  }

  if (json.candidates?.[0]?.content?.parts?.[0]?.text) {
    const content = json.candidates[0].content.parts[0].text;
    const nested = parseJsonSafely(content);
    if (nested) return extractContent(nested);
    return { caption: content };
  }

  // n8n nested items
  if (json.items && Array.isArray(json.items)) {
    for (const item of json.items) {
      const res = extractContent(item);
      if (res.caption || res.text || res.cta || res.imageUrl) return res;
    }
  }

  if (json.json && typeof json.json === 'object') {
    return extractContent(json.json);
  }

  if (json.body && typeof json.body === 'object') {
    return extractContent(json.body);
  }
  if (json.data && typeof json.data === 'object') {
    return extractContent(json.data);
  }

  let imageUrl = json.imageUrl || json.image_url || json.image;
  let caption = json.caption || json.full_caption || json.fullCaption || json.text || json.content;
  let shortCaption = json.short_caption || json.shortCaption;
  let cta = json.cta || json.call_to_action || json.callToAction;
  let hashtags = json.hashtags;

  if (caption && typeof caption === 'object') {
    const nested = extractContent(caption);
    return { imageUrl, ...nested };
  }

  let formattedHashtags: string[] = [];
  if (hashtags) {
    if (Array.isArray(hashtags)) {
      formattedHashtags = hashtags;
    } else if (typeof hashtags === 'string') {
      formattedHashtags = hashtags.split(/[\s,]+/).filter(h => h.trim().length > 0).map(h => h.startsWith('#') ? h : `#${h}`);
    }
  }

  return {
    imageUrl: typeof imageUrl === 'string' ? imageUrl : undefined,
    caption: typeof caption === 'string' ? caption : undefined,
    shortCaption: typeof shortCaption === 'string' ? shortCaption : undefined,
    cta: typeof cta === 'string' ? cta : undefined,
    hashtags: formattedHashtags.length > 0 ? formattedHashtags : undefined,
  };
}

export const CaptionsModal: React.FC<CaptionsModalProps> = ({ isOpen, onClose, rawResponse }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState('');

  const parsed = parseWebhookResponse(rawResponse);
  const imgUrl = parsed.imageUrl;
  const hasStructuredData = !!(parsed.caption || parsed.cta || (parsed.hashtags && parsed.hashtags.length > 0));

  const getCombinedText = () => {
    let text = '';
    if (parsed.caption) text += parsed.caption + '\n\n';
    if (parsed.cta) text += parsed.cta + '\n\n';
    if (parsed.hashtags && parsed.hashtags.length > 0) text += parsed.hashtags.join(' ') + '\n';
    text = text.trim();
    if (!text) text = parsed.caption || parsed.rawText || rawResponse;
    return text;
  };

  useEffect(() => {
    if (rawResponse) {
      setCustomText(getCombinedText());
    }
  }, [rawResponse]);

  const handleCopy = async () => {
    const copyText = customText || getCombinedText();
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handlePostToInstagram = async () => {
    const finalCaption = customText || getCombinedText();
    const promise = fetch('https://api.agents.snsihub.ai/webhook-test/1687ddd6-52f6-4a8f-9c8f-4b296761ceeb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: imgUrl || '',
        caption: finalCaption,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      await res.text();
    });

    toast.promise(promise, {
      loading: 'Posting to Instagram...',
      success: 'Successfully posted to Instagram!',
      error: (err) => `Failed to post: ${err.message || err}`,
    });
  };

  const toggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      toast.success('Changes saved!');
    } else {
      setIsEditing(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#2D1B69] bg-opacity-80 flex items-center justify-center p-6 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 border border-[#E9D5FF] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F3F0FF]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#2D1B69]">Generated Social Captions</h3>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#2D1B69] p-1.5 hover:bg-[#F8F7FF] rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Image Preview Box */}
        <div className="bg-[#F8F7FF] rounded-2xl p-5 border border-[#E9D5FF] max-h-[60vh] overflow-y-auto space-y-4">
          
          {/* Resolved Image Preview */}
          {imgUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#E9D5FF] bg-white flex items-center justify-center max-h-[220px] shadow-sm">
              <img src={imgUrl} alt="Generated Preview" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Formatted Text Outputs / Textarea */}
          {isEditing ? (
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full min-h-[180px] p-4 border border-[#E9D5FF] rounded-2xl text-xs text-[#2D1B69] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] leading-relaxed font-medium shadow-inner"
            />
          ) : (
            <div className="space-y-4 text-left text-xs text-[#2D1B69] leading-relaxed font-medium whitespace-pre-wrap">
              {customText ? (
                <p>{customText}</p>
              ) : (
                <>
                  {parsed.caption && <p>{parsed.caption}</p>}
                  {parsed.cta && <p>{parsed.cta}</p>}
                  {parsed.hashtags && parsed.hashtags.length > 0 && (
                    <p className="text-[#8B5CF6] font-semibold">{parsed.hashtags.join(' ')}</p>
                  )}
                  {!hasStructuredData && (
                    <p>{parsed.caption || parsed.rawText || rawResponse}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
          
          <button
            onClick={handleCopy}
            disabled={isEditing}
            className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-purple-500/10"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Caption</span>
              </>
            )}
          </button>

          <button
            onClick={toggleEdit}
            className="py-2.5 px-4 border border-[#E9D5FF] text-[#8B5CF6] hover:bg-[#F8F7FF] text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all"
          >
            {isEditing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </>
            )}
          </button>

          <button
            onClick={handlePostToInstagram}
            disabled={isEditing}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#C13584] to-[#E1306C] hover:from-[#B12A75] hover:to-[#D1255C] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-pink-500/10"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post to Instagram</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-[#E9D5FF] text-[#6B7280] hover:text-[#2D1B69] hover:bg-[#F8F7FF] text-xs font-bold rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
