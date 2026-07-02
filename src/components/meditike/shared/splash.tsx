"use client";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";

export function SplashScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background warm-gradient">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <LogoMark size={72} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 font-display font-extrabold text-2xl tracking-tight">
          Medi<span className="text-gradient-gold">Tike</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Santé · Togo</motion.p>
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.7, duration: 0.6 }} className="mt-6 w-40">
          <KenteDivider />
        </motion.div>
      </motion.div>
    </div>
  );
}
