const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
code = code.replace(/const \[mobileMenuOpen/g, "const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');\n  const [mobileMenuOpen");
code = code.replace(/        <main\s+id="admin-main-canvas"\s+className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-start max-w-7xl mx-auto w-full"\s+>\s+\)\}/g, `        <main\n          id="admin-main-canvas"\n          className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-start max-w-7xl mx-auto w-full"\n        >`);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
