import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Scale, FileText, AlertTriangle, Lock, Printer, ArrowLeft } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// DEDICATED LEGAL PAGE (PRIVACY & TERMS ROUTE)
// Protects developer liability for direct URL access (/privacy & /terms)
// ==========================================
const LegalPage = ({ defaultTab = "privacy" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Derive active tab cleanly from location pathname
  const activeTab = location.pathname === "/terms" 
    ? "terms" 
    : location.pathname === "/privacy" 
      ? "privacy" 
      : defaultTab;

  const handleTabChange = (tab) => {
    navigate(`/${tab}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col w-full transition-colors duration-300">
      <PageTitle title={activeTab === "privacy" ? "Privacy Policy | Avora" : "Terms & Conditions | Avora"} />
      
      {/* Top Navbar */}
      <LandingNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Document</span>
          </button>
        </div>

        {/* Page Title Card Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2541b2] p-8 sm:p-10 text-white shadow-xl mb-8 border border-blue-400/20">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-400/15 blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-inner">
                {activeTab === "privacy" ? <ShieldCheck size={28} /> : <Scale size={28} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {activeTab === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-100 backdrop-blur-md">
                    <Lock size={10} /> Official Standard
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-blue-100/80 font-medium mt-1">
                  Developer disclaimers, limitation of liability, and privacy standards.
                </p>
              </div>
            </div>

            {/* Tab Pill Selector */}
            <div className="inline-flex rounded-2xl bg-white/10 p-1.5 backdrop-blur-md border border-white/15 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleTabChange("privacy")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === "privacy"
                    ? "bg-white text-[#1E3A8A] shadow-md"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <ShieldCheck size={15} />
                <span>Privacy Policy</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("terms")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === "terms"
                    ? "bg-white text-[#1E3A8A] shadow-md"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <Scale size={15} />
                <span>Terms & Conditions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal Document Container */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm leading-relaxed text-sm text-slate-700 dark:text-slate-300 space-y-6">
          
          {activeTab === "privacy" ? (
            /* PRIVACY POLICY CONTENT */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-950 dark:text-blue-100">Privacy Commitment & Data Governance</h4>
                  <p className="mt-1 text-blue-800/90 dark:text-blue-300">
                    Your privacy is paramount. Avora collects and processes user data strictly to deliver travel memory preservation features. We do not sell your personal data or user-generated media to third parties.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Information We Collect</h3>
                <p>To provide our global travel preservation platform, Avora collects limited information necessary to run the service:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Account Credentials:</strong> Full name, email address, profile avatar, and encrypted authentication tokens.</li>
                  <li><strong>User Content:</strong> Travel memory entries, uploaded photos/videos, geolocation coordinates, titles, and stories.</li>
                  <li><strong>Technical Telemetry:</strong> IP address, device browser type, operating system version, and system error logs for platform maintenance.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Storage & Vault Security</h3>
                <p>
                  All personal stories and media uploaded to your private vault are secured using industry-standard transport layer encryption (TLS/HTTPS) and protected backend data stores. While we employ rigorous security standards, no electronic storage system can be guaranteed to be 100% impenetrable.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Public Memory Visibility</h3>
                <p>
                  Memories published to public status or shared via custom vanity links are visible to internet visitors. You retain full granular control over whether individual travel memories remain private or are made public.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. AI Processing & Third-Party Integrations</h3>
                <p>
                  Avora utilizes automated AI technologies to assist with travel story enrichment, metadata tagging, and media organization. Automated algorithms process your inputs solely to provide features within your account session.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">5. Data Retention & Erasure Rights</h3>
                <p>
                  You maintain full ownership of your data. You may edit, modify, or permanently delete individual travel entries or request full account deletion at any time. Permanent deletion removes all stored records from our primary database stores.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">6. Cookies & Session Storage</h3>
                <p>
                  Avora uses essential session storage and functional cookies to maintain your login status, preserve UI theme preferences (light/dark mode), and protect against Cross-Site Request Forgery (CSRF).
                </p>
              </section>
            </div>
          ) : (
            /* TERMS & CONDITIONS CONTENT */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* CRITICAL DEVELOPER PROTECTION CALLOUT BOX */}
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 p-5 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3 shadow-sm">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-100 text-sm">
                    Developer Disclaimer & Absolute Limitation of Liability
                  </h4>
                  <p className="leading-relaxed">
                    This application ("Avora") is provided by the developer on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis. By accessing or using Avora, you explicitly agree that the developer, creators, and platform operators shall bear <strong>NO LEGAL OR FINANCIAL LIABILITY</strong> for data loss, service downtime, content claims, or future allegations.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
                <p>
                  By registering an account, accessing, or using the Avora platform, you confirm that you have read, understood, and agreed to be legally bound by these Terms & Conditions. If you do not agree to these terms, you must immediately cease all access and usage of the service.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Disclaimer of Warranties ("AS IS")</h3>
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Total Limitation of Liability & Indemnification</h3>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-5 space-y-3 border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. User Content & Intellectual Property Ownership</h3>
                <p>
                  You retain ownership of the photos, text, and personal travel notes you upload to Avora. By uploading content, you grant the platform a worldwide, non-exclusive, royalty-free license to store, process, format, and display such content solely for the purpose of operating the service for you.
                </p>
                <p>
                  <strong>Prohibited Content:</strong> You strictly warrant that you own or possess all necessary rights/licenses for any media you upload. Uploading unlawful, harmful, hateful, copyright-infringing, or abusive content is strictly prohibited and subject to immediate account termination without notice.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">5. Right to Modify or Terminate Service</h3>
                <p>
                  As an independently operated application, the developer reserves the sole right to alter, update, suspend, or discontinue any feature or the entire platform at any time, with or without notice, without incurring any liability to users.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">6. Governing Law & Severability</h3>
                <p>
                  These terms shall be governed by and construed in accordance with applicable laws. If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions.
                </p>
              </section>

            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LegalPage;
