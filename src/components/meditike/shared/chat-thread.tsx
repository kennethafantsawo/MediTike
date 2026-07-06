"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { relativeTimeFr } from "@/lib/meditike/helpers";

/** Un message du fil de discussion. */
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string; // ISO
}

export interface ChatUser {
  id: string;
  fullName: string;
  role: string;
}

interface ChatThreadProps {
  /** Identifiant de la réponse pharmaceutique qui initialise le fil. */
  responseId: string;
  /** Utilisateur courant (client ou pharmacien). */
  currentUser: ChatUser;
  /** Nom affiché de l'interlocuteur. */
  otherUserName: string;
}

/** Construit la clé localStorage associée à un fil. */
function storageKey(responseId: string): string {
  return `meditike_chat_${responseId}`;
}

/** Génère un identifiant unique court côté client. */
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Charge les messages initiaux depuis localStorage (sécurisé SSR). */
function loadInitialMessages(responseId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(responseId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * ChatThread — messagerie interne client ↔ pharmacien.
 *
 * Pour ce MVP, les messages sont stockés localement dans le navigateur
 * (clé `meditike_chat_[responseId]`). Chaque fil est lié à une réponse
 * pharmaceutique : le client et le pharmacien y ayant répondu peuvent
 * échanger librement après le premier contact.
 *
 * - Bulles alignées à gauche pour l'interlocuteur, à droite pour moi.
 * - Auto-scroll en bas à chaque nouveau message.
 * - Animation framer-motion à l'apparition de chaque bulle.
 */
export function ChatThread({
  responseId,
  currentUser,
  otherUserName,
}: ChatThreadProps) {
  // État initial chargé en une fois depuis localStorage (pas de setState dans un effet).
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadInitialMessages(responseId)
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Persistance à chaque changement ─────────────────────────
  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey(responseId),
        JSON.stringify(messages)
      );
    } catch {
      // Quota plein ou mode privé — on ignore
    }
  }, [messages, responseId]);

  // ─── Auto-scroll en bas à chaque nouveau message ────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  // ─── Envoi d'un message ──────────────────────────────────────
  const send = useCallback(() => {
    const content = draft.trim();
    if (!content) return;
    if (content.length > 1000) {
      toast.error("Message trop long (1000 caractères maximum)");
      return;
    }

    setSending(true);
    const msg: ChatMessage = {
      id: generateId(),
      senderId: currentUser.id,
      senderName: currentUser.fullName || "Utilisateur",
      content,
      createdAt: new Date().toISOString(),
    };

    // Simule une petite latence pour le confort visuel
    setTimeout(() => {
      setMessages((prev) => [...prev, msg]);
      setDraft("");
      setSending(false);
      // Focus revenu sur le champ
      requestAnimationFrame(() => inputRef.current?.focus());
    }, 150);
  }, [draft, currentUser.id, currentUser.fullName]);

  // ─── Raccourci Enter (sans Shift) pour envoyer ──────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[60vh] min-h-[320px] max-h-[70vh] bg-muted/30 rounded-2xl overflow-hidden border border-border">
      {/* En-tête du fil */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate">{otherUserName}</p>
          <p className="text-[10px] text-muted-foreground">
            Discussion privée · stockée sur cet appareil
          </p>
        </div>
      </div>

      {/* Liste des messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <MessageCircle className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-bold text-foreground">
              Démarrez la conversation
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Envoyez un premier message à {otherUserName}. Vos échanges
              restent enregistrés sur cet appareil.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      isMe
                        ? "brand-gradient text-white rounded-br-md"
                        : "bg-white border border-border text-foreground rounded-bl-md"
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-bold text-emerald-700 mb-0.5">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words leading-snug">
                      {msg.content}
                    </p>
                    <p
                      className={`text-[9px] mt-1 ${
                        isMe ? "text-white/70" : "text-muted-foreground"
                      } text-right`}
                    >
                      {relativeTimeFr(msg.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-border bg-white p-2.5 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message…"
          rows={1}
          maxLength={1000}
          className="flex-1 resize-none px-3 py-2 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all max-h-24"
        />
        <button
          type="button"
          onClick={send}
          disabled={sending || !draft.trim()}
          className="shrink-0 w-10 h-10 rounded-xl brand-gradient text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-[0.97] transition-transform"
          aria-label="Envoyer le message"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
