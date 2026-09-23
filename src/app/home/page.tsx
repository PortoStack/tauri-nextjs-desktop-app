"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { soundEffects } from "@/utils/audio";

interface ModalData {
  title: string;
  category: string;
  detail: string;
  badge: string;
  status: string;
  actionText: string;
}

const MODAL_CONFIGS: Record<string, ModalData> = {
  deliver: {
    title: "Medication Delivery Mission",
    category: "Autonomous Delivery",
    detail:
      "Target: Ward 4B, Bed 12 (Patient: Johnathan Doe). Prescribed: Ceftriaxone 1g IV + Paracetamol 500mg. Route calculated: Corridor B -> Elevators -> East Wing.",
    badge: "ROUTE READY",
    status: "Robot payload verified • Secure locks engaged",
    actionText: "DISPATCH ROBOT",
  },
  compartment: {
    title: "Secure Drug Compartment",
    category: "Hardware & Locks",
    detail:
      "Multi-drawer biometric motorized lockbox. Drawer 1 (General Meds): LOCKED. Drawer 2 (Refrigerated 4°C): LOCKED. Drawer 3 (Narcotics Vault): BIOMETRIC SECURED.",
    badge: "SECURE ACTIVE",
    status: "RFID Keycard / PIN Authorization Required",
    actionText: "UNLOCK TRAY #1",
  },
  schedule: {
    title: "Medication Round Timetable",
    category: "Clinical Schedule",
    detail:
      "Current Round: 16:00 Afternoon Dose (8 Beds Scheduled). Next Round: 20:00 Night Antibiotics (12 Beds). On-time completion rate: 99.4%.",
    badge: "16:00 ROUND",
    status: "Synchronized with Hospital EHR / EPIC System",
    actionText: "START SCHEDULED ROUND",
  },
  map: {
    title: "Hospital Ward Navigation Map",
    category: "LIDAR Wayfinding",
    detail:
      "Floor 4 Central Care Unit. Active Waypoints: 24 Beds, 2 Nursing Stations, 1 Pharmacy Cleanroom Depot, 1 Auto-Charge Docking Bay. Dynamic collision avoidance active.",
    badge: "FLOOR 04 CCU",
    status: "SLAM LIDAR Map calibrated • 0 obstacles in path",
    actionText: "VIEW FULLSCREEN MAP",
  },
  scanner: {
    title: "Prescription Barcode Scanner",
    category: "Drug Verification",
    detail:
      "Optical 2D Datamatrix & RFID tag reader. Point drug vial or blister pack barcode to scan window for automated 5-Rights verification (Right Patient, Right Drug, Right Dose, Right Time, Right Route).",
    badge: "SCANNER ONLINE",
    status: "Ready for barcode scanning",
    actionText: "ACTIVATE SCANNER",
  },
  people: {
    title: "Patient & Bedside Directory",
    category: "Patient Records",
    detail:
      "Ward 4: 24 active inpatients. 18 medication deliveries completed today. 6 pending confirmation. Realtime wristband Bluetooth LE tracking enabled.",
    badge: "24 PATIENTS",
    status: "EHR Sync: All allergy & vitals charts updated",
    actionText: "SELECT PATIENT BED",
  },
  calculator: {
    title: "Clinical Dosage Unit Calculator",
    category: "Pharmacology",
    detail:
      "IV flow rate (ml/hr), pediatric weight-based dosing (mg/kg), and renal clearance adjustments. Standard dilution formulas loaded.",
    badge: "CALCULATOR",
    status: "Formulary: British National Formulary (BNF) v84",
    actionText: "CALCULATE DOSE",
  },
  temp: {
    title: "Cold Chain Drug Temperature",
    category: "Cold Storage Sensor",
    detail:
      "Internal Refrigerated Chamber: 3.8°C (Set Point: 2.0°C - 8.0°C). Humidity: 42% RH. Insulation integrity: Optimal. Vaccines and insulin stored securely.",
    badge: "3.8°C STABLE",
    status: "Cold chain continuous monitoring active",
    actionText: "CALIBRATE SENSORS",
  },
  intercom: {
    title: "Bedside Video Intercom",
    category: "Tele-Nursing",
    detail:
      "Direct 2-way WebRTC audio/video link between hospital robot and Central Nursing Desk. Touch to initiate video stream for patient consultation.",
    badge: "INTERCOM READY",
    status: "Bandwidth: 5G Hospital Private Network (Latency 12ms)",
    actionText: "CALL NURSE STATION",
  },
  alerts: {
    title: "STAT Physician Drug Orders",
    category: "Urgent Dispatch",
    detail:
      "Incoming High-Priority Orders: 1 STAT Emergency Pain Relief (ICU Bed 03). Automated dispenser tray prepped and awaiting delivery clearance.",
    badge: "1 STAT ORDER",
    status: "Doctor Signature Verified (Dr. S. Vance, MD)",
    actionText: "ACCEPT & DELIVER STAT",
  },
  settings: {
    title: "Robot Hardware & Motor Diagnostics",
    category: "Robotics Hardware",
    detail:
      "Battery: 94% (Lithium Iron Phosphate). Motor Controllers: Dual BLDC Differential Drive (Nominal). LIDAR Frequency: 15Hz. Sonar/Ultrasonic Bumper: 8 Sensors Active.",
    badge: "BATTERY 94%",
    status: "All diagnostic telemetry passes safety threshold",
    actionText: "RUN SELF-TEST",
  },
  drugdb: {
    title: "Hospital Formulary & Drug Database",
    category: "Drug Reference",
    detail:
      "Comprehensive pharmacology encyclopedia with drug-drug interaction checker, contraindications, IV compatibility tables, and high-risk medication flags.",
    badge: "4,200 DRUGS",
    status: "Pharmacy database version 2026.3.2",
    actionText: "SEARCH FORMULARY",
  },
  store: {
    title: "Pharmacy Cart Replenishment",
    category: "Drug Stocking",
    detail:
      "Current Payload: 48 units. Paracetamol 500mg: 12 units remaining. Cefazolin 1g: 8 units. Normal Saline 500ml: 4 bags. Dispenser cartridge inventory logged.",
    badge: "PAYLOAD: 82%",
    status: "Cleanroom restocking verified by Pharmacist ID #904",
    actionText: "LOG RESTOCKING",
  },
  wristband: {
    title: "Patient Wristband Optical Scanner",
    category: "Identity Verification",
    detail:
      "Contactless patient wristband scanner with IR camera and facial recognition confirmation to eliminate medication administration errors.",
    badge: "ID VERIFY",
    status: "Dual-factor optical verification active",
    actionText: "SCAN WRISTBAND",
  },
  audio: {
    title: "Voice Guide & Patient Broadcast",
    category: "Acoustic System",
    detail:
      "Multilingual friendly voice synthesis: 'Hello! Nurse Bot is here with your prescribed medication. Please verify your name.'",
    badge: "VOICE ON",
    status: "Volume: 65 dB (Adaptive Ambient Adjustment)",
    actionText: "TEST VOICE PROMPT",
  },
  cloud: {
    title: "Hospital Cloud & EHR Telemetry",
    category: "Network Sync",
    detail:
      "Bi-directional HL7 / FHIR data pipeline connected to Hospital Information System (HIS). Realtime location & mission logging.",
    badge: "FHIR CONNECTED",
    status: "Sync latency: 4ms • TLS 1.3 Encrypted",
    actionText: "FORCE EHR RESYNC",
  },
  audit: {
    title: "Medication Delivery Audit Trail",
    category: "Regulatory Logs",
    detail:
      "Today's Delivery Log: 36 successful handoffs, 0 discrepancies, average delivery duration: 4.2 minutes per ward. Digital nurse signatures archived.",
    badge: "100% AUDITED",
    status: "FDA / Joint Commission Compliant Logging",
    actionText: "EXPORT AUDIT PDF",
  },
  estop: {
    title: "EMERGENCY MOTOR CUTOFF (E-STOP)",
    category: "Safety Critical",
    detail:
      "IMMEDIATE MOTOR SHUTDOWN AND ELECTROMAGNETIC BRAKE ENGAGEMENT. Robot drive motors will halt instantaneously. Drug drawers will remain tamper-locked.",
    badge: "EMERGENCY SAFETY",
    status: "Safety Interlock Ready",
    actionText: "CONFIRM EMERGENCY STOP",
  },
  dock: {
    title: "Auto-Docking & Charging Bay",
    category: "Navigation Base",
    detail:
      "Robotic self-docking station with magnetic wireless charging dock located in Central Pharmacy Depot. Current charge level: 94%.",
    badge: "DOCK DEPOT #01",
    status: "Charging station vacant and ready for docking",
    actionText: "RETURN TO CHARGING BASE",
  },
  narcotics: {
    title: "Schedule II Narcotics Vault",
    category: "High Security Safe",
    detail:
      "Heavy-gauge electronic safe for controlled substances (Morphine, Fentanyl, Oxycodone). Dual nurse digital sign-off and biometric scan required.",
    badge: "VAULT LOCKED",
    status: "Tamper sensors: ARMED • Weight verification active",
    actionText: "REQUEST DUAL AUTH",
  },
  nurseCall: {
    title: "Direct Nurse Station Pager",
    category: "Assistance Intercom",
    detail:
      "Send high-priority alert chime and live robot GPS coordinates directly to on-duty nurse smart badges and station tablets.",
    badge: "STATION PAGER",
    status: "Registered with 4 on-duty ward nurses",
    actionText: "PAGE DUTY NURSE",
  },
  statMode: {
    title: "STAT Priority Emergency Delivery",
    category: "Fast-Track Navigation",
    detail:
      "Overrides standard multi-bed round sequence to navigate at maximum certified velocity directly to emergency location with audible alert siren.",
    badge: "PRIORITY CODE",
    status: "Corridor clearance beacons active",
    actionText: "INITIATE STAT RUN",
  },
  lidar: {
    title: "360° LIDAR & Obstacle Radar",
    category: "Perception & Safety",
    detail:
      "3D Depth Cameras + 360° Solid-state LIDAR sensor mesh. Detects hospital beds, IV poles, wheelchairs, staff, and patients in realtime.",
    badge: "360° SENSOR HUD",
    status: "Safety bubble: 1.5m clearance radius maintained",
    actionText: "VIEW SENSOR FEEDS",
  },
  telemetry: {
    title: "Dispenser Tray Telemetry",
    category: "Payload Sensors",
    detail:
      "Precision strain gauge weight sensors under each medication drawer. Detects exact pill packet removal to confirm right quantity dispensed.",
    badge: "±0.1g PRECISION",
    status: "Tray 1: 420.5g • Tray 2: 610.2g • Tray 3: 310.0g",
    actionText: "TARE WEIGHT SENSORS",
  },
  dashboard: {
    title: "Drug Delivery Mission Analytics",
    category: "Hospital Ops KPI",
    detail:
      "Summary for 23-Sep-2026: 48 Orders Delivered, 14.8 km Total Traveled, 0 Delivery Errors, Average Transit: 3.8 min. Battery Efficiency: 96%.",
    badge: "100% ACCURACY",
    status: "Weekly performance report updated",
    actionText: "DOWNLOAD OPS REPORT",
  },
};

export default function HomePage() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const mainScrollRef = useRef<HTMLElement | null>(null);

  // Horizontal wheel scroll handler for desktop mouse wheels
  useEffect(() => {
    const el = mainScrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Inactivity timeout: 2 minutes of no touch/interaction automatically redirects to Robot Face ("/")
  useEffect(() => {
    const IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes (120,000 ms)
    let timeoutId: NodeJS.Timeout;

    const resetIdleTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        soundEffects.playHappyChime();
        router.push("/");
      }, IDLE_TIMEOUT_MS);
    };

    // Listen to all touch, pointer, mouse, key, and scroll activities
    const activityEvents = [
      "touchstart",
      "touchmove",
      "touchend",
      "pointerdown",
      "pointermove",
      "mousedown",
      "mousemove",
      "click",
      "keydown",
      "scroll",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Initialize the 2-minute timer on load
    resetIdleTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [router]);

  const handleTileClick = (
    title: string,
    sfx: "chime" | "boop" | "scan" | "alert" = "boop",
    modalKey?: string,
  ) => {
    if (sfx === "alert") soundEffects.playAlert();
    else if (sfx === "scan") soundEffects.playScanSweep();
    else if (sfx === "chime") soundEffects.playHappyChime();
    else soundEffects.playBoop(200);

    if (modalKey) {
      setActiveModal(modalKey);
    }
  };

  const modalInfo = activeModal ? MODAL_CONFIGS[activeModal] : null;

  return (
    <div className="h-screen w-screen bg-[#07090e] text-white flex flex-col justify-between p-3 sm:p-5 md:p-6 lg:p-7 select-none overflow-hidden relative font-sans">
      {/* Dark Theme Futuristic Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-cyan-950/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-blue-950/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP HEADER: Robot Identity, System Status & Operator Profile */}
      <header className="w-full flex items-center justify-between mb-2 sm:mb-4 z-10 shrink-0">
        <div className="flex items-baseline gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white flex items-center gap-3">
            <span>Start</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
          </h1>
          <span className="text-xs sm:text-sm font-mono text-cyan-400 tracking-wider hidden md:inline uppercase">
            {"// MedBot Drug Delivery Terminal • Bay 04 • Idle Return (2m)"}
          </span>
        </div>

        {/* Operator Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs sm:text-sm font-semibold text-slate-100 block">
              Nurse Pharmacist
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              ● DISPATCH ONLINE
            </span>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 border border-cyan-500/40 rounded-sm flex items-center justify-center text-cyan-400 shadow">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </header>

      {/* METRO TILES GRID: HOSPITAL ROBOT DRUG DELIVERY GUI (HORIZONTAL SCROLL X ON OVERFLOW) */}
      <main
        ref={mainScrollRef}
        className="flex-1 w-full flex items-stretch gap-6 sm:gap-10 min-h-0 z-10 pb-2 metro-scroll overscroll-x-contain select-none"
      >
        {/* ================= GROUP 1: PHARMACY DISPENSING & DELIVERY (6 cols x 4 rows) ================= */}
        <div className="flex-1 grid grid-cols-6 grid-rows-4 gap-2.5 sm:gap-3.5 h-full min-h-0 min-w-[760px] sm:min-w-[880px] md:min-w-[980px] lg:min-w-[1100px] shrink-0">
          {/* ROW 1 */}
          {/* 1. Deliver Meds (1x1, Blue) */}
          <div
            onClick={() => handleTileClick("Deliver Meds", "chime", "deliver")}
            className="col-span-1 row-span-1 bg-[#0078d7] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-15zM6 6h12v3H6V6zm0 9h12v3H6v-3z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Deliver Meds
            </span>
          </div>

          {/* 2. Secure Compartment (1x1, Green) */}
          <div
            onClick={() =>
              handleTileClick("Secure Compartment", "boop", "compartment")
            }
            className="col-span-1 row-span-1 bg-[#107c10] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Secure Box
            </span>
          </div>

          {/* 3. Robot Face Visor (2x1 wide, Cyan/Teal) - Links to interactive face */}
          <Link
            href="/"
            onClick={() => soundEffects.playHappyChime()}
            className="col-span-2 row-span-1 bg-[#008299] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-2 7a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 10 9zm4 0a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 14 9zm-2 8a5 5 0 0 1-4.24-2.36 1 1 0 0 1 1.68-1.08 3 3 0 0 0 5.12 0 1 1 0 1 1 1.68 1.08A5 5 0 0 1 12 17z" />
              </svg>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                Robot Face Visor
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/20">
                PATIENT VISOR
              </span>
            </div>
          </Link>

          {/* 4. Medication Schedule (2x1 wide, Purple) */}
          <div
            onClick={() =>
              handleTileClick("Medication Schedule", "boop", "schedule")
            }
            className="col-span-2 row-span-1 bg-[#5c2d91] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                Med Schedule
              </span>
              <span className="text-[9px] font-mono text-purple-200 bg-purple-950/70 px-1.5 py-0.5 rounded">
                16:00 ROUND
              </span>
            </div>
          </div>

          {/* ROW 2 */}
          {/* 5. Ward Navigation Map (1x1, Purple) */}
          <div
            onClick={() =>
              handleTileClick("Ward Navigation Map", "boop", "map")
            }
            className="col-span-1 row-span-1 bg-[#744da9] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Ward Map
            </span>
          </div>

          {/* 6. Prescription Scanner (1x1, Blue) */}
          <div
            onClick={() =>
              handleTileClick("Prescription Scanner", "scan", "scanner")
            }
            className="col-span-1 row-span-1 bg-[#0078d7] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="7" y1="8" x2="7" y2="16" />
                <line x1="10" y1="8" x2="10" y2="16" />
                <line x1="14" y1="8" x2="14" y2="16" />
                <line x1="17" y1="8" x2="17" y2="16" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Rx Scanner
            </span>
          </div>

          {/* 7. Patient Directory (2x1 wide, Orange) */}
          <div
            onClick={() =>
              handleTileClick("Patient Directory", "chime", "people")
            }
            className="col-span-2 row-span-1 bg-[#d83b01] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                Patient Beds
              </span>
              <span className="text-[9px] font-mono text-orange-200 bg-orange-950/70 px-1.5 py-0.5 rounded">
                24 INPATIENTS
              </span>
            </div>
          </div>

          {/* 8. Dosage Calculator (1x1, Green) */}
          <div
            onClick={() =>
              handleTileClick("Dosage Calculator", "boop", "calculator")
            }
            className="col-span-1 row-span-1 bg-[#107c10] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="16" y1="14" x2="16" y2="18" />
                <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Dose Calc
            </span>
          </div>

          {/* 9. Cold Chain Temp (1x1, Blue) */}
          <div
            onClick={() =>
              handleTileClick("Cold Chain Temperature", "chime", "temp")
            }
            className="col-span-1 row-span-1 bg-[#0078d7] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-2z" />
              </svg>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                Cold Chain
              </span>
              <span className="text-[9px] font-mono text-cyan-200">3.8°C</span>
            </div>
          </div>

          {/* ROW 3 */}
          {/* 10. Video Intercom (2x1 wide, Crimson) */}
          <div
            onClick={() =>
              handleTileClick("Video Intercom", "boop", "intercom")
            }
            className="col-span-2 row-span-1 bg-[#a80000] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Tele-Nurse Intercom
            </span>
          </div>

          {/* 11. Doctor Order Alerts (2x1 wide, Blue) */}
          <div
            onClick={() =>
              handleTileClick("Doctor Order Alerts", "boop", "alerts")
            }
            className="col-span-2 row-span-1 bg-[#0078d7] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
              </svg>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                Doctor Orders
              </span>
              <span className="text-[9px] font-mono font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                1 STAT PENDING
              </span>
            </div>
          </div>

          {/* 12. Robot Hardware Settings (1x1, Purple) */}
          <div
            onClick={() =>
              handleTileClick("Robot Hardware Settings", "boop", "settings")
            }
            className="col-span-1 row-span-1 bg-[#5c2d91] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:rotate-45 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Robot Config
            </span>
          </div>

          {/* 13. Drug Database (1x1, Orange) */}
          <div
            onClick={() =>
              handleTileClick("Drug Formulary Database", "boop", "drugdb")
            }
            className="col-span-1 row-span-1 bg-[#d83b01] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Formulary
            </span>
          </div>

          {/* ROW 4 */}
          {/* 14. Pharmacy Cart Replenish (2x1 wide, Green) */}
          <div
            onClick={() =>
              handleTileClick("Pharmacy Cart Replenishment", "chime", "store")
            }
            className="col-span-2 row-span-1 bg-[#107c10] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
              </svg>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                Cart Restock
              </span>
              <span className="text-[9px] font-mono text-emerald-200 bg-emerald-950/70 px-1.5 py-0.5 rounded">
                PAYLOAD: 82%
              </span>
            </div>
          </div>

          {/* 15. Wristband Scanner (1x1, Purple) */}
          <div
            onClick={() =>
              handleTileClick("Wristband Scanner", "scan", "wristband")
            }
            className="col-span-1 row-span-1 bg-[#744da9] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              ID Scanner
            </span>
          </div>

          {/* 16. Voice Guide (1x1, Orange) */}
          <div
            onClick={() =>
              handleTileClick("Voice Guide & Audio", "chime", "audio")
            }
            className="col-span-1 row-span-1 bg-[#d83b01] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Voice Guide
            </span>
          </div>

          {/* 17. Cloud Telemetry (1x1, Blue) */}
          <div
            onClick={() => handleTileClick("Cloud EHR Sync", "boop", "cloud")}
            className="col-span-1 row-span-1 bg-[#0078d7] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              EHR Sync
            </span>
          </div>

          {/* 18. Delivery Audit Log (1x1, Amber/Orange) */}
          <div
            onClick={() =>
              handleTileClick("Delivery Audit Trail", "boop", "audit")
            }
            className="col-span-1 row-span-1 bg-[#d83b01] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Audit Log
            </span>
          </div>
        </div>

        {/* ================= GROUP 2: SAFETY & CRITICAL CONTROLS (2 cols x 4 rows) ================= */}
        <div className="w-[280px] sm:w-[340px] md:w-[380px] lg:w-[420px] grid grid-cols-2 grid-rows-4 gap-2.5 sm:gap-3.5 h-full min-h-0 shrink-0">
          {/* ROW 1 */}
          {/* 19. EMERGENCY E-STOP (1x1, Crimson Red High Visibility) */}
          <div
            onClick={() =>
              handleTileClick("Emergency E-Stop", "alert", "estop")
            }
            className="col-span-1 row-span-1 bg-[#b80d1b] hover:bg-rose-700 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-[0_0_20px_rgba(184,13,27,0.4)] relative group cursor-pointer border border-rose-400/60"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white animate-pulse"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-black tracking-wider text-white uppercase">
              E-STOP
            </span>
          </div>

          {/* 20. Return to Dock (1x1, Purple) */}
          <div
            onClick={() =>
              handleTileClick("Auto Docking Station", "boop", "dock")
            }
            className="col-span-1 row-span-1 bg-[#80397b] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Base Dock
            </span>
          </div>

          {/* ROW 2 */}
          {/* 21. Narcotics Vault (1x1, Green) */}
          <div
            onClick={() =>
              handleTileClick("Narcotics Safe Vault", "boop", "narcotics")
            }
            className="col-span-1 row-span-1 bg-[#217346] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Narcotics Safe
            </span>
          </div>

          {/* 22. Nurse Call Pager (1x1, Blue) */}
          <div
            onClick={() =>
              handleTileClick("Nurse Station Pager", "boop", "nurseCall")
            }
            className="col-span-1 row-span-1 bg-[#0072c6] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Nurse Pager
            </span>
          </div>

          {/* ROW 3 */}
          {/* 23. STAT Priority Mode (1x1, Orange/Red) */}
          <div
            onClick={() =>
              handleTileClick("STAT Priority Mode", "alert", "statMode")
            }
            className="col-span-1 row-span-1 bg-[#d24726] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 2v11h3v9l7-12h-4l4-8z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-bold tracking-wide text-white">
              STAT Priority
            </span>
          </div>

          {/* 24. Obstacle LIDAR HUD (1x1, Navy) */}
          <div
            onClick={() =>
              handleTileClick("LIDAR Obstacle HUD", "boop", "lidar")
            }
            className="col-span-1 row-span-1 bg-[#2b579a] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              LIDAR Radar
            </span>
          </div>

          {/* ROW 4 */}
          {/* 25. Dispenser Telemetry (1x1, Teal) */}
          <div
            onClick={() =>
              handleTileClick("Dispenser Telemetry", "boop", "telemetry")
            }
            className="col-span-1 row-span-1 bg-[#008299] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3v18" />
                <path d="M6 8l6-5 6 5" />
                <path d="M3 13l3 7h12l3-7" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Weight Scales
            </span>
          </div>

          {/* 26. Mission Dashboard (1x1, Green) */}
          <div
            onClick={() =>
              handleTileClick("Mission Dashboard", "boop", "dashboard")
            }
            className="col-span-1 row-span-1 bg-[#107c10] hover:brightness-110 active:scale-95 transition-all p-2.5 sm:p-3 flex flex-col justify-between shadow-md relative group cursor-pointer"
          >
            <div className="flex-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              Mission KPI
            </span>
          </div>
        </div>
      </main>

      {/* INTERACTIVE CLINICAL MODULE POPUP MODAL */}
      {modalInfo && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#0b0f19] border-2 border-cyan-500/50 p-6 max-w-lg w-full shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                  {modalInfo.category}
                </span>
                <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                  <span>{modalInfo.title}</span>
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2.5 py-1 bg-slate-800 hover:bg-slate-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <span className="inline-block text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/30 mb-3">
                {modalInfo.badge}
              </span>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
                {modalInfo.detail}
              </p>
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2 border border-emerald-500/20">
                ● {modalInfo.status}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  soundEffects.playHappyChime();
                  setActiveModal(null);
                }}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow hover:scale-105 active:scale-95"
              >
                {modalInfo.actionText}
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
