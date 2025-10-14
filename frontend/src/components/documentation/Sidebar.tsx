"use client";

import { useState, useMemo } from 'react';
import { ChevronRight, FileText, Rocket, Settings, Palette, Cloud, Search } from 'lucide-react';
import { ScrollArea } from '@/components/documentation/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  icon: any;
  items: {
    title: string;
    href: string;
  }[];
}

const navItems: NavItem[] = [
  {
    title: 'Getting Started',
    icon: Rocket,
    items: [
      { title: 'Introduction', href: '#introduction' },
      { title: 'Installation', href: '#installation' },
      { title: 'Quick Start', href: '#quick-start' },
    ],
  },
  {
    title: 'Configuration',
    icon: Settings,
    items: [
      { title: 'Configuration', href: '#configuration' },
      { title: 'Environment Variables', href: '#environment' },
      { title: 'TypeScript', href: '#typescript' },
    ],
  },
  {
    title: 'Customization',
    icon: Palette,
    items: [
      { title: 'Customization', href: '#customization' },
      { title: 'Theming', href: '#theming' },
      { title: 'Components', href: '#components' },
    ],
  },
  {
    title: 'Deployment',
    icon: Cloud,
    items: [
      { title: 'Deployment', href: '#deployment' },
      { title: 'Vercel', href: '#vercel' },
      { title: 'Docker', href: '#docker' },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'Getting Started',
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNavItems = useMemo(() => {
    if (!searchQuery.trim()) return navItems;

    const query = searchQuery.toLowerCase();
    return navItems
      .map(section => ({
        ...section,
        items: section.items.filter(item => 
          item.title.toLowerCase().includes(query) ||
          section.title.toLowerCase().includes(query)
        )
      }))
      .filter(section => section.items.length > 0);
  }, [searchQuery]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Auto-expand sections when searching
    if (e.target.value.trim()) {
      const sectionsToExpand = filteredNavItems.map(section => section.title);
      setExpandedSections(sectionsToExpand);
    } else {
      // Reset to default expanded sections when search is cleared
      setExpandedSections(['Getting Started']);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setExpandedSections(['Getting Started']);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-72 bg-[#000000]/95 backdrop-blur-lg border-r border-white/5 z-30 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ScrollArea className="h-full">
          {/* Search Bar */}
          <div className="p-6 pb-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Search results count */}
            {searchQuery && (
              <div className="mt-2 text-xs text-slate-500">
                Found {filteredNavItems.reduce((acc, section) => acc + section.items.length, 0)} results
              </div>
            )}
          </div>

          <nav className="p-6 space-y-2">
            {filteredNavItems.length > 0 ? (
              filteredNavItems.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(section.title) || searchQuery.length > 0;

                return (
                  <div key={section.title} className="space-y-1">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{section.title}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-6 space-y-1 border-l border-white/10 pl-3">
                        {section.items.map((item) => (
                          <a
                            key={item.title}
                            href={item.href}
                            onClick={handleLinkClick}
                            className="block px-3 py-2 text-sm text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
                          >
                            {item.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // No results state
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No results found for "{searchQuery}"</p>
                <button
                  onClick={clearSearch}
                  className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
}