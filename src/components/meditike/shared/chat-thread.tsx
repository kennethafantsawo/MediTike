"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Loader2, MessageCircle, X, Zap, Circle,
} from "lucide-react";
import { toast } from "sonner";
import { relativeTimeFr } from "@/lib/meditike/helpers";

/** Clé localStorage du compteur de messages non lus pour un fil. */
function unreadKey(responseId: string): string {
  return `meditike_chat_unread_${responseId}`;
}

/**
 * Hook `useChatUnread` — suit le nombre de messages non lus d'un fil.
 *
 * - Lit la valeur initiale dans `localStorage[meditike_chat_unread_[responseId]]`
 * - Écoute les évènements `storage` : si un nouveau message arrive depuis
 *   l'interlocuteur (autre utilisateur) ET que le fil n'est pas ouvert,
 *   incrémente le compteur.
 * - Quand `isChatOpen` passe à true, remet le compteur à 0.
 *
 * @param responseId identifiant de la réponse pharmaceutique (fil)
 * @param currentUserId identifiant de l'utilisateur courant
 * @param isChatOpen true si le fil est actuellement affiché
 * @returns nombre de messages non lus
 */
export function useChatUnread(
  responseId: string,
  currentUserId: string,
  isChatOpen: boolean
): number {
  const [count, setCount] = useState<number>(() => {
    try {
      const raw = window.localStorage.getItem(unreadKey(responseId));
      return raw ? parseInt(raw, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Référence mutable pour éviter les fermetures obsolètes dans le handler.
  const isOpenRef = useRef(isChatOpen);
  useEffect(() => {
    isOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  // Quand le fil s'ouvre, on marque tout comme lu.
  useEffect(() => {
    if (!isChatOpen) return;
    try {
      window.localStorage.setItem(unreadKey(responseId), "0");
    } catch {
      // Ignore
    }
    // setCount dans un microtask pour éviter le warning
    const timer = setTimeout(() => setCount(0), 0);
    return () => clearTimeout(timer);
  }, [isChatOpen, responseId]);

  // Écoute les changements localStorage (messages reçus d'un autre onglet).
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === storageKey(responseId) && e.newValue) {
        try {
          const msgs = JSON.parse(e.newValue) as ChatMessage[];
          const last = msgs[msgs.length - 1];
          if (last && last.senderId !== currentUserId && !isOpenRef.current) {
            setCount((prev) => {
              const next = prev + 1;
              try {
                window.localStorage.setItem(unreadKey(responseId), String(next));
              } catch {
                // Ignore
              }
              return next;
            });
          }
        } catch {
          // Ignore
        }
      }
      if (e.key === unreadKey(responseId) && e.newValue) {
        setCount(parseInt(e.newValue, 10) || 0);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [responseId, currentUserId]);

  return count;
}

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
  /** Dernière fois que l'interlocuteur a été vu (ISO). Optionnel (MVP simulé). */
  otherUserLastSeenAt?: string;
  /** Appelé quand l'utilisateur ferme le fil (bouton "Fermer"). */
  onClose?: () => void;
  /** Index d'un message lu (permet au parent de réinitialiser les non-lus). */
  onRead?: () => void;
}

/** Messages rapides pré-définis pour gain de temps. */
const QUICK_MESSAGES: string[] = [
  "Bonjour, le médicament est disponible",
  "Bonjour, le médicament n'est pas disponible",
  "Pouvez-vous m'envoyer une photo de l'ordonnance ?",
  "Le prix est de XXXX FCFA",
];

/** Limite de caractères par message. */
const MAX_MESSAGE_LENGTH = 500;

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

/** Indique si l'interlocuteur est "en ligne" (vu dans les 2 dernières minutes). */
function isOnline(lastSeenAt?: string): boolean {
  if (!lastSeenAt) return false;
  const d = new Date(lastSeenAt).getTime();
  if (Number.isNaN(d)) return false;
  return Date.now() - d < 2 * 60 * 1000;
}

/** Construit un libellé lisible pour la dernière apparition. */
function lastSeenLabel(lastSeenAt?: string): string {
  if (!lastSeenAt) return "Hors-ligne";
  if (isOnline(lastSeenAt)) return "En ligne";
  return `Vu ${relativeTimeFr(lastSeenAt)}`;
}

/**
 * ChatThread — messagerie interne client ↔ pharmacien.
 *
 * Pour ce MVP, les messages sont stockés localement dans le navigateur
 * (clé `meditike_chat_[responseId]`). Chaque fil est lié à une réponse
 * pharmaceutique : le client et le pharmacien y ayant répondu peuvent
 * échanger librement après le premier contact.
 *
 * Fonctionnalités :
 * - En-tête avec nom + statut "En ligne" simulé + bouton Fermer
 * - Indicateur "Tapé en cours…" (simulé, délai aléatoire)
 * - Horodatage relatif ("il y a 2 min") sur chaque message
 * - Messages rapides pré-définis (boutons)
 * - Limite 500 caractères par message
 * - Auto-scroll en bas à chaque nouveau message
 */
export function ChatThread({
  responseId,
  currentUser,
  otherUserName,
  otherUserLastSeenAt,
  onClose,
  onRead,
}: ChatThreadProps) {
  // État initial chargé en une fois depuis localStorage (pas de setState dans un effet).
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadInitialMessages(responseId)
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Statut en ligne simulé : on rafraîchit toutes les 30s
  // (en MVP, on prend la prop ou un "vu récemment" aléatoire).
  const [online, setOnline] = useState<boolean>(() => isOnline(otherUserLastSeenAt));

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

  // ─── Auto-scroll en bas à chaque nouveau message ou frappe ────
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, isTyping]);

  // ─── Rafraîchit le statut en ligne toutes les 30s ────────────
  useEffect(() => {
    const check = () => setOnline(isOnline(otherUserLastSeenAt));
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [otherUserLastSeenAt]);

  // ─── Marque comme lu dès l'ouverture et à chaque nouveau message ─
  useEffect(() => {
    onRead?.();
  }, [onRead, messages.length]);

  // ─── Envoi d'un message ──────────────────────────────────────
  const send = useCallback(() => {
    const content = draft.trim();
    if (!content) return;
    if (content.length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message trop long (${MAX_MESSAGE_LENGTH} caractères maximum)`);
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

      // Simule l'interlocuteur en train de taper puis une réponse factice
      // (MVP — pas de serveur de messagerie temps réel).
      // Délai aléatoire entre 1.2s et 2.5s avant l'indicateur "tape…"
      const typingDelay = 1200 + Math.random() * 1300;
      setTimeout(() => setIsTyping(true), typingDelay);
      // L'indicateur reste 2 à 4s puis s'éteint (pas de réponse automatique).
      const typingDuration = 2000 + Math.random() * 2000;
      setTimeout(() => setIsTyping(false), typingDelay + typingDuration);
    }, 150);
  }, [draft, currentUser.id, currentUser.fullName]);

  // ─── Raccourci Enter (sans Shift) pour envoyer ──────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ─── Envoi d'un message rapide pré-défini ────────────────────
  const sendQuick = (text: string) => {
    setDraft(text);
    // Légère attente pour que l'UI se mette à jour puis envoi direct.
    requestAnimationFrame(() => {
      const msg: ChatMessage = {
        id: generateId(),
        senderId: currentUser.id,
        senderName: currentUser.fullName || "Utilisateur",
        content: text,
        createdAt: new Date().toISOString(),
      };
      setSending(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        setDraft("");
        setSending(false);
      }, 120);
    });
  };

  return (
    <div className="flex flex-col h-[60vh] min-h-[320px] max-h-[70vh] bg-muted/30 rounded-2xl overflow-hidden border border-border">
      {/* En-tête du fil : nom + statut en ligne + bouton Fermer */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-border">
        <div className="relative w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              online ? "bg-emerald-500" : "bg-muted-foreground/40"
            }`}
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate">{otherUserName}</p>
          <p className="text-[10px] flex items-center gap-1">
            <Circle
              className={`w-2 h-2 ${online ? "text-emerald-500 fill-emerald-500" : "text-muted-foreground/40 fill-muted-foreground/40"}`}
            />
            <span className={online ? "text-emerald-700 font-bold" : "text-muted-foreground"}>
              {lastSeenLabel(otherUserLastSeenAt)}
            </span>
            <span className="text-muted-foreground/60">· Stocké sur cet appareil</span>
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/70 rounded-lg transition-colors inline-flex items-center gap-1"
            aria-label="Fermer la discussion"
          >
            <X className="w-3.5 h-3.5" /> Fermer
          </button>
        )}
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

            {/* Indicateur "Tapé en cours…" */}
            {isTyping && (
              <motion.div
                key="typing-indicator"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-border text-foreground rounded-2xl rounded-bl-md px-3 py-2.5">
                  <p className="text-[10px] font-bold text-emerald-700 mb-1">
                    {otherUserName}
                  </p>
                  <div className="flex items-center gap-1">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                    <span className="ml-1.5 text-[10px] text-muted-foreground italic">
                      tape un message…
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Messages rapides pré-définis */}
      <div className="px-2.5 pt-2 pb-1 bg-white border-t border-border flex gap-1.5 overflow-x-auto">
        {QUICK_MESSAGES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendQuick(q)}
            disabled={sending}
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors disabled:opacity-50"
            title="Insérer ce message"
          >
            <Zap className="w-3 h-3" /> {q.length > 30 ? q.slice(0, 28) + "…" : q}
          </button>
        ))}
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-border bg-white p-2.5">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message…"
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          className="w-full resize-none px-3 py-2 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all max-h-24"
        />
        <div className="flex items-center justify-between mt-1.5 px-1">
          <p className="text-[10px] text-muted-foreground">
            {draft.length}/{MAX_MESSAGE_LENGTH} caractères
          </p>
          <button
            type="button"
            onClick={send}
            disabled={sending || !draft.trim()}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl brand-gradient text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-[0.97] transition-transform"
            aria-label="Envoyer le message"
          >
            {sending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
