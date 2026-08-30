import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ShieldCheck, Scale, FileText, X, AlertTriangle, Lock, Printer, CheckCircle2 } from "lucide-react";

// ==========================================
// LEGAL MODAL (PRIVACY POLICY & TERMS LIGHTBOX)
// Developer protection disclaimers & privacy policy
// ==========================================
const LegalModal = ({ isOpen, onClose, initialTab = "privacy" }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
    const mounted = typeof window !== "undefined";

    // Sync tab when initialTab prop changes upon opening modal
    if (isOpen && initialTab !== prevInitialTab) {
        setPrevInitialTab(initialTab);
        setActiveTab(initialTab);
    }

    // Handle ESC key and scroll locking
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    const handlePrint = () => {
        window.print();
    };

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div 
                className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* Top Accent Gradient Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

                {/* Modal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-inner shrink-0">
                            {activeTab === "privacy" ? <ShieldCheck size={24} /> : <Scale size={24} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                    Avora Platform Legal Center
                                </h2>
                                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                                    <Lock size={10} /> Verified Developer Standard
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Privacy governance & explicit limitation of liability terms.
                            </p>
                        </div>
                    </div>

                    {/* Action & Close Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                        {/* Tab Switcher Pills */}
                        <div className="inline-flex rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setActiveTab("privacy")}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                                    activeTab === "privacy"
                                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-indigo-300 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                <ShieldCheck size={14} />
                                <span>Privacy Policy</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("terms")}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                                    activeTab === "terms"
                                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-indigo-300 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                <Scale size={14} />
                                <span>Terms & Conditions</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed custom-scrollbar">
                    
                    {activeTab === "privacy" ? (
                        /* PRIVACY POLICY CONTENT */
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-blue-950 dark:text-blue-100">Privacy Summary & Data Protection Commitment</h4>
                                    <p className="mt-1 text-blue-800/90 dark:text-blue-300">
                                        Your privacy is paramount. Avora stores and processes user data strictly to deliver travel memory preservation features. We do not sell your personal data or user-generated media to third parties.
                                    </p>
                                </div>
                            </div>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    1. Information We Collect
                                </h3>
                                <p>
                                    To provide our global travel preservation platform, Avora collects limited information necessary to run the service:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                    <li><strong>Account Credentials:</strong> Full name, email address, profile avatar, and encrypted authentication tokens.</li>
                                    <li><strong>User Content:</strong> Travel memory entries, uploaded photos/videos, geolocation coordinates, titles, and stories.</li>
                                    <li><strong>Technical Telemetry:</strong> IP address, device browser type, operating system version, and system error logs for platform maintenance.</li>
                                </ul>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    2. Storage & Vault Security
                                </h3>
                                <p>
                                    All personal stories and media uploaded to your private vault are secured using industry-standard transport layer encryption (TLS/HTTPS) and protected backend data stores. While we employ rigorous security standards, no electronic storage system can be guaranteed to be 100% impenetrable.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    3. Public Memory Visibility
                                </h3>
                                <p>
                                    Memories published to public status or shared via custom vanity links are visible to internet visitors. You retain full granular control over whether individual travel memories remain private or are made public.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    4. AI Processing & Third-Party Integrations
                                </h3>
                                <p>
                                    Avora utilizes automated AI technologies to assist with travel story enrichment, metadata tagging, and media organization. Automated algorithms process your inputs solely to provide features within your account session.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    5. Data Retention & Erasure Rights
                                </h3>
                                <p>
                                    You maintain full ownership of your data. You may edit, modify, or permanently delete individual travel entries or request full account deletion at any time. Permanent deletion removes all stored records from our primary database stores.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    6. Cookies & Session Storage
                                </h3>
                                <p>
                                    Avora uses essential session storage and functional cookies to maintain your login status, preserve UI theme preferences (light/dark mode), and protect against Cross-Site Request Forgery (CSRF).
                                </p>
                            </section>
                        </div>
                    ) : (
                        /* TERMS & CONDITIONS CONTENT */
                        <div className="space-y-6 animate-in fade-in duration-150">
                            
                            {/* CRITICAL DEVELOPER PROTECTION CALLOUT BOX */}
                            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 p-4 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3 shadow-sm">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-100">
                                        Developer Disclaimer & Absolute Limitation of Liability
                                    </h4>
                                    <p className="leading-relaxed">
                                        This application ("Avora") is provided by the developer on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis. By accessing or using Avora, you explicitly agree that the developer, creators, and platform operators shall bear <strong>NO LEGAL OR FINANCIAL LIABILITY</strong> for data loss, service downtime, content claims, or future allegations.
                                    </p>
                                </div>
                            </div>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    1. Acceptance of Terms
                                </h3>
                                <p>
                                    By registering an account, accessing, or using the Avora platform, you confirm that you have read, understood, and agreed to be legally bound by these Terms & Conditions. If you do not agree to these terms, you must immediately cease all access and usage of the service.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    2. Disclaimer of Warranties ("AS IS")
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    The developer makes no warranties or representations of any kind, whether express, implied, statutory, or otherwise, including but not limited to warranties of merchantability, fitness for a particular purpose, uptime guarantees, non-infringement, or data durability. The developer does not guarantee that:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                    <li>The platform will meet your specific personal or commercial requirements.</li>
                                    <li>The service will be uninterrupted, timely, secure, or entirely error-free.</li>
                                    <li>Stored travel memories, images, or metadata will remain permanently accessible or immune to database failure or server corruption.</li>
                                </ul>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    3. Total Limitation of Liability & Indemnification
                                </h3>
                                <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 p-4 space-y-2 border border-slate-200 dark:border-slate-700">
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        Waiver of Claims & Legal Release:
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        To the maximum extent permitted by applicable law, in no event shall the independent developer, contributors, hosting providers, or affiliated entities be liable for any direct, indirect, incidental, special, consequential, exemplary, or punitive damages (including but not limited to loss of data, loss of goodwill, emotional distress, server downtime, or loss of privacy) arising out of or in connection with your use or inability to use the platform.
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <strong>User Indemnification:</strong> You agree to defend, indemnify, and hold harmless the developer from and against any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from your user-submitted content, violation of third-party intellectual property, or breach of these terms.
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    4. User Content & Intellectual Property Ownership
                                </h3>
                                <p>
                                    You retain ownership of the photos, text, and personal travel notes you upload to Avora. By uploading content, you grant the platform a worldwide, non-exclusive, royalty-free license to store, process, format, and display such content solely for the purpose of operating the service for you.
                                </p>
                                <p>
                                    <strong>Prohibited Content:</strong> You strictly warrant that you own or possess all necessary rights/licenses for any media you upload. Uploading unlawful, harmful, hateful, copyright-infringing, or abusive content is strictly prohibited and subject to immediate account termination without notice.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    5. Right to Modify or Terminate Service
                                </h3>
                                <p>
                                    As an independently operated application, the developer reserves the sole right to alter, update, suspend, or discontinue any feature or the entire platform at any time, with or without notice, without incurring any liability to users.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    6. Governing Law & Severability
                                </h3>
                                <p>
                                    These terms shall be governed by and construed in accordance with applicable laws. If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions.
                                </p>
                            </section>

                        </div>
                    )}

                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Last Updated: August 2026</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                            <Printer size={14} />
                            <span>Print</span>
                        </button>
                        
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 dark:shadow-indigo-500/20 transition active:scale-95 cursor-pointer w-full sm:w-auto"
                        >
                            <CheckCircle2 size={15} />
                            <span>I Understand & Accept</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default LegalModal;
